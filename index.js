//We're using the express framework and the mailgun-js wrapper
var express = require("express");
var Mailgun = require("mailgun-js");
var bodyParser = require("body-parser");
//init express
var app = express();

//app port
var port = process.env.PORT || 3030;

//Your api key, from Mailgun’s Control Panel
var api_key = "somekey";

//Your domain, from the Mailgun Control Panel
var domain = "somedomain.mailgun.org";

//Your sending email address
var sender = "someone@domain.com";

var recipients = [sender, "omer@rep-holdings.com"];

app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
// The index redirects here
app.post("/api/submit", function(req, res) {
  //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
  var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
  var parameter = req.body.parameter || "Unknown";

  var data = {
    //Specify email data
    from: sender,
    //The email to contact
    to: recipients,
    //Subject and text data
    subject: "Subject",
    html: `Some text here ${parameter}`
  };

  if (!mail) {
    res.status(400).send("No email specified");
  } else {
    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function(err, body) {
      //If there is an error, render the error page
      if (err) {
        res.status(500).send(err);
        console.log("got an error: ", err);
      }
      //Else we can greet    and leave
      else {
        //Here "submitted.jade" is the view file for this landing page
        //We pass the variable "email" from the url parameter in an object rendered by Jade
        res.status(200).send(req.params.mail);
        console.log(body);
      }
    });
  }
});

app.listen(port);
console.log("Running on port: " + port);
