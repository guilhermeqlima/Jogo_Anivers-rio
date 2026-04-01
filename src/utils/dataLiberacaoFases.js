const fases = [
	{ numero: 1, nome: "Fase 1", dataLiberacao: "2026-03-22", rota: "../fase1/fase1.html" },
	{ numero: 2, nome: "Fase 2", dataLiberacao: "2026-03-23", rota: "../fase2/fase2.html" },
	{ numero: 3, nome: "Fase 3", dataLiberacao: "2026-03-24", rota: "../fase3/fase3.html" },
	{ numero: 4, nome: "Fase 4", dataLiberacao: "2026-03-24", rota: "../fase4/fase4.html" },
	{ numero: 5, nome: "Fase 5", dataLiberacao: "2026-03-24", rota: "../fase5/fase5.html" },
	{ numero: 6, nome: "Fase 6 - Aniversario", dataLiberacao: "2026-04-11", rota: "../fase6/fase6.html" },
];

function obterFasesOrdenadas() {
	return [...fases].sort((faseA, faseB) => faseA.numero - faseB.numero);
}

module.exports = {
	obterFasesOrdenadas,
};
