const SENHAS_VALIDAS_FASE_1 = ["rosa", "amor"];

const inputSenha = document.getElementById("input-senha");
const botaoMostrarSenha = document.getElementById("mostrarSenha");
const botaoDesvendar = document.getElementById("btn-desvendar");

botaoMostrarSenha.addEventListener("click", () => {
	const tipoAtual = inputSenha.getAttribute("type");
	inputSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
});

botaoDesvendar.addEventListener("click", async () => {
	const senhaDigitada = String(inputSenha.value || "").trim().toLowerCase();

	if (!SENHAS_VALIDAS_FASE_1.includes(senhaDigitada)) {
		await mostrarErro("Senha incorreta. Tente novamente.", "Senha inválida");
		return;
	}

	const usuarioLogado = carregarInformacoesDoUsuarioLogado();

	try {
		await fetchPost(`/api/fases/${encodeURIComponent(usuarioLogado.email)}/concluir`, {
			numeroFase: 1,
		});

		await mostrarSucesso("Fase 1 concluída com sucesso! 🎉", "Parabéns");
		window.location.href = "../mapa/mapa.html";
	} catch (erro) {
		await mostrarErro("Não foi possível concluir a fase agora.");
	}
});

