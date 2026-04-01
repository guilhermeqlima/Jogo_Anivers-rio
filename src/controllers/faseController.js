const { obterFasesDoUsuario, concluirFase } = require("../services/faseService");

async function listarFasesDoUsuario(req, res, next) {
	try {
		const email = req.params.email;
		const resultado = await obterFasesDoUsuario(email);

		res.json(resultado);
	} catch (erro) {
		console.error(`❌ [FASES] Erro ao listar fases:`, erro);
		next(erro);
	}
}

async function concluirFaseDoUsuario(req, res, next) {
	try {
		const email = req.params.email;
		const { numeroFase } = req.body;

		const resultado = await concluirFase(email, numeroFase);
		res.json(resultado);
	} catch (erro) {
		next(erro);
	}
}

module.exports = {
	listarFasesDoUsuario,
	concluirFaseDoUsuario,
};
