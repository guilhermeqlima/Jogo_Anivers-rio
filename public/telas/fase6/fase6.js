const botaoConcluir = document.getElementById("btn-concluir");
const status = document.getElementById("status");

botaoConcluir.addEventListener("click", async () => {
  const usuario = carregarInformacoesDoUsuarioLogado();

  botaoConcluir.disabled = true;
  status.textContent = "Concluindo fase...";

  try {
    await fetchPost(`/api/fases/${encodeURIComponent(usuario.email)}/concluir`, {
      numeroFase: 6,
    });

    status.textContent = "Fase 6 concluída com sucesso!";
    setTimeout(() => {
      window.location.href = "../mapa/mapa.html";
    }, 800);
  } catch (erro) {
    status.textContent = "Não foi possível concluir agora.";
    botaoConcluir.disabled = false;
  }
});
