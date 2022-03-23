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
const mysql = require('mysql'); // Access database which contains login and profile information
const session = require('express-session'); // Login session management
const path = require('path'); // To retrieve file paths

/** External files from project */
const astroProfiles = require('./astroProfiles');
const { response } = require('express');

const PORT = 8080; // Port number for express server

const app = express(); // Initialize express server

const SQLHOST = 'localhost'; // ip address and socket for MySQL server (hosted on GCP)
const SQLSOCKET = '3306';
const SQLUSER = 'root'; // username for MySQL server
const SQLPASSWORD = ''; // password for MySQL server (this is omitted on Github repopsitory)
const SQLDB = 'sys';
const connection = mysql.createConnection({
	host: SQLHOST, 
	port: SQLSOCKET,
	user: SQLUSER,
	password: SQLPASSWORD,
	database: SQLDB
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

var currProfile; // Store astrological profile from most recent request

// Direct to login/signup page
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../HTMLFILES/login.html'));
 });	

// Authenticate user
app.post('/auth', function(req, res) {
	// Capture the input fields
	let username = req.body.username;
	let pw = req.body.pw;
	// Ensure the input fields exists and are not empty
	if (username && pw) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        // DB contains: username, password, email, array of astroProfiles
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, pw], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	}
	else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

// Create new user
app.post('/newuser', function(req, res) {

	// Capture the input fields
	let username = req.body.username;
	let email = req.body.email;
	let pw = req.body.pw;
	let pwconfirm = req.body.pwconfirm;

	// Ensure the input fields exists and are not empty
	if (username && email && pw && pwconfirm) {

		// Check whether passwords match
		if(pw !== pwconfirm) {
			res.send('Passwords don\'t match.');
			res.end();
			return;
		}

		// Check whether username exists
		connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				res.send('Username already exists');
				res.end();
				return;
			}
		});

		// Check whether email exists
		connection.query('SELECT * FROM accounts WHERE email = ?', [email], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				res.send('Email already associated with an account.');
				res.end();
				return;
			}
		});

		// Create new account
		connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, pw, email], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			
			// Otherwise, authenticate the user
			req.session.loggedin = true;
			req.session.username = username;
			// Redirect to home page
			res.redirect('/home');
			res.end();
			return;
		});

	}
	else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

// Logout user
app.post('/logout', function(req, res) {
    req.session.loggedin = false;
    res.redirect('/');
	}
);

// Submit birth information to the server
app.post('/chartdata', (req, res) => {
  
    currProfile = JSON.stringify(new astroProfiles.Profile(req.body.name, req.body.bdate, req.body.btime));

    /**
     * Redirect user to chart.html (the page that displays their birth chart).
     * This page will display a chart using data generated from this server.
     */
     res.sendFile(path.join(__dirname, '../HTMLFILES/chart.html'));
});

// Retrieve the currProfile variable
app.get('/currProfile/', function(req, res){
    res.send(currProfile);
 });

 // Redirect back to home page
app.get('/home', function(req, res){
    if (req.session.loggedin) {
        // Redirect to home page, only if logged in.s
        res.sendFile(path.join(__dirname, '../HTMLFILES/home.html'));
    }
    else {
        // Not logged in? Send user to login page instead
        res.sendFile(path.join(__dirname, '../HTMLFILES/login.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});