# URL-Shortner
Deployed link = https://shortened-jt0n.onrender.com 

Built using Node.js, Express.js, MongoDB, Atlas, EJS, Javascript, HTML, CSS, Bootstrap.
Deployed using render

Major dependencies used = 
express-flash : to display flash messages
mongoose : to perform monogoDB operations
ejs : as a templating engine
shortid : to generate random shortened links
dotenv : to store secret files like Atlas's password in .env file

Features = 
Users can shorten any link by pasting the original URL (the URL they would like to shorten). 
Users can also provide their own custom URLs, but it is optional.
If the custom URL is already taken by another user, a flash message is displayed. 
Once the user clicks on the "Shorten" button, they will be redirected to another page that displays the shortened URL link. 
Users can copy the shortened URL and paste it into the browser, which will redirect them to the original URL associated with that shortened URL.
