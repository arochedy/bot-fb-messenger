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
	res.send('Hello world, je suis un chat bot')
})

// Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'password_facile_a_retenir') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Erreur, mauvais token')
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
            if (text === 'Generic') {
                sendGenericMessage(sender)
	                continue
	            }

		sendTextMessage(sender, "Messag reçu : " + text.substring(0, 200))
		}
	}
	res.sendStatus(200)
})
app.post('/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i]
        var sender = event.sender.id
        if (event.message && event.message.text) {
            var text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender)
	                continue
	            }
	            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
	        }
	    }
	    res.sendStatus(200)
})




var token = "EAAMG1ILZAy6YBAE6iw5cVn3LPkTidqBtBNySYPVLVrxTFI9Gqq8hwnYqEwfCbZCob7vJzPlQCa3v0lZCVbmfcCCjfUey1qoFK5pAhv9Ket34W5zHsOO3fwe52m871dlTpnrWOo6ZAF6j5CHd6GZAuznJzcRbQ9Pd1gPRPZC4A7SgZDZD";

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


function sendGenericMessage(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Premiere carte",
                    "subtitle": "Element #1 of an hscroll",
	                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
	                    "buttons": [{
	                        "type": "web_url",
	                        "url": "https://www.messenger.com",
	                        "title": "web url"
	                    }, {
	                        "type": "postback",
	                        "title": "Postback",
	                        "payload": "Payload for first element in a generic bubble",
	                    }],
	                }, {
	                    "title": "Second card",
	                    "subtitle": "Element #2 of an hscroll",
	                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
	                    "buttons": [{
	                        "type": "postback",
	                        "title": "Postback",
	                        "payload": "Payload for second element in a generic bubble",
	                    }],
	                }]
	            }
	        }
	    }
	    request({
	        url: 'https://graph.facebook.com/v2.6/me/messages',
	        qs: {access_token:token},
	        method: 'POST',
	        json: {
	            recipient: {id:sender},
	            message: messageData,
	        }
	    }, function(error, response, body) {
	        if (error) {
	            console.log('Erreur pendant l\'envoi du message ', error)
	        } else if (response.body.error) {
	            console.log('Erreur: ', response.body.error)
	        }
	    })
}
