'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'password_facile_a_retenir') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
var messaging_events = req.body.entry[0].messaging
for (var i = 0; i < messaging_events.length; i++) {
	var event = req.body.entry[0].messaging[i]
	var sender = event.sender.id
	if (event.message && event.message.text) {
		var text = event.message.text
		sendTextMessage(sender, "Messag reçu : " + text.substring(0, 200))
		}
	}
	res.sendStatus(200)
})
var token = "EAAMG1ILZAy6YBAP8aYZAfY4vS6lKUklsoZAHYZBIwzr5yZA68T4XYbrOxKWrHB3Bom0XyZBNJVfbObXtU4IBw1MsJ3CSxfZCeOdW8hLeYch7Ea2z2RXFfTMG2y4RrLMeDrlcvzkMETZBChI3XEZBxqH6SZAdmMXkRVK2OLtezBOIg5pwZDZD";

function sendTextMessage(sender, text) {
    var messageText = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageText,
	        }
	    }, function(error, response, body) {
	        if (error) {
	            console.log('Une erreur est survenue : ', error)
	        } else if (response.body.error) {
	            console.log('Erreur: ', response.body.error)
	        }
	    })
}
