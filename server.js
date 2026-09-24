const express = require("express")
const cors = require("cors")
const eventos = require("./dados.json")

function autoIncrement() {
    return Number(eventos[eventos.length - 1].id) + 1
}

const rotaInicial = (req, res) => {
    res.json("Back-end respondendo")
}

const createEvento = (req, res) => {
    const evento = req.body
    evento.id = autoIncrement()
    eventos.push(evento)
    res.status(201).json(evento)
}

const readEvento = (req, res) => {
    res.json(eventos)
}

const buscaEvento = (req, res) => {
    const evento = eventos.find(e => e.id == Number(req.params.id))

    if (evento) {
        res.json(evento)
    } else {
        res.status(404).json("Id não encontrado")
    }
}

const buscaCidade = (req, res) => {
    const cidade = req.params.cidade.toLowerCase()

    const resultado = eventos.filter(
        e => e.cidade.toLowerCase() == cidade
    )

    if (resultado.length > 0) {
        res.json(resultado)
    } else {
        res.status(404).json("Cidade não encontrada")
    }
}

const buscaTipoEvento = (req, res) => {
    const tipo = req.params.tipo.toLowerCase()

    const resultado = eventos.filter(
        e => e.tipo_evento.toLowerCase() == tipo
    )

    if (resultado.length > 0) {
        res.json(resultado)
    } else {
        res.status(404).json("Tipo de evento não encontrado")
    }
}

const updateEvento = (req, res) => {
    const id = req.params.id
    const dados = req.body
    dados.id = Number(id)
    let status = 0

    eventos.forEach((evento, indice) => {
        if (evento.id == id) {
            eventos[indice] = dados
            status = 1
        }
    })

    if (status == 1) {
        res.status(202).json(dados)
    } else {
        res.status(404).send("Evento não encontrado")
    }
}

const deleteEvento = (req, res) => {
    const id = req.params.id
    let status = 0

    eventos.forEach((evento, indice) => {
        if (evento.id == id) {
            eventos.splice(indice, 1)
            status = 1
        }
    })

    if (status == 1) {
        res.json("Evento excluído com sucesso")
    } else {
        res.status(404).send("Evento não encontrado")
    }
}

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const porta = 3000

app.get("/", rotaInicial)
app.post("/eventos", createEvento)
app.get("/eventos", readEvento)
app.get("/eventos/:id", buscaEvento)
app.get("/eventos/cidade/:cidade", buscaCidade)
app.get("/eventos/tipo/:tipo", buscaTipoEvento)
app.put("/eventos/:id", updateEvento)
app.delete("/eventos/:id", deleteEvento)

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
})