const perguntas = [
    {
        pergunta: "Qual o nome do pai da Bela?",
        respostas: ["Gaston", "Charles", "Maurice", "Philippe"],
        respostaCerta: 2
    },
    {
        pergunta: "Quem é o vilão da história?",
        respostas: ["Lumière", "Gaston", "Cogsworth", "LeFou"],
        respostaCerta: 1
    },
    {
        pergunta: "O que a Fera era antes da maldição?",
        respostas: ["Um camponês", "Um príncipe", "Um guerreiro", "Um rei"],
        respostaCerta: 1
    },
    {
        pergunta: "Qual é o nome do cavalo do pai da Bela?",
        respostas: ["Maximus", "Philippe", "Spirit", "Bolt"],
        respostaCerta: 1
    },
    {
        pergunta: "O que a Bela gosta de fazer?",
        respostas: ["Dançar", "Ler livros", "Cozinhar", "Cantar"],
        respostaCerta: 1
    },
    {
        pergunta: "Quem é transformado em bule de chá?",
        respostas: ["Mrs. Potts", "Lumière", "Plumette", "Chip"],
        respostaCerta: 0
    },
    {
        pergunta: "Quem é o ajudante atrapalhado de Gaston?",
        respostas: ["Chip", "LeFou", "Maurice", "Cogsworth"],
        respostaCerta: 1
    },

    {
        pergunta: "O que acontece se a última pétala da rosa cair?",
        respostas: [
            "A Fera desaparece",
            "A maldição se torna permanente",
            "O castelo some",
            "Tudo volta ao normal"
        ],
        respostaCerta: 1
    },
    {
        pergunta: "Qual objeto Chip representa após a maldição?",
        respostas: ["Um relógio", "Uma xícara", "Um prato", "Um livro"],
        respostaCerta: 1
    },
    {
        pergunta: "Quem lançou a maldição sobre o príncipe?",
        respostas: [
            "Uma rainha",
            "Uma feiticeira disfarçada",
            "Um mago poderoso",
            "Um espírito do castelo"
        ],
        respostaCerta: 1
    }
];

var indicieDasPerguntasERespostasSelecionadas =[];
var perguntaAtual = 0;
var numeroDeAcertos = 0;

const ACERTOS_MINIMOS_PARA_CONCLUIR = 8;

const elementoPergunta = document.getElementById("pergunta");
const elementoOpcoes = document.getElementById("opcoes");
const elementoPontuacao = document.getElementById("pontuacao");
const elementoBarraProgresso = document.getElementById("barra-progresso");
const botaoAnterior = document.getElementById("btn-anterior");
const botaoProxima = document.getElementById("btn-proxima");

document.addEventListener("DOMContentLoaded", iniciarQuiz);

function iniciarQuiz() {
    indicieDasPerguntasERespostasSelecionadas = new Array(perguntas.length).fill(null);
    perguntaAtual = 0;
    numeroDeAcertos = 0;

    botaoAnterior.addEventListener("click", voltarPergunta);
    botaoProxima.addEventListener("click", avancarPergunta);

    renderizarPerguntaAtual();
    atualizarPontuacao();
}

function renderizarPerguntaAtual() {
    const perguntaSelecionada = perguntas[perguntaAtual];
    const respostaSelecionada = indicieDasPerguntasERespostasSelecionadas[perguntaAtual];

    elementoPergunta.innerText = `${perguntaAtual + 1}. ${perguntaSelecionada.pergunta}`;
    elementoOpcoes.innerHTML = "";

    perguntaSelecionada.respostas.forEach((resposta, indiceResposta) => {
        const botaoOpcao = document.createElement("button");
        botaoOpcao.className = "opcao";
        botaoOpcao.innerText = resposta;
        botaoOpcao.type = "button";

        if (respostaSelecionada !== null && indiceResposta === respostaSelecionada) {
            botaoOpcao.classList.add("selecionada");
        }

        botaoOpcao.addEventListener("click", () => selecionarResposta(indiceResposta));
        elementoOpcoes.appendChild(botaoOpcao);
    });

    atualizarBarraDeProgresso();
    atualizarEstadoDosBotoes();
}

