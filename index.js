const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

// JSON Data of the Top Movies 2023:
let topMovies2023 = [
  {
    title: "John Wick: Chapter 4",
    genre: "Action, Crime, Thriller",
    director: "Chad Stahelski",
    extract:
      "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    year: "2023",
    rating: "7.9",
  },
  {
    title: " Killers of the Flower Moon",
    genre: "Crime, Drama, History",
    director: "Martin Scorsese",
    extract:
      "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation involving J. Edgar Hoover.",
    year: "2023",
    rating: "9.3",
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation, Action, Adventure",
    director: " Joaquim Dos Santos",
    extract:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    year: "2023",
    rating: "9.0",
  },
  {
    title: "Oppenheimer",
    genre: "Biography, Drama, History",
    director: "Christopher Nolan",
    extract:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    year: "2023",
    rating: "none",
  },
  {
    title: " Dune: Part Two",
    genre: "Action, Adventure, Drama",
    director: " Denis Villeneuve",
    extract:
      "A boy becomes the Messiah of nomads on a desert planet that has giant worms that protect a commodity called Spice. Spice changes people into travelers, mystics and madmen. What price will he pay to become the new ruler of their universe?",
    year: "2023",
    rating: "none",
  },
  {
    title: " Indiana Jones and the Dial of Destiny",
    genre: "Action, Adventure",
    director: "James Mangold",
    extract:
      "Archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.",
    year: "2023",
    rating: "none",
  },
  {
    title: "Mission: Impossible - Dead Reckoning Part One",
    genre: "Action, Adventure, Thriller ",
    director: "Christopher McQuarrie",
    extract:
      "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.",
    year: "2023",
    rating: "none",
  },
  {
    title: "A Haunting in Venice",
    genre: "Crime, Drama, Horror ",
    director: "Kenneth Branagh ",
    extract:
      "In post-World War II Venice, Poirot, now retired and living in his own exile, reluctantly attends a seance. But when one of the guests is murdered, it is up to the former detective to once again uncover the killer.",
    year: "2023",
    rating: "none",
  },
  {
    title: "Dungeons & Dragons: Honour Among Thieves",
    genre: "Action, Adventure, Comedy",
    director: "John Francis Daley",
    extract:
      "A charming thief and a band of unlikely adventurers embark on an epic quest to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.",
    year: "2023",
    rating: "7.3",
  },
  {
    title: "Asteroid City",
    genre: "Comedy, Drama, Romance",
    director: "Wes Anderson ",
    extract:
      "Following a writer on his world famous fictional play about a grieving father, who travels with his tech-obsessed family to small rural Asteroid City, to compete in a stargazing event. Only to have his world view disrupted forever.",
    year: "2023",
    rating: "7.0",
  },
];

// This serves the statics files in the "public" folder
app.use(express.static("public"));

/* Creating GET route at endpoint "/" returning a text
app.get("/", (req, res) => {
  res.send("Welcome to the Movie App");
});
Note: I used the express.static("public") in order to access the index.html file. 
*/

// Creating GET route at endpoint "/movies" returning JSON object
app.get("/movies", (req, res) => {
  res.json(topMovies2023);
});

// Creating a write stream (in append mode) to the log file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// Log all requests using Morgan
app.use(morgan("combined", { stream: accessLogStream }));

// Creating error-handling that log all errors to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Sorry, something went wrong!");
});

// listen for requests
app.listen(8080, () => {
  console.log("My movie app is listening on port 8080.");
});
