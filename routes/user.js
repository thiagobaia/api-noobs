const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


// CRIA UM NOVO USUARIO
router.post("/register", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){ return res.status(500).send({ error: error })}
    conn.query('SELECT * FROM user WHERE email = ?', [req.body.email], (error, results) => {
      if(error) { return res.status(500).send({ error: error }) }
      if(results.length > 0){
        res.status(409).send({ mensagem: 'Usuario já cadastrado'})
      } else {

        bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
          if(errBcrypt){return res.status(500).send({ error: errBcrypt})}
          conn.query(
            `INSERT INTO user (name, age, email, password) VALUES (?,?,?,?)`,
            [req.body.name, req.body.age, req.body.email, hash],
            (error, result) => {
              conn.release();
              if(error){ return res.status(500).send({ error: error })}
              response = {
                mensagem: "Usuario criado com sucesso",
                userCreated: {
                  id_user: result.insertId,
                  name: req.body.name,
                  age: req.body.age,
                  email:req.body.email 
                }, 
              }
               return res.status(201).send(response);
            }
          );
        })
        
      }
    })
  });
});


router.post('/login', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error})}
    const query = `SELECT * FROM user WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release();
      if (error) { return res.status(500).send({ error: error}) }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação'})
      }
      bcrypt.compare(req.body.password, results[0].password, (err, result) => {
        if(err) {
          return res.status(401).send({ mensagem: 'Falha na autenticação'})
        }
        if( result) {
          const token = jwt.sign({
            id_user: results[0].id_user,
            email: results[0].email
          }, process.env.JWT_KEY,
          {
            expiresIn: "1h"
          });
          return res.status(200).send({ mensagem: 'Autenticado com sucesso',
          token: token
        });
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação'})
      })
    })
  })
})


module.exports = router;
