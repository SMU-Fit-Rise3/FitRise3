const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
app.use(express.json()) // body parsing 관련
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;
const prisma = new PrismaClient({});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    console.log(req)
    res.status(200).json({ name: "true", server: "fitrise_server", data: req.body });
})

const stressAPI = require('./stressData')//스트레스 관련 api
app.patch('/users/:id/stress', stressAPI.updateStressData)  //스트레스 계산 && DB저장



