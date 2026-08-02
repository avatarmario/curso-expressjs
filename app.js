const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>Express.js Course</h1>
        <p>This is a node.js course using Express.js V2</p>
        <p>Running on port: ${PORT}</p>

        `);
});

app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT);
})