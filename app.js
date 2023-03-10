const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");

const app = express();

require("dotenv").config();
const listID = process.env.MAILCHIMP_LIST_ID;
const mailchimpAuth = process.env.MAILCHIMP_AUTH;

console.log(listID)
console.log(mailchimpAuth)


app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true} ));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const url = 'https://us17.api.mailchimp.com/3.0/lists/' + listID;

  const options = {
    method: 'POST',
    auth: mailchimpAuth
  };

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on('data', (data) => {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})


app.post('/failure', (req, res) => {
  res.redirect('/');
})


app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000... ")
})



