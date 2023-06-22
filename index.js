/* ------------------------------------ SETTING UP SERVER WITH EXPRESS ----------------------------- */

const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

app.use(bodyParser.json());

/* ------------------------------------ USER DB ----------------------------- */

//JSON Data of the users
let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "John",
    favoriteMovies: ["Oppenheimer"],
  },
];

/* ------------------------------------ MOVIE DB ----------------------------- */

// JSON Data of the Top Movies 2023:
let movies = [
  {
    title: "John Wick: Chapter 4",
    genre: "Action",
    director: "Chad Stahelski",
    extract:
      "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    year: "2023",
    rating: "7.9",
  },
  {
    title: " Killers of the Flower Moon",
    genre: "Crime",
    director: "Martin Scorsese",
    extract:
      "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation involving J. Edgar Hoover.",
    year: "2023",
    rating: "9.3",
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation",
    director: " Joaquim Dos Santos",
    extract:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    year: "2023",
    rating: "9.0",
  },
  {
    title: "Oppenheimer",
    genre: "Biography",
    director: "Christopher Nolan",
    extract:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    year: "2023",
    rating: "none",
  },
  {
    title: " Dune: Part Two",
    genre: "Action",
    director: " Denis Villeneuve",
    extract:
      "A boy becomes the Messiah of nomads on a desert planet that has giant worms that protect a commodity called Spice. Spice changes people into travelers, mystics and madmen. What price will he pay to become the new ruler of their universe?",
    year: "2023",
    rating: "none",
  },
  {
    title: " Indiana Jones and the Dial of Destiny",
    genre: "Action",
    director: "James Mangold",
    extract:
      "Archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.",
    year: "2023",
    rating: "none",
  },
  {
    title: "Mission: Impossible - Dead Reckoning Part One",
    genre: "Action",
    director: "Christopher McQuarrie",
    extract:
      "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.",
    year: "2023",
    rating: "none",
  },
  {
    title: "A Haunting in Venice",
    genre: "Crime",
    director: "Kenneth Branagh ",
    extract:
      "In post-World War II Venice, Poirot, now retired and living in his own exile, reluctantly attends a seance. But when one of the guests is murdered, it is up to the former detective to once again uncover the killer.",
    year: "2023",
    rating: "none",
  },
  {
    title: "Dungeons & Dragons: Honour Among Thieves",
    genre: "Action",
    director: "John Francis Daley",
    extract:
      "A charming thief and a band of unlikely adventurers embark on an epic quest to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.",
    year: "2023",
    rating: "7.3",
  },
  {
    title: "Asteroid City",
    genre: "Comedy",
    director: "Wes Anderson",
    extract:
      "Following a writer on his world famous fictional play about a grieving father, who travels with his tech-obsessed family to small rural Asteroid City, to compete in a stargazing event. Only to have his world view disrupted forever.",
    year: "2023",
    rating: "7.0",
  },
];

/* ------------------------------------ STATIC FILES ----------------------------- */

// This serves the statics files in the "public" folder
app.use(express.static("public"));

/* ------------------------------------ USERS ----------------------------- */

//Create new user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("User name is requiered.");
  }
});

//Up-date user name:
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("User name was NOT updated.");
  }
});

//Delete user:
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`${user.name} was deleted`);
  } else {
    res.status(400).send("No such user found.");
  }
});

/* ------------------------------------ FAVORITE MOVIES ----------------------------- */

//Create or add a favorite movie to a list
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(
        ` ${movieTitle} has been added to user No.${id} favorite movie array`
      );
  } else {
    res.status(400).send("No movie was added to the favorite list.");
  }
});

//Delete movie from favorite list:
app.delete("/users/:id/:moviesTitle", (req, res) => {
  const { id, moviesTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== moviesTitle
    );
    res.status(200).send(`${moviesTitle} was deleted form your favorite list`);
  } else {
    res.status(400).send("No movie was deleted form the favorite list.");
  }
});

/* ------------------------------------ DETAILS MOVIES ----------------------------- */

// READ: Creating GET route at endpoint "/movies" returning JSON object
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//READ: Get route to get a specific movie titel
app.get("/movies/:title", (req, res) => {
  //const titel = req.params.title;
  //next line is the same, just with object distructering
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Sorry, movie not found.");
  }
});

//READ: Get route to get a specific genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genre === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Sorry, no such genre found");
  }
});

//READ: Get route to get a specific director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director === directorName
  ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Sorry, no director with this name was found.");
  }
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
