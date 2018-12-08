const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Loading required HTML
app.use(express.static(path.join(__dirname, 'public')));

// Loading required JS Files
// Bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
// jQuery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
// Openlayers
app.use('/js', express.static(__dirname + '/node_modules/openlayers/dist'));
// Custom JS
app.use('/js', express.static(__dirname + '/public/js'));

// Loading required CSS Files
// Bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
// Openlayers
app.use('/css', express.static(__dirname + '/node_modules/openlayers/dist'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.redirect('nukes.html');
});

module.exports = app;
