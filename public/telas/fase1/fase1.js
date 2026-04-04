const SENHAS_VALIDAS_FASE_1 = ["parabens", "parabéns", "parabens", "parabens!", "parabéns!"];

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

		registrarConclusaoDeFase(1, usuarioLogado.email);
		await celebrarConclusaoDaFase(1);
		window.location.href = "../mapa/mapa.html";
	} catch (erro) {
		await mostrarErro("Não foi possível concluir a fase agora.");
	}
});

