require('dotenv').config();

const app = require('./main');

const port = process.env.PORT || 3005;

app.listen(port, () => console.log('🔥  Chating Waving 💯 Running on', port));