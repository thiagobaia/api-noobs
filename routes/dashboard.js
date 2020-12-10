const express = require("express");
const { routes } = require("../app");
const router = express.Router();

// RETORNA TODOS OS QRCODE
router.get("/", (req, res, next) => {
  res.status(200).send({
    mensagem: "Usando a rota get dashboard",
  });
});

// RETORNA UM QRCODE ESPECIFICO
router.get("/:id_dashboard", (req, res, next) => {
  const id = req.params.id_dashboard;

  if (id === "especial") {
    res.status(200).send({
      mensagem: "Usando rota get para um qrcode dashboard exclusivo ",
      id: id,
    });
  } else {
    res.status(200).send({
      mensagem: "Você passou um ID",
    });
  }
});

// INCLUI UM NOVO QRCODE
router.post("/", (req, res, next) => {
    const dashboard = {
        title: req.body.title,
        content: req.body.content
    }
  res.status(201).send({
    mensagem: "Dashboard Criado ",
    dashboardCriado: dashboard
  });
});

// EDITA UM QRCODE
router.patch("/", (req, res, next) => {
  res.status(200).send({
    mensagem: "Usando rota delete dashboard ",
  });
});

// DELETA UM QRCODE
router.delete("/", (req, res, next) => {
  res.status(200).send({
    mensagem: "Usando rota delete dashboard ",
  });
});

module.exports = router;
