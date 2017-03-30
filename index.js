//This is still work in progress
/*

 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})
// to post data

app.post('/tryone/', function (req, res) {
	
	console.log(req)

	let urlString = 'https://api.darksky.net/forecast/5fa39d2d3870ab45753d970a62fb4777/' + req.body.coordinate

	console.log(urlString)

	request({
		url: urlString,
		method: 'GET'
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
		res.send(response.body)

	})

})


function localServerTest () {

}


app.post('/webhook/', function (req, res) {
	
	console.log(req);

	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				sendGenericMessage(sender)
				continue
			}
			if (text === 'weather'){
				let urlString = 'https://api.darksky.net/forecast/5fa39d2d3870ab45753d970a62fb4777/37.8267,-122.4233' //req.body.coordinate
				
				request({
					url: urlString,
					method: 'GET'
				}, function(error, response, body) {
					if (error) {
						console.log('Error sending messages: ', error)
					} else if (response.body.error) {
						console.log('Error: ', response.body.error)
					}
					if (response) {
				 		// sendTextMessage(sender, "Received response, echo: " + text.substring(0, 200))

					}
					sendResponseData(sender,response.body)
				})
				continue
			}
      
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
const token = "EAAJbdXC4E9kBADgY9iNK3f8IRusZBNw1TfzvWJKAgbEtEBQBIyWnfa88agtHvFiCAL82airqv3o2YAC1ZC8p9woAxd2bv3awR5e5lcyRd7J4al3qCHPzAqDfYSvJXmDeCn1NN3ZAZAjwZBqg5uMq3K5AoVcGmognHKbWgFxWiSZBRHwKI5njXF"

function sendResponseData(sender,response) {
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: "abc",
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}


function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
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
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://www.qspiders.com/sites/default/files/sunny%20amar%20nath.jpg",
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
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})