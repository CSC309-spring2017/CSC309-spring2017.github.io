'use strict';

// Make sure to install these dependencies!
// Instructions are in the README.
var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var TAs = require('./model/ta');

var app = express();

// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');


// The request body is received on GET or POST.
// This middleware just simplifies things a bit.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

// We have to create custom validators:
// Notice that customValidators is an object with methods defined for
// each of the inputs we want to validate separately.
app.use(expressValidator({
    customValidators: {
        // Hint: You can re-use the regular expressions you used client-side
        // in between the forward slashes in the regular expresson search.
        // The birthday is given as an example.

        isStuNum: function(value) {
            return value.search(/\d{9}\d?$/) !== -1;
        },
        isPhone: function(value) {
            return value.search(/\(?\d{3}\)?-?\d{3}-?\d{4}$/) !== -1;
        },
        isBirthday: function(value) {
            return value.search(/(\d{4})-(\d{2})-(\d{2})$/) !== -1;
        }
    }
})); // This line must be immediately after express.bodyParser()!


// Get the index page:
app.get('/', function (req, res) {
    TAs.find({}, function(err, allTAs) {
        if (err) throw err;
        res.render('tapp', {  // Note that .html is assumed.
            errors: '',
            tas : allTAs
        });
    });
});


// Getting the value from a form input:
app.post('/signup', function(req, res) {
    // Checking if the fields (by name) aren't empty:
    req.assert('stunum', 'A student number is required').notEmpty();
    req.assert('phone', 'A phone number is required').notEmpty();
    req.assert('birthday', 'A birthday is required').notEmpty();

    // .checkBody() looks at POST data, and calls the validation function
    // (.isStuNum() in the first case) on the input field given by the
    // first argument ("stunum" in the first case)

    // Checking student number (use your custom validation functions):
    req.checkBody('stunum',
                  'Student number not formatted properly.').isStuNum();

    // Checking phone number:
    req.checkBody('phone', 'Phone number not formatted properly.').isPhone();

    // Checking birthday:
    req.checkBody('birthday', 'Birthday not formatted properly.').isBirthday();

    // Checking for errors and mapping them:
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    if (errors) {
        // If errors exist, send them back to the form:
        var errorMsgs = { 'errors': {} };

        if (mappedErrors.stunum) {
            errorMsgs.errors.error_stunum = mappedErrors.stunum.msg;
        }

        if (mappedErrors.phone) {
            errorMsgs.errors.error_phone = mappedErrors.phone.msg;
        }

        if (mappedErrors.birthday) {
            errorMsgs.errors.error_birthday = mappedErrors.birthday.msg;
        }

        // Note how the placeholders in tapp.html use this JSON:
        res.render('tapp', errorMsgs);
    } else {
        // You'd do your processing of the submitted data here.
        // We're just showing a JSON of the fields you've validated:
        var response = {
            stunum:req.body.stunum,
            givenname:req.body.givenname,
            familyname:req.body.familyname,
            phone:req.body.phone,
            birthday:req.body.birthday
        };

        new TAs(response).save(function (err, newBook) {
            if (err) {
                throw err;
            } else {
                TAs.find({}, function(err, allTAs) {
                    if (err) throw err;
                    res.end(JSON.stringify(allTAs));
                });
            }
        });
    }
});

var server = app.listen(3000, function() {
  console.log('Running on 127.0.0.1:%s', server.address().port);
});