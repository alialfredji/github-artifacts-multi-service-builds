const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ service: 'service-1', port });
});

app.listen(port, () => {
  console.log(`Service 1 running on port ${port}`);
});

module.exports = app;
