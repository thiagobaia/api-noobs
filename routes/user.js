const express = require("express");
const { routes } = require("../app");
const router = express.Router();
const mysql = require("../mysql").pool;

//RETORNA TODOS USUARIOS 
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({ error: error })}
    conn.query(
      'SELECT * FROM user;',
      (error, resultado, fields) => {
        if(error){ return res.status(500).send({ error: error })}
        return res.status(200).send({ response: resultado })
      }
    )
  })
});

// RETORNA DADOS DE UM USUARIO ESPECIFICO PELO ID 
router.get('/:id_user', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({ error: error })}
    conn.query(
      'SELECT * FROM user WHERE id_user = ?;',
      [req.params.id_user],
      (error, resultado, fields) => {
        if(error){ return res.status(500).send({ error: error })}
        return res.status(200).send({ response: resultado })
      }
    )
  })
});

// CRIA UM NOVO USUARIO
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({ error: error })}
    conn.query(
      "INSERT INTO noobs_db.user (name, age, email, password) VALUES(?,?,?,?)",
      [req.body.name, req.body.age, req.body.email, req.body.password],
      (error, resultado, field) => {
        conn.release();
        if(error){ return res.status(500).send({ error: error })}

        res.status(201).send({
          mensagem: "Usuario criado com sucesso",
          id_user: resultado.insertId,
        });
      }
    );
  });
});


// EDITAR INFORMAÇÕES DO USUARIO 
router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({ error: error })}
    conn.query(
      `UPDATE user
          SET name = ?,
           age = ?, 
           email = ?, 
           password = ? 
           WHERE id_user = ? `,
          [
            req.body.name, 
            req.body.age, 
            req.body.email, 
            req.body.password,
            req.body.id_user
          ],
      (error, resultado, fields) => {
        conn.release();
        if(error){ return res.status(500).send({ error: error })}
    
        res.status(202).send({
          mensagem: "Usuario Editado com Sucesso!",
        })
      }
    )
  })
});


//DELETAR CONTA DE USUARIO 
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({ error: error })}
    conn.query(
      `DELETE FROM user WHERE id_user = ?`,[req.body.id_user],
      (error, resultado, fields) => {
        if(error){ return res.status(500).send({ error: error })}
        
        res.status(202).send({
          mensagem: "Usuario deletado",
        })
      }
    )
  })
});


module.exports = router;
