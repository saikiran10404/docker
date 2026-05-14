const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = 'mongodb://admin:password@192.168.5.234:27017';
const client = new MongoClient(url);

let db;

/* Connect MongoDB */
async function connectDB() {

    try {

        await client.connect();

        console.log('Connected to MongoDB');

        db = client.db('user-account');

    } catch (err) {

        console.log(err);
    }
}

connectDB();

/* Home Page */
app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname, 'index.html'));
});

/* Get Profile */
app.get('/get-profile', async function (req, res) {

    try {

        const user = await db.collection('users').findOne({ userid: 1 });

        if (user) {

            res.send(user);

        } else {

            res.send({
                name: 'Anna Smith',
                email: 'anna.smith@example.com',
                interests: 'coding'
            });
        }

    } catch (err) {

        console.log(err);

        res.status(500).send(err);
    }
});

/* Update Profile */
app.post('/update-profile', async function (req, res) {

    try {

        const userObj = req.body;

        userObj.userid = 1;

        await db.collection('users').updateOne(
            { userid: 1 },
            { $set: userObj },
            { upsert: true }
        );

        console.log('Profile updated');

        res.send(userObj);

    } catch (err) {

        console.log(err);

        res.status(500).send(err);
    }
});

/* Profile Picture */
app.get('/profile-picture', function (req, res) {

    const img = fs.readFileSync('profile-1.jpg');

    res.writeHead(200, {
        'Content-Type': 'image/jpg'
    });

    res.end(img, 'binary');
});

/* Start Server */
app.listen(3000, function () {

    console.log('App listening on port 3000!');
});