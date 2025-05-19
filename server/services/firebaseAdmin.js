const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");
dotenv.config({ path: './server/.env' });

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;