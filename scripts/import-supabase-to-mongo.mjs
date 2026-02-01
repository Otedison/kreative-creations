// ARCHIVED: Supabase importer (kept for archive only)
// To run, provide VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const MONGODB_URI = process.env.VITE_MONGODB_URI || '' /* set VITE_MONGODB_URI in your environment */; // credentials removed.
const MONGODB_DB = process.env.VITE_MONGODB_DB_NAME || 'kreative_db';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase credentials not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

async function upsertRecords({ table, collectionName, upsertKey }) {
  console.log(`\n➡️  Importing table '${table}' → collection '${collectionName}' (upsert by '${upsertKey}')`);
  try {
    // Try ordering by common timestamp fields with retry/fallback when a column is missing
    const orderFields = ['created_at', 'subscribed_at', null];
    let res;
    for (const field of orderFields) {
      if (field) {
        // try ordering by the candidate field
        res = await supabase.from(table).select('*').order(field, { ascending: false });
      } else {
        // final fallback: select without ordering
        res = await supabase.from(table).select('*');
      }

      const { error } = res;
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('could not find the table')) {
          console.warn(`   ⚠️  Table '${table}' not found in Supabase; skipping.`);
          return { imported: 0 };
        }
        // if error mentions missing column, try next candidate
        if (msg.includes('column') && (msg.includes('does not exist') || msg.includes('unknown column'))) {
          console.warn(`   ⚠️  Column missing when ordering by '${field}': ${error.message}. Trying next fallback...`);
          continue; // try next field
        }
        // other errors should abort
        throw new Error(error.message || 'Unknown Supabase error');
      }
      // successful fetch (no error) — break loop and proceed
      break;
    }

    const { data, error } = res;

    if (error) {
      // if we exhausted fallbacks and still have an error, handle or throw
      if (error.message && error.message.includes('Could not find the table')) {
        console.warn(`   ⚠️  Table '${table}' not found in Supabase; skipping.`);
        return { imported: 0 };
      }
      throw new Error(error.message || 'Unknown Supabase error');
    }

    const records = data || [];
    if (records.length === 0) {
      console.log(`   ⚠️  Table '${table}' returned no rows.`);
      return { imported: 0 };
    }

    const db = mongoClient.db(MONGODB_DB);
    const coll = db.collection(collectionName);

    let imported = 0;
    for (const r of records) {
      const filter = {};
      if (!r[upsertKey]) {
        console.warn(`   ⚠️  Skipping record without upsert key '${upsertKey}': ${JSON.stringify(r).slice(0, 80)}...`);
        continue;
      }
      filter[upsertKey] = r[upsertKey];
      await coll.replaceOne(filter, r, { upsert: true });
      imported++;
    }

    console.log(`   ✅ Upserted ${imported} record(s) into '${collectionName}'`);
    return { imported };
  } catch (err) {
    console.error(`   ❌ Error importing table '${table}':`, err.message || err);
    return { imported: 0, error: err };
  }
}

(async () => {
  try {
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');

    const summary = {};

    // Comments (use 'id' as unique key)
    summary.comments = await upsertRecords({ table: 'comments', collectionName: 'comments', upsertKey: 'id' });

    // Newsletter subscribers (use 'email' as unique key)
    summary.newsletter_subscribers = await upsertRecords({ table: 'newsletter_subscribers', collectionName: 'newsletter_subscribers', upsertKey: 'email' });

    console.log('\n🎉 Import summary:');
    console.log(`   - comments: ${summary.comments.imported || 0}`);
    console.log(`   - newsletter_subscribers: ${summary.newsletter_subscribers.imported || 0}`);

  } catch (err) {
    console.error('❌ Importer failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await mongoClient.close();
    console.log('\n🔒 MongoDB connection closed');
  }
})();
