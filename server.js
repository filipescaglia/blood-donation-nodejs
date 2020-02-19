// Configurando o servidor
const express = require("express");
const server = express();

// Configurando o servidor para apresentar arquivos extras
server.use(express.static('public'));

// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurando conexão ao BD
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

// Configurando o template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(error, result) {
        if (error) return res.send("Erro de bano de dados.");
        
        const donors = result.rows;
        return res.render("index.html", { donors });
    })
});

// Pegar os dados do formulário
server.post("/", function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.");
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`;
    const values = [name, email, blood];
    db.query((query), values, function(error) {
        if(error) return res.send("Erro no banco de dados.");

        return res.redirect("/");
    });
})

// Ligando o servidor na porta 3000
server.listen(3000, function() {
    console.log("servidor iniciado");
});