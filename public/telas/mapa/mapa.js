var fasesCarregadas = [];
let faseAtual = 1;
let usuarioLogado = null;

window.onload = async function () {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado || !usuarioLogado.email) {
        console.warn("⚠️ Usuário não autenticado, redirecionando para login...");
        window.location.href = "/telas/login/login.html";
        return;
    }

    configurarBotaoSair();
    renderizarMapaCarregando();

    await carregarFases();

    setTimeout(() => {
        desenharLinha();
        iniciarContador();
    }, 100);
};

function renderizarMapaCarregando() {
    const mapa = document.getElementById("mapa");

    if (!mapa) return;

    mapa.innerHTML = `
        <div class="mapa-loading" role="status" aria-live="polite" aria-label="Carregando fases do mapa">
            <div class="mapa-loading-bussola" aria-hidden="true"></div>
            <h3>Carregando suas fases...</h3>
            <p>Preparando o mapa com as informacoes mais recentes.</p>
            <div class="mapa-loading-trilha" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
}

function configurarBotaoSair() {
    const botaoSair = document.getElementById("botaoSair");

    botaoSair.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "/telas/login/login.html";
    });
}

async function carregarFases() {
    try {
        const dados = await fetchGet(`/api/fases/${encodeURIComponent(usuarioLogado.email)}`);

        usuarioLogado = {
            ...(usuarioLogado || {}),
            ...(dados.usuario || {}),
        };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        
        fasesCarregadas = dados.fases || [];
        faseAtual = dados.faseAtual || 1;

        preencherDadosDoPerfil(dados.usuario, faseAtual);
        carregarMapa();
    } catch (erro) {
        console.error("❌ Erro ao carregador fases:", erro);
        await mostrarErro("Erro ao carregar fases do usuário. Faça login novamente.");
        localStorage.removeItem("usuarioLogado");
        window.location.href = "/telas/login/login.html";
    }
}

function preencherDadosDoPerfil(usuario, faseAtualAtual) {
    const nomeUsuario = document.getElementById("nomeUsuario");
    const avatar = document.getElementById("avatar");
    const faseUsuario = document.getElementById("faseUsuario");

    const nome = usuario?.nome || usuarioLogado.nome || "Usuário";
    const fotoUrl = usuario?.fotoUrl || usuarioLogado?.fotoUrl || "";

    nomeUsuario.innerText = nome;
    avatar.classList.toggle("avatar-com-foto", Boolean(fotoUrl));

    if (fotoUrl) {
        avatar.innerHTML = `<img src="${fotoUrl}" alt="Foto de ${nome}" referrerpolicy="no-referrer">`;
    } else {
        avatar.textContent = nome.slice(0, 2).toUpperCase();
    }

    faseUsuario.innerText = `Fase ${faseAtualAtual} de ${fasesCarregadas.length}`;
    renderizarMedalhasNoPerfil();
}

function obterConjuntoMedalhasConquistadas() {
    const medalhas = new Set();

    if (typeof window.listarMedalhasConquistadas === "function" && usuarioLogado?.email) {
        const medalhasSalvas = window.listarMedalhasConquistadas(usuarioLogado.email);
        medalhasSalvas.forEach((numeroFase) => medalhas.add(Number(numeroFase)));
    }

    fasesCarregadas.forEach((fase, indice) => {
        if (fase?.concluida) {
            medalhas.add(indice + 1);
        }
    });

    return medalhas;
}

function renderizarMedalhasNoPerfil() {
    const container = document.getElementById("medalhasPerfil");
    if (!container) return;

    const configuracao = typeof window.obterConfiguracaoMedalhas === "function"
        ? window.obterConfiguracaoMedalhas()
        : [
            { numero: 1, icone: "🔐", nome: "Fase 1" },
            { numero: 2, icone: "🌹", nome: "Fase 2" },
            { numero: 3, icone: "🤝", nome: "Fase 3" },
            { numero: 4, icone: "📚", nome: "Fase 4" },
            { numero: 5, icone: "🧩", nome: "Fase 5" },
            { numero: 6, icone: "🎂", nome: "Fase 6" },
            { numero: 7, icone: "👑", nome: "Fase 7" },
        ];

    const medalhasConquistadas = obterConjuntoMedalhasConquistadas();

    container.innerHTML = configuracao
        .map((medalha) => {
            const desbloqueada = medalhasConquistadas.has(Number(medalha.numero));
            const classe = desbloqueada ? "desbloqueada" : "bloqueada";
            const titulo = desbloqueada
                ? `${medalha.nome} conquistada`
                : `${medalha.nome} bloqueada`;

            return `<span class="medalha-fase ${classe}" title="${titulo}" aria-label="${titulo}">${medalha.icone}</span>`;
        })
        .join("");
}

function carregarMapa() {
    const mapa = document.getElementById("mapa");
    mapa.innerHTML = "";

    let mensagem = ` 
        <div class="decoracao-mapa decoracao-esquerda decoracao-image5" aria-hidden="true">
            <img class="decoracao-img decoracao-img-5" src="../../assets/imagens/image%205.png" alt="">
        </div>

        <div class="decoracao-mapa decoracao-direita decoracao-preview" aria-hidden="true">
            <img class="decoracao-img decoracao-img-preview" src="../../assets/imagens/image-removebg-preview.png" alt="">
        </div>

        <div class="decoracao-mapa decoracao-tematica decoracao-image10" aria-hidden="true">
            <img class="decoracao-img decoracao-img-10" src="../../assets/imagens/image%2010.png" alt="">
        </div>

        <div id="personagemFaseAtual" aria-hidden="true">
            <img class="decoracao-img-20" src="../../assets/imagens/image%2020.png" alt="">
        </div>

        <svg id="caminhoMapa" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline id="linhaBloqueada" points="" />
            <polyline id="linhaProgresso" points="" />
        </svg>            
    `;

 mensagem += fasesCarregadas.map((fase, index) => {
    const numeroFase = index + 1;
    const classeAniversario = numeroFase === 6 ? " fase-aniversario" : "";
    const classeFinal = numeroFase === 7 ? " fase-final" : "";
    const orbitasMedalhas = numeroFase === 7 ? criarOrbitasMedalhasDaFaseFinal() : "";

    if (fase.desbloqueada) {
        const classeFase = fase.concluida ? "fase concluida" : "fase disponivel";
        const icone = fase.concluida ? "✅" : "🎁";
        return `<div class="${classeFase}${classeAniversario}${classeFinal}" id="fase${numeroFase}" onclick="abrirFase(${numeroFase})" title="Fase ${numeroFase}">${orbitasMedalhas}<span>${icone}</span><span class="fase-numero">F${numeroFase}</span></div>`;
    }

    const bloqueadaPorTempo = fase.liberadaPorData === false;
    const classeBloqueio = bloqueadaPorTempo ? "bloqueada-tempo" : "bloqueada-sem-tempo";
    const iconeBloqueio = bloqueadaPorTempo ? "⏳" : "🔒";
    const tituloBloqueio = bloqueadaPorTempo ? "Bloqueada por tempo" : "Bloqueada por ordem";

    return `<div class="fase bloqueada ${classeBloqueio}${classeAniversario}${classeFinal}" id="fase${numeroFase}" title="Fase ${numeroFase} - ${tituloBloqueio}">${orbitasMedalhas}<span>${iconeBloqueio}</span><span class="fase-numero">F${numeroFase}</span></div>`;
}).join("");

    mapa.innerHTML = mensagem;

    requestAnimationFrame(() => {
        desenharLinha();
        posicionarPersonagemFaseAtual();
    });
}

function criarOrbitasMedalhasDaFaseFinal() {
    const icones = ["🔐", "🌹", "🤝", "📚", "🧩", "🎂"];

    const medalhas = icones
        .map((icone, indice) => `<span class="medalha-orbita" data-posicao="${indice + 1}" aria-hidden="true">${icone}</span>`)
        .join("");

    return `<div class="fase-medalhas-orbita" aria-hidden="true">${medalhas}</div>`;
}

function obterNumeroFaseAtualVisual() {
    if (!fasesCarregadas.length) return 1;
    const faseAtualNumerica = Number(faseAtual) || 1;
    return Math.max(1, Math.min(faseAtualNumerica, fasesCarregadas.length));
}

function posicionarPersonagemFaseAtual() {
    const personagem = document.getElementById("personagemFaseAtual");
    const mapa = document.getElementById("mapa");

    if (!personagem || !mapa) return;

    const numeroFase = obterNumeroFaseAtualVisual();
    const fase = document.getElementById(`fase${numeroFase}`);

    if (!fase) return;

    const mapaRect = mapa.getBoundingClientRect();
    const faseRect = fase.getBoundingClientRect();

    const x = ((faseRect.left + faseRect.width / 2) - mapaRect.left) / mapaRect.width * 100;
    const y = ((faseRect.top) - mapaRect.top) / mapaRect.height * 100;

    personagem.style.left = `${x}%`;
    personagem.style.top = `${Math.max(8, y - 1)}%`;
}

function calcularPontos() {
    const mapa = document.getElementById("mapa");
    const fases = document.querySelectorAll(".fase");

    if (!mapa || !fases.length) return [];

    const mapaRect = mapa.getBoundingClientRect();
    let pontos = [];

    fases.forEach(fase => {
        const rect = fase.getBoundingClientRect();

        const x = ((rect.left + rect.width / 2) - mapaRect.left) / mapaRect.width * 100;
        const y = ((rect.top + rect.height / 2) - mapaRect.top) / mapaRect.height * 100;

        pontos.push(x + "," + y);
    });

    return pontos;
}

function desenharLinha() {
    const pontos = calcularPontos();

    if (!pontos.length) return;

    document
        .getElementById("linhaBloqueada")
        .setAttribute("points", pontos.join(" "));

    let progresso = pontos.slice(0, faseAtual);

    document
        .getElementById("linhaProgresso")
        .setAttribute("points", progresso.join(" "));
}

function abrirFase(numero) {
    const faseSelecionada = fasesCarregadas[numero - 1];

    if (!faseSelecionada || !faseSelecionada.desbloqueada) return;

    if (faseSelecionada.concluida) {
        mostrarAviso(`A Fase ${numero} já foi concluída. ✅`, "Fase concluída");
        return;
    }

    window.location.href = "../fase" + numero + "/fase" + numero + ".html";
}

function iniciarContador() {

    if (!fasesCarregadas.length) return;

    const elDias = document.getElementById("dias");
    const elHoras = document.getElementById("horas");
    const elMin = document.getElementById("minutos");
    const elSeg = document.getElementById("segundos");
    const elTitulo = document.getElementById("faseAtualTexto");

    function atualizar() {

        const agora = new Date();

        const proximaFaseIndex = fasesCarregadas.findIndex(fase => {
            return new Date(fase.dataLiberacao) > agora;
        });

        // acabou tudo
        if (proximaFaseIndex === -1) {
            document.getElementById("titulo-contador").innerHTML =
                "🎉 Todas as fases desbloqueadas!";
            return;
        }

        const dataAlvo = new Date(fasesCarregadas[proximaFaseIndex].dataLiberacao);

        // título dinâmico
        elTitulo.innerText = `Fase ${proximaFaseIndex + 1}`;

        const diff = dataAlvo - agora;

        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        const segundos = Math.floor((diff / 1000) % 60);

        elDias.innerText = dias.toString().padStart(2, "0");
        elHoras.innerText = horas.toString().padStart(2, "0");
        elMin.innerText = minutos.toString().padStart(2, "0");
        elSeg.innerText = segundos.toString().padStart(2, "0");

        // 🔥 desbloqueia automaticamente
        if (diff <= 0) {
            carregarFases();
            desenharLinha();
        }
    }

    atualizar();
    setInterval(atualizar, 1000);
}

window.addEventListener("resize", desenharLinha);
window.addEventListener("resize", posicionarPersonagemFaseAtual);