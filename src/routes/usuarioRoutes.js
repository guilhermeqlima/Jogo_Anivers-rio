const express = require("express");
const { loginComGoogle, obterUsuario } = require("../controllers/usuarioController");

const router = express.Router();

router.post("/login", loginComGoogle);
router.get("/:email", obterUsuario);

module.exports = router;
