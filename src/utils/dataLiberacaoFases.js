const fases = [
	{ numero: 1, nome: "Fase 1", dataLiberacao: "2026-04-06", rota: "../fase1/fase1.html" },
	{ numero: 2, nome: "Fase 2", dataLiberacao: "2026-04-07", rota: "../fase2/fase2.html" },
	{ numero: 3, nome: "Fase 3", dataLiberacao: "2026-04-08", rota: "../fase3/fase3.html" },
	{ numero: 4, nome: "Fase 4", dataLiberacao: "2026-04-09", rota: "../fase4/fase4.html" },
	{ numero: 5, nome: "Fase 5", dataLiberacao: "2026-04-10", rota: "../fase5/fase5.html" },
	{ numero: 6, nome: "Fase 6 - Aniversario", dataLiberacao: "2026-04-11", rota: "../fase6/fase6.html" },
	{ numero: 7, nome: "Fase 7 - Tesouro Final", dataLiberacao: null, rota: "../fase7/fase7.html" },
];

function obterFasesOrdenadas() {
	return [...fases].sort((faseA, faseB) => faseA.numero - faseB.numero);
}

module.exports = {
	obterFasesOrdenadas,
};
