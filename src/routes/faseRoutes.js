const express = require("express");
const {
	listarFasesDoUsuario,
	concluirFaseDoUsuario,
} = require("../controllers/faseController");

const router = express.Router();

router.get("/:email", listarFasesDoUsuario);
router.post("/:email/concluir", concluirFaseDoUsuario);

module.exports = router;
