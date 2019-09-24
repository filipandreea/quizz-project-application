//SQL shit check ./db.js
//see quizz_app.sql
//db: quizz_app
//set up a user like this or just use root
//user: root
//pass: 

//default imports
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

//route imports
//creates an object of type user
const user = require('./routes/user')

//serve index.html as default
//selects index as the first page to load
serveIndex = (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
}
app.get('/', serveIndex)

//read files
//parse through all the files and serve them  
app.get('/public/:folder/:file', function(req, res) {
    // Note: should use a stream here, instead of fs.readFile
    fs.readFile('./public/' + req.params.folder + "/" + req.params.file, function(err, data) {
        if (err) {
            res.send("Oops! Couldn't find that file.");
        } else {
            // set the content type based on the file
            res.contentType(req.params.file);
            res.send(data);
        }
        res.end();
    });
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use("/user", user)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))