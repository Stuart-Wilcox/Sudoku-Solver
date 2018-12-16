const port = process.env.PORT || 8080;

const fs = require('fs');
const express = require('express');
const http = require('http');

const app = express();

app.use(express.static('public'));

const httpServer = http.createServer(app);

httpServer.listen(port, console.log(`Listening on port ${port}`));
