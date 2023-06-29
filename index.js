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
  Users.findOne({ UserName: req.body.UserName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            UserName: req.body.UserName,
            Password: req.body.Password,
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
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:UserName', (req, res) => {
  Users.findOne({ UserName: req.params.UserName })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Up-date user data:
app.put("/users/:UserName", (req, res) => {
  Users.findOneAndUpdate({UserName: req.params.UserName},
  {$set: {
    UserName: req.body.UserName,
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

//Delete user:
app.delete("/users/:UserName", (req, res) =>{
  Users.findOneAndRemove ({UserName: req.params.UserName})
  .then ((user)=> {
    if (!user) {
      res.status(400).send(req.params.UserName + " was not found");
    } else {
      res.status(200).send(req.params.UserName + " was deleted!");
    }
  })
  .catch ((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


/* ------------------------------------ FAVORITE MOVIES ----------------------------- */

//Create or add a favorite movie to a list
app.post("/users/:UserName/movies/:MovieID", (req, res) =>{
  Users.findOneAndUpdate({UserName: req.params.UserName},
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
app.delete("/users/:UserName/movies/:MovieID", (req, res) =>{
  Users.findOneAndUpdate({UserName: req.params.UserName},
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
app.get("/movies", (req, res) =>{
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
app.get("/movies/:Title", (req, res)=> {
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
app.get("/movies/genre/:genreName", (req, res)=>{
  Movies.findOne({"Genre.Name": req.params.genreName})
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
app.get("/movies/directors/:directorName", (req, res) => {
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
