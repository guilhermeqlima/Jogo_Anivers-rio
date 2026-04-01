const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const usuarioRoutes = require("./src/routes/usuarioRoutes");
const faseRoutes = require("./src/routes/faseRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "jogo-missoes-amor-api" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "jogo-missoes-amor-api" });
});

app.get("/api/config/firebase", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_WEB_API_KEY || "",
    authDomain: process.env.FIREBASE_WEB_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_WEB_PROJECT_ID || "",
    appId: process.env.FIREBASE_WEB_APP_ID || "",
    messagingSenderId: process.env.FIREBASE_WEB_MESSAGING_SENDER_ID || "",
  });
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/fases", faseRoutes);

app.get("/", (req, res) => {
  res.redirect("/telas/login/login.html");
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ erro: err.message || "Erro interno no servidor." });
});

module.exports = app;
