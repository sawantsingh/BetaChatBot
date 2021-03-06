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

		var json = JSON.parse(response.body);
		console.log('Printing json:',json)

		let lattitude = json["latitude"]
		console.log('Printing json:',json)
	})

	res.sendStatus(200)
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
					sendResponseData(sender,response)
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
const token = "EAAJbdXC4E9kBAI3AlQbzScNuCkfhZBZCdoDy6VIVX5VP8m1pBA56xolOWS7RqtQVZCjC9DljgoA9FqdVdgmqALfxYCrqgE6GXJIR7NOxiJOcgK4ZALeeQTZCDo0KweiDhZANT8qcgyMFduJdNzFMe001HMhkHPt6wiOlmZBYq8xZAvjvU1ZC5cRpe"

function sendResponseData(sender,response) {

	 var json = JSON.parse(response.body);
		console.log('Printing json:',json)

		let hourly = json["hourly"]
		let summary = hourly["summary"]
		console.log('Printing json:',summary)


	let messageData = { text:summary }


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


function sendResponseData(sender,response) {

	 var json = JSON.parse(response.body);
		console.log('Printing json:',json)

		let hourly = json["hourly"]
		let summary = hourly["summary"]
		console.log('Printing json:',summary)


	let messageData = { text:summary }


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
					"image_url": "https://scontent-sin6-1.xx.fbcdn.net/v/t31.0-8/17218524_10211278521054605_3920462141316408947_o.jpg?oh=8307dfaf91be1b3608dc99327f12fecb&oe=59971EED",
					"buttons": [{
						"type": "web_url",
						"url": "https://en.wikipedia.org/wiki/Deloitte",
						"title": "Deloitte"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://www.qspiders.com/sites/default/files/sunny%20amar%20nath.jpg",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.allianz.com/en/",
						"title": "Allianz"
					},{
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