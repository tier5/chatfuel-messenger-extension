const express = require('express')
const url = require('url');
const app = express()
const axios = require('axios')
require('dotenv').config()

const websites = [{
    url: "https://tier5.us",
    name: "Tier5",
    logo: "https://tier5.us/images/logo.png"
}, {
    url: "https://textinbulk.com",
    name: "TextinBulk",
    logo: "https://tier5.us/images/logo.png"
}, {
    url: "https://digitalemployeeid.com",
    name: "Digital Employee ID",
    logo: "http://digitalemployeeid.com/public/img/Logo.png"
}];

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.get('/send', (request, response) => {
    const urlParts = url.parse(request.url, true)
    const action = urlParts.query.action
    const psID = urlParts.query.psid

    const botId = process.env.CHATFUEL_BOT_ID;
    const chatfuelToken = process.env.CHATFUEL_BROADCAST_API_TOKEN;
    //const fbPageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    //const userId = process.env.CHATFUEL_USER_ID;
    const blockName = 'Webview Response';

    const query = {
        chatfuel_token: chatfuelToken,
        chatfuel_block_name: blockName,
        'users-selection': action
    }

    //const fbSendApiUrl = `https://graph.facebook.com/v2.6/me/messages?access_token=${fbPageAccessToken}`
    const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${psID}/send`;
    const chatfuelApiUrl = url.format({
        pathname: broadcastApiUrl,
        query
    });

    // var message = {}
    // if (!!action && action >=0 && action <=2) {
    //     message = {
    //         "attachment": {
    //             "type": "template",
    //             "payload": {
    //                 "template_type":"generic",
    //                 "elements": [{
    //                     "title": websites[action].name,
    //                     "image_url": websites[action].logo,
    //                     "subtitle": websites[action].url,
    //                     "default_action": null,
    //                     "buttons":[{
    //                         "type": "web_url",
    //                         "url": websites[action].url,
    //                         "title": "Open Website"
    //                     }]
    //                 }]
    //             }
    //         }
    //     }
    // } else {
    //     message = {
    //         "attachment": {
    //             "type": "image",
    //             "payload":{
    //                 "url": "https://tier5.us/images/logo.png", 
    //                 "is_reusable":true
    //             }
    //         }
    //     }
    // }

    // var payload = {
    //     "messaging_type": "RESPONSE",
    //     "recipient": {
    //       "id": psID
    //     },
    //     "message": message
    // }

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    // axios.post(fbSendApiUrl, payload)
    //     .then(res => response.json(res))
    //     .catch(error => {
    //         console.log(error)
    //         response.json({error: 'error'})
    //     })
    axios.post(chatfuelApiUrl)
        .then(res => response.json({success: true}))
        .catch(error => {
            console.log(error)
            response.json({success: false})
        })   
})

app.get('/card', (request, response) => {
    const urlParts = url.parse(request.url, true)
    const action = urlParts.query.action

    var message = {}
    if (!!action && action >=0 && action <=2) {
        message = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type":"generic",
                    "elements": [{
                        "title": websites[action].name,
                        "image_url": websites[action].logo,
                        "subtitle": websites[action].url,
                        "default_action": null,
                        "buttons":[{
                            "type": "web_url",
                            "url": websites[action].url,
                            "title": "Open Website"
                        }]
                    }]
                }
            }
        }
    } else {
        message = {
            "attachment": {
                "type": "image",
                "payload":{
                    "url": "https://tier5.us/images/logo.png", 
                    "is_reusable":true
                }
            }
        }
    }

    response.json({messages: [message]})
})

app.listen(3000, () => console.log('ChatFuel Messenger Extension is listening on port 3000'))
