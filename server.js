const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { LocalIp } = require('./utils.js');
const moment = require('moment');

const databasePath = "pedidos.json";
const backupPath = "backup";

const app = express();
const port = 3000;


console.log("Ip Local ", LocalIp);

app.use(cors());
app.use(bodyParser.json());

// Servir a página HTML personalizada quando acessar a rota raiz "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'caixa.html'));
});

app.get('/getConnectedDevices', (req, res) => {
    res.json(connectedDevices);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get('/produtos', (req, res) => {
    fs.readFile("products.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo JSON');
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});
app.get('/pedidos', (req, res) => {
    fs.readFile("pedidos.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo JSON');
        }
        try{
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        }catch{
            console.log("Arquivo Json Corrompido ou não encontrado!")
        }
    });
});
app.get('/localIp', (req, res) => {
    res.json(LocalIp)
});
app.get('/Data', (req, res) => {
    res.json(getCurrentDateTime());
});

app.use((req, res, next) => {
    console.log(`Endereço IP conectado: ${req.connection.remoteAddress}`);
    next();
});

app.post('/addData', (req, res) => {
    const newData = req.body;
    fs.readFile("pedidos.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo JSON');
        }

        let jsonData = [];
        if (data) {
            jsonData = JSON.parse(data);
        }

        jsonData.push(newData);

        fs.writeFile(databasePath, JSON.stringify(jsonData, null, 4), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao escrever no arquivo JSON');
            }
            else{
                console.log("Tudo certo graças a Deus");
                exportToCsv(jsonData)
            }

            res.sendStatus(200);
        });
    });
});


function jsonToCsv(jsonData) {
    let csvString = '';

    const headers = Object.keys(jsonData[0]);
    csvString += headers.join(',') + '\n';

    jsonData.forEach(item => {
        const values = headers.map(header => item[header]);
        csvString += values.join(',') + '\n';
    });

    return csvString;
}

function exportToCsv(jsonData) {
    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return;
        }

        try {

            // Convertendo JSON para CSV
            const csvData = jsonToCsv(jsonData);

            // Escrevendo no arquivo CSV
            fs.writeFile('data.csv', csvData, 'utf8', (err) => {
                if (err) {
                    console.error('Erro ao escrever no arquivo CSV:', err);
                    return;
                }
                console.log('Arquivo CSV criado com sucesso!');
            });
        } catch (error) {
            console.error('Erro ao analisar o JSON:', error);
        }
    });
}

// Rota para lidar com solicitações POST para atualizar o JSON
app.post('/atualizarPedido', (req, res) => {
    // Aqui você irá tratar a solicitação de atualização do JSON
    const {Entregue,Id } = req.body;

    // Carrega o arquivo JSON
    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).send('Erro ao ler o arquivo JSON');
        }

        // Converte os dados do arquivo JSON em um objeto JavaScript
        const jsonData = JSON.parse(data);

        // Encontra o cliente no JSON pelo nome
        const cliente = jsonData.find(cliente => cliente.Id === Id);

        // Atualiza o valor de Entregue para o cliente
        if (cliente) {
            cliente.Entregue = Entregue;

            // Salva as alterações de volta no arquivo JSON
            fs.writeFile(databasePath, JSON.stringify(jsonData), 'utf8', err => {
                if (err) {
                    console.error('Erro ao salvar o arquivo JSON:', err);
                    return res.status(500).send('Erro ao salvar o arquivo JSON');
                }

                console.log('JSON atualizado com sucesso!');
                res.send('JSON atualizado com sucesso!');
            });
        } else {
            res.status(404).send('Cliente não encontrado no JSON');
        }
    });
});


function getCurrentDateTime() {
    const currentDateTime = moment();
    const formattedDateTime = currentDateTime.format("DD/MM/YYYY - HH[h]mm");
    return formattedDateTime;
}
