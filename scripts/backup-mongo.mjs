import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.VITE_MONGODB_URI || '' /* set VITE_MONGODB_URI in your environment */; // credentials removed.
const MONGODB_DB = process.env.VITE_MONGODB_DB_NAME || 'kreative_db';
const collections = ['blogs', 'comments', 'newsletter_subscribers'];

(async () => {
  const date = new Date().toISOString().slice(0, 10);
  const outDir = path.resolve(process.cwd(), `./mongo-backup-${date}`);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`🔍 Backing up DB '${MONGODB_DB}' to ${outDir}`);

  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db(MONGODB_DB);

    const summary = [];

    for (const name of collections) {
      console.log(`➡️  Exporting collection: ${name}`);
      const cursor = db.collection(name).find({});
      const docs = await cursor.toArray();
      const outPath = path.join(outDir, `${name}.json`);
      fs.writeFileSync(outPath, JSON.stringify(docs, null, 2), 'utf8');
      console.log(`   ✅ Wrote ${docs.length} documents to ${outPath}`);
      summary.push({ collection: name, count: docs.length, file: outPath });
    }

    const metaPath = path.join(outDir, 'backup-summary.json');
    fs.writeFileSync(metaPath, JSON.stringify({ date, db: MONGODB_DB, summary }, null, 2));
    console.log(`\n🎉 Backup complete. Summary written to ${metaPath}`);
  } catch (err) {
    console.error('❌ Backup failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
    console.log('\n🔒 Connection closed');
  }
})();
