import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.VITE_MONGODB_URI || '' /* set VITE_MONGODB_URI in your environment */; // credentials removed.
const MONGODB_DB = process.env.VITE_MONGODB_DB_NAME || 'kreative_db';

(async () => {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const coll = db.collection('comments');

    console.log('🔍 Deleting placeholder comments where id starts with "placeholder-" or author_name == "placeholder"');

    const res = await coll.deleteMany({
      $or: [
        { id: { $regex: '^placeholder-' } },
        { author_name: 'placeholder' }
      ]
    });

    console.log(`🗑️  Deleted ${res.deletedCount} placeholder document(s)`);
  } catch (err) {
    console.error('❌ Error deleting placeholders:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
    console.log('\n🔒 Connection closed');
  }
})();
