const express = require("express");
const {
	loginComGoogle,
	obterUsuario,
	concluirPrimeiroAcessoDoUsuario,
} = require("../controllers/usuarioController");

const router = express.Router();

router.post("/login", loginComGoogle);
router.post("/:email/primeiro-acesso/concluir", concluirPrimeiroAcessoDoUsuario);
router.get("/:email", obterUsuario);

module.exports = router;
