const {
	criarOuAtualizarUsuario,
	buscarUsuarioPorEmail,
	concluirPrimeiroAcesso,
} = require("../services/usuarioService");

async function loginComGoogle(req, res, next) {
	try {
		const { nome, email, fotoUrl } = req.body;
		const usuario = await criarOuAtualizarUsuario({ nome, email, fotoUrl });

		res.json({ usuario });
	} catch (erro) {
		console.error(`❌ [LOGIN] Erro:`, erro);
		next(erro);
	}
}

async function obterUsuario(req, res, next) {
	try {
		const email = req.params.email;
		const usuario = await buscarUsuarioPorEmail(email);

		if (!usuario) {
			console.warn(`⚠️ [USUARIO] Usuário não encontrado: ${email}`);
			return res.status(404).json({ erro: "Usuário não encontrado." });
		}
		return res.json({ usuario });
	} catch (erro) {
		console.error(`❌ [USUARIO] Erro:`, erro);
		next(erro);
	}
}

async function concluirPrimeiroAcessoDoUsuario(req, res, next) {
	try {
		const email = req.params.email;
		const usuario = await concluirPrimeiroAcesso(email);
		res.json({ usuario });
	} catch (erro) {
		console.error(`❌ [USUARIO] Erro ao concluir primeiro acesso:`, erro);
		next(erro);
	}
}

module.exports = {
	loginComGoogle,
	obterUsuario,
	concluirPrimeiroAcessoDoUsuario,
};