function selecionarResposta(indiceResposta) {
    indicieDasPerguntasERespostasSelecionadas[perguntaAtual] = indiceResposta;
    atualizarPontuacao();
    renderizarPerguntaAtual();
}

function voltarPergunta() {
    if (perguntaAtual === 0) {
        return;
    }

    perguntaAtual -= 1;
    renderizarPerguntaAtual();
}

async function avancarPergunta() {
    if (indicieDasPerguntasERespostasSelecionadas[perguntaAtual] === null) {
        await mostrarAviso("Selecione uma opção para continuar.");
        return;
    }

    if (perguntaAtual < perguntas.length - 1) {
        perguntaAtual += 1;
        renderizarPerguntaAtual();
        return;
    }

    await finalizarQuiz();
}

function atualizarPontuacao() {
    const perguntasRespondidas = indicieDasPerguntasERespostasSelecionadas.filter((resposta) => resposta !== null).length;

    numeroDeAcertos = indicieDasPerguntasERespostasSelecionadas.reduce((totalAcertos, indiceResposta, indicePergunta) => {
        if (indiceResposta === null) {
            return totalAcertos;
        }

        if (indiceResposta === perguntas[indicePergunta].respostaCerta) {
            return totalAcertos + 1;
        }

        return totalAcertos;
    }, 0);

    elementoPontuacao.innerText = perguntasRespondidas;
}

function atualizarBarraDeProgresso() {
    const progressoAtual = ((perguntaAtual + 1) / perguntas.length) * 100;
    elementoBarraProgresso.style.width = `${progressoAtual}%`;
}

function atualizarEstadoDosBotoes() {
    botaoAnterior.disabled = perguntaAtual === 0;
    botaoAnterior.style.opacity = perguntaAtual === 0 ? "0.6" : "1";
    botaoAnterior.style.cursor = perguntaAtual === 0 ? "not-allowed" : "pointer";

    if (perguntaAtual === perguntas.length - 1) {
        botaoProxima.innerText = "Finalizar";
    } else {
        botaoProxima.innerText = "Próxima ➡️";
    }
}

async function finalizarQuiz() {
    const perguntaNaoRespondida = indicieDasPerguntasERespostasSelecionadas.findIndex((resposta) => resposta === null);

    if (perguntaNaoRespondida !== -1) {
        perguntaAtual = perguntaNaoRespondida;
        renderizarPerguntaAtual();
        await mostrarAviso("Responda todas as perguntas antes de finalizar o quiz.");
        return;
    }

    atualizarPontuacao();

    if (numeroDeAcertos >= ACERTOS_MINIMOS_PARA_CONCLUIR) {
        await salvarConclusaoDaFase2();
        await celebrarConclusaoDaFase(2);
        window.location.href = "../mapa/mapa.html";
        return;
    }

    const tentarNovamente = await confirmarAcao(
        `Você acertou ${numeroDeAcertos}/${perguntas.length}. São necessários ${ACERTOS_MINIMOS_PARA_CONCLUIR} acertos para concluir. Deseja tentar novamente?`
    );

    if (tentarNovamente) {
        reiniciarQuiz();
    }
}

function reiniciarQuiz() {
    indicieDasPerguntasERespostasSelecionadas = new Array(perguntas.length).fill(null);
    perguntaAtual = 0;
    numeroDeAcertos = 0;
    atualizarPontuacao();
    renderizarPerguntaAtual();
}

async function salvarConclusaoDaFase2() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado && usuarioLogado.email) {
        try {
            await fetchPost(`/api/fases/${encodeURIComponent(usuarioLogado.email)}/concluir`, {
                numeroFase: 2
            });
            registrarConclusaoDeFase(2, usuarioLogado.email);
        } catch (erro) {
            console.error("Não foi possível concluir fase no backend:", erro);
            throw erro;
        }
    }
}