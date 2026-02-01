import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.VITE_MONGODB_URI || '<REDACTED_MONGODB_URI>'; // set VITE_MONGODB_URI in env.  
// credentials removed from repo.
const MONGODB_DB = 'kreative_db';

(async () => {
  console.log('🔍 Checking MongoDB (project context)...');
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    console.log('⏳ Attempting to connect (5s timeout)...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db(MONGODB_DB);
    const collections = ['blogs', 'comments', 'newsletter_subscribers'];

    for (const name of collections) {
      try {
        const count = await db.collection(name).countDocuments();
        console.log(`📊 ${name}: ${count}`);
      } catch (err) {
        console.error(`⚠️ Error reading ${name}:`, err.message);
      }
    }

    const sample = await db.collection('blogs').find({}).limit(5).toArray();
    console.log('\n📝 Sample blogs:');
    if (sample.length === 0) console.log('  (none)');
    else sample.forEach((b, i) => console.log(`  ${i + 1}. ${b.title || '(no title)'} - ${b.slug || b._id}`));

  } catch (error) {
    console.error('❌ Connection error:', error.message);
  } finally {
    await client.close();
    console.log('\n🔒 Connection closed');
  }
})();
