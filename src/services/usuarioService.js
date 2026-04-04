const { admin, obterFirestore } = require("../config/firebase");

const NOME_COLECAO_USUARIOS = "usuarios";

function normalizarEmail(email) {
	return String(email || "").trim().toLowerCase();
}

async function buscarUsuarioPorEmail(email) {
	const emailNormalizado = normalizarEmail(email);

	if (!emailNormalizado) {
		throw new Error("E-mail é obrigatório.");
	}

	const db = obterFirestore();
	const referenciaUsuario = db.collection(NOME_COLECAO_USUARIOS).doc(emailNormalizado);
	const documento = await referenciaUsuario.get();

	if (!documento.exists) {
		return null;
	}
	return { id: documento.id, ...documento.data() };
}

async function criarOuAtualizarUsuario({ nome, email, fotoUrl }) {
	const emailNormalizado = normalizarEmail(email);
	const nomeLimpo = String(nome || "").trim();
	const fotoUrlLimpa = String(fotoUrl || "").trim();

	if (!nomeLimpo || !emailNormalizado) {
		throw new Error("Nome e e-mail são obrigatórios.");
	}

	const db = obterFirestore();
	const referenciaUsuario = db.collection(NOME_COLECAO_USUARIOS).doc(emailNormalizado);
	const documentoAtual = await referenciaUsuario.get();

	const payload = {
		nome: nomeLimpo,
		email: emailNormalizado,
		fotoUrl: fotoUrlLimpa,
		updatedAt: admin.firestore.FieldValue.serverTimestamp(),
	};

	if (!documentoAtual.exists) {
		payload.ultimaFaseConcluida = 0;
		payload.primeiro_acesso = true;
		payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
	} else {
		const dadosAtuais = documentoAtual.data() || {};
		if (typeof dadosAtuais.primeiro_acesso !== "boolean") {
			payload.primeiro_acesso = false;
		}
	}

	await referenciaUsuario.set(payload, { merge: true });

	const documentoFinal = await referenciaUsuario.get();
	return { id: documentoFinal.id, ...documentoFinal.data() };
}

async function concluirPrimeiroAcesso(email) {
	const emailNormalizado = normalizarEmail(email);

	if (!emailNormalizado) {
		throw new Error("E-mail é obrigatório.");
	}

	const db = obterFirestore();
	const referenciaUsuario = db.collection(NOME_COLECAO_USUARIOS).doc(emailNormalizado);

	await referenciaUsuario.set(
		{
			primeiro_acesso: false,
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: true }
	);

	const documentoAtualizado = await referenciaUsuario.get();
	return { id: documentoAtualizado.id, ...documentoAtualizado.data() };
}

async function atualizarUltimaFaseConcluida(email, ultimaFaseConcluida) {
	const emailNormalizado = normalizarEmail(email);

	if (!emailNormalizado) {
		throw new Error("E-mail é obrigatório.");
	}

	const db = obterFirestore();
	const referenciaUsuario = db.collection(NOME_COLECAO_USUARIOS).doc(emailNormalizado);

	await referenciaUsuario.set(
		{
			ultimaFaseConcluida,
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: true }
	);

	const documentoAtualizado = await referenciaUsuario.get();
	return { id: documentoAtualizado.id, ...documentoAtualizado.data() };
}

module.exports = {
	buscarUsuarioPorEmail,
	criarOuAtualizarUsuario,
	atualizarUltimaFaseConcluida,
	concluirPrimeiroAcesso,
};
