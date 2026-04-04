// Configure aqui a URL publica do backend no Render (ou outro provedor).
// Exemplo: https://jogo-missoes-amor-api.onrender.com
window.__API_BASE_URL__ = "https://jogo-anivers-rio.onrender.com";
//Teste local
// window.__API_BASE_URL__ = "http://localhost:3000";

// Opcional: mapa por dominio para deploys especificos.
// Se existir valor para o host atual, ele sera usado quando __API_BASE_URL__ estiver vazio.
window.__API_BASE_URLS__ = {
  "jogo-amanda.web.app": "",
  "jogo-amanda.firebaseapp.com": "",
};
