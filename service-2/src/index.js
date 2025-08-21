const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.json({ service: 'service-2', port });
});

app.listen(port, () => {
  console.log(`Service 2 running on port ${port}`);
});

module.exports = app;
