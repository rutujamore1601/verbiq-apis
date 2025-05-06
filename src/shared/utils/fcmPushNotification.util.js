// Download this file from Firebase Console > Project Setting > Service Accounts > Generate new private key
const serviceAccount = require("../../../firebase-adminsdk-yzkys-6011967ef2.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (message) => {
  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    return false;
  }
};

module.exports = {
  sendPushNotification,
};
