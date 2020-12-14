const express = require("express");
const { routes } = require("../app");
const router = express.Router();
const mysql = require("../mysql").pool;
const login = require("../middleware/login");

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM qrcode;", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send(result);
    });
  });
});

router.get("/:id_qrcode", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM qrcode WHERE id_qrcode = ?;",
      [req.params.id_qrcode],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length === 0) {
          return res.status(404).send({
            message: "There is no qrcode with this id",
          });
        }

        return res.status(200).send(result);
      }
    );
  });
});

router.post("/", login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO qrcode (title_qrcode, content_qrcode) VALUES(?,?)",
      [req.body.title_qrcode, req.body.content_qrcode],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          message: "qrcode successfully created",
          qrcodeCreated: {
            id_qrcode: result.id_qrcode,
            title_qrcode: req.body.title_qrcode,
            content_qrcode: req.body.content_qrcode,
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

router.patch("/", login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `UPDATE qrcode
          SET title_qrcode = ?, content_qrcode = ? WHERE id_qrcode = ?`,
      [req.body.title_qrcode, req.body.content_qrcode, req.body.id_qrcode],
      (error, resul, fields) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          message: "qrcode successfully updates",
          qrcodeUpdate: {
            id_qrcode: req.body.id_qrcode,
            title_qrcode: req.body.title_qrcode,
            content_qrcode: req.body.content_qrcode,
            request: {
              type: "GET",
              description: "updates qrcode",
              url: "https://localhost:3000/dashboard/" + req.body.id_qrcode,
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

// DELETA UM QRCODE
router.delete("/", login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `DELETE FROM qrcode WHERE id_qrcode = ?`,
      [req.body.id_qrcode],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          message: "qrcode successfully delete",
          request: {
            type: "POST",
            description: "insert qrcode",
            url: "https://localhost:3000/dashboard/",
            body: {
              title_qrcode: "String",
              content_qrcode: "String",
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
