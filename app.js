const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('Codenames');
});

app.listen(process.env.PORT);
console.log('Listening on port ' + process.env.PORT + '...');