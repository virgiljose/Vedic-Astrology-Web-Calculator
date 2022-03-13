/**
 * Used code from the following StackOverflow solution to implement:
 * (1) Sending form data to be processed by Node JS server.
 * (2) Processing this data.
 * (3) Sending response back to client.
 * https://stackoverflow.com/questions/52675257/how-to-send-data-from-html-to-node-js
*/

/** Libraries for implementing server */
const express = require('express'); // To implement server to handle req/res
const bodyParser = require('body-parser'); // To parse body in HMTL request
const path = require('path'); // To retrieve file paths

/** External files from project */
const astroProfiles = require('./astroProfiles');
const { astroObjects } = require('./enums');

const PORT = 8080;

// https://www.educative.io/edpresso/what-is-typeerror-converting-circular-structure-to-json
const {parse, stringify} = require('flatted/cjs');

const app = express(); // Initialize express server

var currProfile; // Store astrological profile from most recent request

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Submit birth information to the server
app.post('/chartdata', (req, res) => {
  
    currProfile = JSON.stringify(new astroProfiles.Profile(req.body.name, req.body.bdate, req.body.btime));

    /**
     * Redirect user to chart.html (the page that displays their birth chart).
     * This page will display a chart using data generated from this server.
     */
     res.sendFile(path.join(__dirname, '../chart.html'));
});

// Retrieve the currProfile variable
app.get('/currProfile/', function(req, res){
    res.send(currProfile);
 });


const port = PORT;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});