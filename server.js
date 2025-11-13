const express = require('express');
const path = require('path');
const app = express();

// Serve static files (like index.html)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend server running at http://localhost:${PORT}`);
});
