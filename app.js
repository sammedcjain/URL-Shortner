const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const ejs = require("ejs");
const shortid = require('shortid');
const session = require('express-session');
const flash = require('express-flash');
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(session({ secret: 'your-secret-key' }));
app.use(flash());
app.set('view engine', 'ejs');
require('dotenv').config()
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/urlDB',{useNewUrlParser:true});

const urlSchema = new mongoose.Schema({
  original:String,
  shortened:String
});

const Url = mongoose.model('Url', urlSchema);

// const Url= new Url({
//   original:"https://www.youtube.com/watch?v=5noak227gh8",
//   shortned:""
// });

// fruit.save();
app.get('/', function (req, res) {
  res.redirect('/insert');
});


app.get('/insert', function (req, res) {
  res.render('insert');
});

app.post('/insert', async function (req, res) {
  const originalURL = req.body.originalURL;
  const customShortenedURL = req.body.customShortenedURL;

  let shortURL;
  let customURLExists = false; // Initialize as false

  if (customShortenedURL) {
    // Check if the custom shortened URL already exists in the database
    const existingUrl = await Url.findOne({ shortened: customShortenedURL });
    if (existingUrl) {
      customURLExists = true;
    } else {
      customURLExists = false;
      shortURL = customShortenedURL;
    }
  } else {
    do {
      shortURL = shortid.generate();
      // Check if the generated short URL already exists in the database
      const existingUrl = await Url.findOne({ shortened: shortURL });
      if (!existingUrl) {
        customURLExists = false;
      }
    } while (customURLExists !== false);
  }

  // console.log(shortURL + ' generated');

  if (customURLExists) {
    // Set a flash message for the custom URL error
    req.flash('error', 'Custom URL is already taken.');
    // Redirect back to the form page
    res.redirect('/insert'); // Change this to your form page URL
  } else {
    const newUrl = new Url({
      original: originalURL,
      shortened: shortURL,
    });

    try {
      await newUrl.save();
      // Redirect only when the custom URL is available
      res.redirect(`/display/${shortURL}`);
    } catch (err) {
      console.error(err);
      // Handle the error as needed
      res.status(500).send('Error saving the URL');
    }
  }
});



app.get('/display/:shortened', async function (req, res) {
  const shortURL = req.params.shortened;
  // console.log('Requested shortened URL:', shortURL);

  try {
    const foundUrl = await Url.findOne({ shortened: shortURL });
    // console.log('Found URL in the database:', foundUrl);

    if (foundUrl) {
      // Construct the complete URL by combining the base URL with the shortened URL
      const completeURL = `${req.protocol}://${req.get('host')}/shortened/${foundUrl.shortened}`;

      // Render the display template with the complete URL
      res.render('display', { shortenedURL: completeURL });
    } else {
      // Handle the case when the shortened URL is not found
      console.log("Shortened URL not found in the database!");
      res.status(404).render('display', { shortenedURL: null });
    }
  } catch (error) {
    console.error('Error while querying the database:', error);
    res.status(500).render('display', { shortenedURL: null });
  }
});



// Redirect shortened URL to original URL
app.get('/shortened/:shortened', async function (req, res) {
  const shortURL = req.params.shortened;
  const foundUrl = await Url.findOne({ shortened: shortURL });

  if (foundUrl) {
    // Redirect to the original URL
    res.redirect(foundUrl.original);
  } else {
    // Handle the case when the shortened URL is not found
    console.log("Not found!")
  }
});


let port = process.env.PORT;
if(port==null || port ==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
