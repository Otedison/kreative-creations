import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.VITE_MONGODB_URI || '' /* set VITE_MONGODB_URI in your environment */; // credentials removed.
const MONGODB_DB = process.env.VITE_MONGODB_DB_NAME || 'kreative_db';

(async () => {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    const colNames = await db.listCollections().toArray();
    console.log('Collections:', colNames.map(c => c.name).join(', '));
    const coll = db.collection('comments');
    const exists = colNames.some(c => c.name === 'comments');
    if (!exists) {
      console.log('comments collection does not exist');
      return;
    }
    const indexes = await coll.indexes();
    console.log('Indexes on comments:');
    indexes.forEach(idx => console.log(' -', idx.key));
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await client.close();
  }
})();
