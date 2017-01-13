const express = require('express');
var app = express();
const fs = require('fs');

express.static("./html");

app.use((req, res, next)=> {
    console.log(`LOG: Requested URL is ${req.url}`);
    //console.log(`LOG: Request Header is: ${JSON.stringify(req.headers)}`);
    next();
})

app.get("/", function(req, res) {

    fs.readFile("./html/index.html", "utf8", (err, data) => {
       if (err) {
           res.status(500).send("Something bad happened");
       }
       res.send(data); 
    });
});

app.get("/api/:command", (req, res) => {
    console.log(req.params.command);
    if (req.params.command === "aboutme") {
        var language = req.headers["accept-language"];
        var lang2 = "";
        var os = req.headers["user-agent"];
        var os2 = "";
        
        if (language.indexOf(",") !== -1) {
            lang2 = language.slice(0, language.indexOf(","));
        } else {
            lang2 = language;
        }
        
        if (os.indexOf("(") !== -1) {
            os2 = os.slice(os.indexOf("(")+1, os.indexOf(")"));
        } else {
            os2 = os;
        }
        
        var retVal = {
            "ip address": req.headers["x-forwarded-for"],
            "language": lang2,
            "OS": os2
        }
        
        res.json(retVal);
    } else {
        res.sendStatus(404);
    }
});

app.listen(process.env.PORT || 8080);
console.log("Server has started");

