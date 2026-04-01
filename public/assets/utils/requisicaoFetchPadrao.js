// FUNÇÕES PARA REQUISIÇÕES AJAX
async function RequisicaoFetch(url, metodo = "GET", dados = null) {
  const opcoes = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (dados) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error(`❌ Erro HTTP ${resposta.status}:`, erro);
      const mensagemErro = erro || "Erro na requisição";
      const erroHttp = new Error(mensagemErro);
      erroHttp.status = resposta.status;
      erroHttp.url = url;

      if (
        resposta.status === 404 &&
        typeof url === "string" &&
        url.includes("/api/") &&
        (window.location.hostname.endsWith("web.app") ||
          window.location.hostname.endsWith("firebaseapp.com"))
      ) {
        erroHttp.code = "API_BACKEND_INDISPONIVEL";
        erroHttp.message =
          "API indisponivel no deploy. Configure um backend para /api (Cloud Run/Functions) ou ajuste a URL da API.";
      }

      throw erroHttp;
    }

    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("❌ Erro no fetch:", erro.message);
    throw erro;
  }
}

function normalizarBaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function obterApiBasePorHost() {
  const mapaGlobal = window.__API_BASE_URLS__;

  if (!mapaGlobal || typeof mapaGlobal !== "object") {
    return "";
  }

  const host = window.location.hostname;
  const valor = mapaGlobal[host];
  return normalizarBaseUrl(valor);
}

function obterApiBaseUrl() {
  try {
    const query = new URLSearchParams(window.location.search || "");
    const apiQuery = String(query.get("apiBaseUrl") || "").trim();

    if (apiQuery) {
      const apiNormalizada = normalizarBaseUrl(apiQuery);
      localStorage.setItem("apiBaseUrl", apiNormalizada);
      return apiNormalizada;
    }
  } catch (erro) {
    console.warn("Nao foi possivel ler apiBaseUrl da URL:", erro);
  }

  const apiGlobal = String(window.__API_BASE_URL__ || window.API_BASE_URL || "").trim();

  if (apiGlobal) {
    return normalizarBaseUrl(apiGlobal);
  }

  const apiPorHost = obterApiBasePorHost();
  if (apiPorHost) {
    return apiPorHost;
  }

  try {
    const apiStorage = String(localStorage.getItem("apiBaseUrl") || "").trim();
    if (apiStorage) {
      return normalizarBaseUrl(apiStorage);
    }
  } catch (erro) {
    console.warn("Nao foi possivel ler apiBaseUrl do localStorage:", erro);
  }

  return window.location.origin || "";
}

var urlFinal = obterApiBaseUrl();

if (
  (window.location.hostname.endsWith("web.app") ||
    window.location.hostname.endsWith("firebaseapp.com")) &&
  urlFinal === window.location.origin
) {
  console.warn(
    "API base nao configurada no deploy. Defina window.__API_BASE_URL__ ou window.__API_BASE_URLS__ para apontar para seu backend externo."
  );
}

function montarUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (!url.startsWith("/")) {
    return `${urlFinal}/${url}`;
  }

  return `${urlFinal}${url}`;
}

function fetchGet(url) {
  return RequisicaoFetch(montarUrl(url), "GET");
}

function fetchPost(url, dados) {
  return RequisicaoFetch(montarUrl(url), "POST", dados);
}

function fetchPut(url, dados) {
  return RequisicaoFetch(montarUrl(url), "PUT", dados);
}

function fetchDelete(url) {
  return RequisicaoFetch(montarUrl(url), "DELETE");
}
