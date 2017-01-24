const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname)))


app.listen(3000, () => {console.log('Listening on 3000...')})
