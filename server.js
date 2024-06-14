const express = require('express');
const request = require('request');
const app = express();

const API_KEY = 'AIzaSyCEj_vL2caLxmvy2NcvVdoZdfBysjZMHbM'; // Replace with your actual API key

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/restaurants', (req, res) => {
    const { latitude, longitude } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${API_KEY}`;
    
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.status(response.statusCode).send(error || 'Error fetching data');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
