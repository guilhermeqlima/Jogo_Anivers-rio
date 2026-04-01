import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyBH6MOkY0FminXF8Qe0XJfXUZ6fV55XYsI",
	authDomain: "jogo-amanda.firebaseapp.com",
	projectId: "jogo-amanda",
	storageBucket: "jogo-amanda.firebasestorage.app",
	messagingSenderId: "699624134524",
	appId: "1:699624134524:web:8798e2517b11e395eab6f9",
	measurementId: "G-XEBXP8M8C2",
};

const app = initializeApp(firebaseConfig);
let analytics = null;

isSupported().then((supported) => {
	if (supported) {
		analytics = getAnalytics(app);
	}
});

const auth = getAuth(app);
const botaoGoogle = document.getElementById("btn-google");
const statusLogin = document.getElementById("status-login");

document.addEventListener("DOMContentLoaded", inicializarLogin);

function inicializarLogin() {
	const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
	
	if (usuarioLogado && usuarioLogado.email) {
		window.location.href = "/telas/mapa/mapa.html";
		return;
	}

	botaoGoogle.disabled = false;
	statusLogin.innerText = "";
}

function obterMensagemAmigavelErroLogin(erro) {
	const codigo = erro?.code || "";
	const mensagem = String(erro?.message || "").toLowerCase();

	if (codigo === "auth/unauthorized-domain" || mensagem.includes("unauthorized-domain")) {
		return "Dominio nao autorizado no Firebase Auth. Adicione o dominio do deploy em Authentication > Settings > Authorized domains.";
	}

	if (codigo === "auth/popup-blocked") {
		return "O navegador bloqueou o popup do Google. Permita popups para este site e tente novamente.";
	}

	if (codigo === "auth/popup-closed-by-user") {
		return "Popup de login fechado antes da autenticacao terminar.";
	}

	if (codigo === "API_BACKEND_INDISPONIVEL") {
		return erro.message;
	}

	return erro?.message || "tente novamente";
}

botaoGoogle.addEventListener("click", async () => {
	botaoGoogle.disabled = true;
	statusLogin.innerText = "Abrindo login do Google...";

	try {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" });
		const resultado = await signInWithPopup(auth, provider);
		const usuarioGoogle = resultado.user;

		if (!usuarioGoogle || !usuarioGoogle.email) {
			throw new Error("Falha ao obter e-mail do usuário Google.");
		}

		const payload = {
			nome: usuarioGoogle.displayName || "Usuário",
			email: usuarioGoogle.email,
		};
		const resposta = await window.fetchPost("/api/usuarios/login", payload);

		localStorage.setItem("usuarioLogado", JSON.stringify(resposta.usuario));
		statusLogin.innerText = "Login realizado com sucesso!";
		window.location.href = "/telas/mapa/mapa.html";
	} catch (erro) {
		console.error("❌ Erro no login Google:", erro);
		statusLogin.innerText = `Erro no login: ${obterMensagemAmigavelErroLogin(erro)}`;
		botaoGoogle.disabled = false;
	}
});
