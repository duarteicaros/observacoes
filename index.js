const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const observacoesPorLembreteId = {};
const {
    v4: uuidv4
} = require('uuid');

const funcoes = {
    ObservacaoClassificada: (observacao) => {
        const observacoes =
            observacoesPorLembreteId[observacao.lembreteId];
        const obsParaAtualizar = observacoes.find(o => o.id === observacao.id)

        obsParaAtualizar.status = observacao.status;
        axios.post('http://localhost:10000/eventos', {
            tipo: "ObservacaoAtualizada",
            dados: {
                id: observacao.id,
                texto: observacao.texto,
                lembreteId: observacao.lembreteId,
                status: observacao.status
            }
        });
    }
}

app.post("/eventos", (req, res) => {
    try{
        funcoes[req.body.tipo](req.body.dados);
    }
    catch(err){}
    res.status(200).send({
        msg: "ok"
    });
});


//:id é um placeholder
//exemplo: /lembretes/123456/observacoes

// Na aula de barreamento de eventos colocar isso
const axios = require("axios");

//app.put('/lembretes/:id/observacoes', (req, res) => { --linha antiga do código, mudar para esse debaixo
app.put('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const {
        texto
    } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const observacoesDoLembrete =
        observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({
        id: idObs,
        texto,
        status: 'aguardando'
    });
    observacoesPorLembreteId[req.params.id] =
        observacoesDoLembrete;
    //acrescentar essa linha depois da aula barreamento de eventos
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: {
            id: idObs,
            texto,
            lembreteId: req.params.id,
            status: 'aguardando'
        }
    })
    //daqui pra baixo, normal
    res.status(201).send(observacoesDoLembrete);
});


app.get('/lembretes/:id/observacoes', (req, res, next) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
});

app.listen(5000, (() => {
    console.log('Lembretes. Porta 5000');
}));