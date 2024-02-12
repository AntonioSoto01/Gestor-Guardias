const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let guardias = [];
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
let nextGuardId = 1;


app.post('/api/guards', (req, res) => {
    const guard = req.body;
    guard.id = nextGuardId++;
    guardias.push(guard);
    res.json(guardias);
})

app.get('/api/guards', (req, res) => {
    res.json(guardias);
});
app.delete('/api/guards/:id', (req, res) => {
    const guardId = parseInt(req.params.id, 10);
    guardias = guardias.filter(guard => guard.id !== guardId);
    res.json(guardias);
});
app.put('/api/guards/:id', (req, res) => {
    const guardId = parseInt(req.params.id, 10);
    const guardToUpdate = guardias.find(guard => guard.id === guardId);
    Object.assign(guardToUpdate, req.body);

    res.json(guardias);
});