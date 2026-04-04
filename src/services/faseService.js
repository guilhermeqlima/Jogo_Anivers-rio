const { obterFasesOrdenadas } = require("../utils/dataLiberacaoFases");
const {
	buscarUsuarioPorEmail,
	atualizarUltimaFaseConcluida,
} = require("./usuarioService");

function dataLiberada(dataLiberacao) {
	const hoje = new Date();
	const dataDaFase = new Date(`${dataLiberacao}T00:00:00`);
	const liberada = hoje >= dataDaFase;
	return liberada;
}

async function obterFasesDoUsuario(email) {
	const usuario = await buscarUsuarioPorEmail(email);

	if (!usuario) {
		console.warn(`⚠️ Usuário não encontrado: ${email}`);
		const erro = new Error("Usuário não encontrado.");
		erro.status = 404;
		throw erro;
	}

	const ultimaFaseConcluida = Number(usuario.ultimaFaseConcluida || 0);
	const fases = obterFasesOrdenadas();

	const fasesComStatus = fases.map((fase) => {
		const faseAnteriorConcluida = fase.numero === 1 || ultimaFaseConcluida >= fase.numero - 1;
		const todasAsAnterioresConcluidas = fase.numero === 1 || ultimaFaseConcluida >= (fases.length - 1);
		const liberadaPorData = dataLiberada(fase.dataLiberacao);
		const desbloqueada = fase.numero === 7
			? todasAsAnterioresConcluidas && liberadaPorData
			: faseAnteriorConcluida && liberadaPorData;
		const concluida = ultimaFaseConcluida >= fase.numero;

		const status = concluida ? "✅ Concluída" : desbloqueada ? "🔓 Desbloqueada" : "🔒 Bloqueada";

		return {
			...fase,
			desbloqueada,
			concluida,
			liberadaPorData,
			faseAnteriorConcluida,
		};
	});

	const faseAtual = Math.min(ultimaFaseConcluida + 1, fasesComStatus.length);

	return {
		usuario: {
			nome: usuario.nome,
			email: usuario.email,
			fotoUrl: usuario.fotoUrl || "",
			ultimaFaseConcluida,
		},
		fases: fasesComStatus,
		faseAtual,
	};
}

async function concluirFase(email, numeroFase) {
	const numeroFaseConvertido = Number(numeroFase);
	const fases = obterFasesOrdenadas();
	const fase = fases.find((faseAtual) => faseAtual.numero === numeroFaseConvertido);

	if (!fase) {
		console.warn(`❌ Fase inválida: ${numeroFaseConvertido}`);
		const erro = new Error("Fase inválida.");
		erro.status = 400;
		throw erro;
	}

	const { usuario } = await obterFasesDoUsuario(email);
	const ultimaFaseConcluida = Number(usuario.ultimaFaseConcluida || 0);

	if (numeroFaseConvertido <= ultimaFaseConcluida) {
		return {
			mensagem: "Fase já estava concluída.",
			ultimaFaseConcluida,
		};
	}

	if (numeroFaseConvertido !== ultimaFaseConcluida + 1) {
		console.warn(`  ❌ Tentativade pular fases (esperado: ${ultimaFaseConcluida + 1}, recebido: ${numeroFaseConvertido})`);
		const erro = new Error("As fases devem ser concluídas em ordem.");
		erro.status = 400;
		throw erro;
	}

	const faseAnteriorConcluida = numeroFaseConvertido === 1 || ultimaFaseConcluida >= numeroFaseConvertido - 1;
	const liberadaPorData = dataLiberada(fase.dataLiberacao);

	if (!faseAnteriorConcluida || !liberadaPorData) {
		console.warn(`  ❌ Fase não está liberada (anterior: ${faseAnteriorConcluida}, data: ${liberadaPorData})`);
		const erro = new Error("Esta fase ainda não está liberada para conclusão.");
		erro.status = 400;
		throw erro;
	}

	const usuarioAtualizado = await atualizarUltimaFaseConcluida(email, numeroFaseConvertido);

	return {
		mensagem: `Fase ${numeroFaseConvertido} concluída com sucesso!`,
		ultimaFaseConcluida: usuarioAtualizado.ultimaFaseConcluida,
	};
}

module.exports = {
	obterFasesDoUsuario,
	concluirFase,
};
