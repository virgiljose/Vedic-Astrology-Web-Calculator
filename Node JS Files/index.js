/**
 * Used code from the following StackOverflow solution to implement:
 * (1) Sending form data to be processed by Node JS server.
 * (2) Processing this data.
 * (3) Sending response back to client.
 * https://stackoverflow.com/questions/52675257/how-to-send-data-from-html-to-node-js
*/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const astroProfiles = require('./astroProfiles');


// https://www.educative.io/edpresso/what-is-typeerror-converting-circular-structure-to-json
const {parse, stringify} = require('flatted/cjs');

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/example', (req, res) => {

  birthProfile = new astroProfiles.Profile(req.body.name, req.body.bdate, req.body.btime);
  //console.log(birthProfile);
  res.send(stringify(birthProfile));
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});