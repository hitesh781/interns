const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Example API endpoint
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Example API to get data from Firestore
exports.getData = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await db.collection('test').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    response.json(data);
  } catch (error) {
    response.status(500).send(error.message);
  }
});

// Add more functions here for your API