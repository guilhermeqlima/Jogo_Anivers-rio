require("dotenv").config();
const admin = require("firebase-admin");

function parseJsonSeguro(valor) {
	try {
		return JSON.parse(valor);
	} catch (erro) {
		return null;
	}
}

function obterCredenciaisOuNulo() {
	const serviceAccountJson = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim();
	if (serviceAccountJson) {
		const serviceAccount = parseJsonSeguro(serviceAccountJson);
		if (serviceAccount?.project_id && serviceAccount?.client_email && serviceAccount?.private_key) {
			return {
				projectId: serviceAccount.project_id,
				clientEmail: serviceAccount.client_email,
				privateKey: String(serviceAccount.private_key).replace(/\\n/g, "\n"),
			};
		}
	}

	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY;

	if (!projectId || !clientEmail || !privateKey) {
		return null;
	}

	return {
		projectId,
		clientEmail,
		privateKey: privateKey.replace(/\\n/g, "\n"),
	};
}

function inicializarFirebase() {
	if (admin.apps.length > 0) {
		return admin.app();
	}

	const credenciais = obterCredenciaisOuNulo();
	const app = credenciais
		? admin.initializeApp({
				credential: admin.credential.cert(credenciais),
		  })
		: admin.initializeApp();
	return app;
}

function obterFirestore() {
	inicializarFirebase();
	return admin.firestore();
}

module.exports = {
	admin,
	obterFirestore,
};
