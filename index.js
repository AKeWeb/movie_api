/* ------------------------------------ SETTING UP SERVER WITH EXPRESS & CONECTING MONGODB WITH MONGOOSE ----------------------------- */

const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*CORS - Cross-Origin Resource Sharing - required */
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

/* Hashing - require bcrypt */
const bcrypt = require('bcrypt');

/*Authentication*/
let auth = require('./auth.js')(app);
const passport = require("passport");
require("./passport.js");

/* REQUIRE MONGOSE AND DEFINED MODELES */
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

/*CONECTING MONGODB WITH MONGOOSE */
mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });


/* ------------------------------------ STATIC FILES ----------------------------- */

// This serves the statics files in the "public" folder
app.use(express.static("public"));

/* ------------------------------------ USERS ----------------------------- */

//Create new user
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
            FavoriteMovies: req.body.FavoriteMovies
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by Username
app.get('/users/:Username', passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Up-date user data:
app.put("/users/:Username", passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
  {$set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday,
    FavoriteMovies: req.body.FavoriteMovies
  }
},
{new: true}
)
.then((upDatedUser)=> {
  if (!upDatedUser) {
    res.status(401).send("Error: User does not exist");
  } else {
    res.status(201).json(upDatedUser);
  }
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error: " + err);
});
});

//Delete user by name:
app.delete("/users/:Username", passport.authenticate("jwt", {session: false}), (req, res) =>{
  Users.findOneAndRemove ({Username: req.params.Username})
  .then ((user)=> {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted!");
    }
  })
  .catch ((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


/* ------------------------------------ FAVORITE MOVIES ----------------------------- */

//Create or add a favorite movie to a list
app.post("/users/:Username/movies/:MovieID", passport.authenticate("jwt", {session: false}), (req, res) =>{
  Users.findOneAndUpdate({Username: req.params.Username},
    {$addToSet: {FavoriteMovies: req.params.MovieID}},
    {new: true}
    )
.then ((upDatedUser) => {
  if (!upDatedUser) {
    res.status(401).send("Error: User does not exit");
  } else {
    res.status(200).json(upDatedUser);
  }
})
.catch ((error) => {
  console.error(err);
  res.status(500).send("Error: " + err);
});
});

//Delete movie from favorite list:
app.delete("/users/:Username/movies/:MovieID", passport.authenticate("jwt", {session: false}), (req, res) =>{
  Users.findOneAndUpdate({Username: req.params.Username},
    {$pull: {FavoriteMovies: req.params.MovieID}},
    {new: true}
    )
.then ((upDatedUser) => {
  if (!upDatedUser) {
    res.status(401).send("Error: User does not exit");
  } else {
    res.status(200).json(upDatedUser);
  }
})
.catch ((error) => {
  console.error(err);
  res.status(500).send("Error: " + err);
});
});


/* ------------------------------------ DETAILS MOVIES ----------------------------- */

// READ: Creating GET route at endpoint "/movies" returning JSON object
app.get("/movies", passport.authenticate("jwt", {session: false}), (req, res) =>{
  Movies.find()
  .then ((movies) => {
    res.status(201).json(movies);
  })
  .catch((error) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//READ: Get route to get a specific movie titel
app.get("/movies/:Title", passport.authenticate("jwt", {session: false}), (req, res)=> {
  Movies.findOne({Title: req.params.Title})
    .then ((movie)=> {
      if (movie) {
        res.status(200).json(movie)
      }else {
        res.status(400).send("Sorry, movie not found!");
      };
    })
    .catch((error) =>{
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ: Get route to get a specific genre
app.get("/movies/genre/:genreName", passport.authenticate("jwt", {session: false}), (req, res)=>{
  Movies.find({"Genre.Name": req.params.genreName})
  .then((movie)=>{
    if(movie) {
      res.status(200).json(movie);
    }else {
      res.status(400).send("Sorry, Movie-Genre not found!");
    };
  })
  .catch((error)=> {
    console.error(err);
    res.status(500).send("Error: " + err);
  })  
});

//READ: Get route to get a specific director
app.get("/movies/directors/:directorName", passport.authenticate("jwt", {session: false}), (req, res) => {
  Movies.find({"Director.Name": req.params.directorName})
  .then ((movie) => {
    if(movie) {
      res.status(200).json(movie);
    }else {
      res.status(400).send("Sorry, Director not found!");
    };
  })
  .catch((error) =>{
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

/* ------------------------------------ LOG ----------------------------- */

// Creating a write stream (in append mode) to the log file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// Log all requests using Morgan
app.use(morgan("combined", { stream: accessLogStream }));

/* ------------------------------------ ERROR HANDLING ----------------------------- */

// Creating error-handling that log all errors to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Sorry, something went wrong!");
});

/* ------------------------------------ LISTEN TO PORT ----------------------------- */

// listen for requests
app.listen(8080, () => {
  console.log("My movie app is listening on port 8080.");
});
