const express = require('express');
const path = require('path');
const app = express();
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
