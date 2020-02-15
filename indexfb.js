const express = require('express');
const app = express()
const path = require('path');

app.use('/',express.static(path.resolve(__dirname, '/template')))
let PORT = 4100
app.listen(PORT, () => {
    console.log(`hello on PORT ${PORT}`);
    
})