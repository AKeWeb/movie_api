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
/*
let users = [
  {
    UserName: "Joe1987",
    Password: "123$987",
    Email: "joe.doe@gmail.com ",
    Birthday: new Date("1987-07-14"),
    FavoriteMovies: [ObjectId("649aa1348b4dec2991320968"), ObjectId("649aa1958b4dec2991320969"), ObjectId("649aa2198b4dec299132096a")],
  },
  
  {
    UserName: "Mary2",
    Password: "yIUL45%&",
    Email: "mary.king@gmx.ch",
    Birthday: new Date("2001-11-23"),
    FavoriteMovies: [ObjectId("649aa5e78b4dec2991320972"), ObjectId("649aa1348b4dec2991320968")],
  },

  {
    UserName: "Elsa01",
    Password: "plO123!",
    Email: "elsa.monroe@hotmail.com",
    Birthday: new Date("1967-3-12"),
    FavoriteMovies: [ObjectId("649aa4398b4dec299132096c"), ObjectId("649aa1348b4dec2991320968")],
  },

  {
    UserName: "JohnB",
    Password: "9808*#",
    Email: "john.bauer@gmx.ch",
    Birthday: new Date("1998-10-19"),
    FavoriteMovies: [ObjectId("649aa2198b4dec299132096a"), ObjectId("649aa5278b4dec299132096d"), ObjectId("649aa56d8b4dec299132096f"), ObjectId("649aa5968b4dec2991320970")],
  },

  {
    UserName: "JulianT",
    Password: "tq54$%#fu",
    Email: "julian.tielman@gmail.com",
    Birthday: new Date("1975-2-27"),
    FavoriteMovies: [ObjectId("649aa5c08b4dec2991320971"), ObjectId("649aa5e78b4dec2991320972")],
  },
];
*/
/* ------------------------------------ MOVIE DB ----------------------------- */

// JSON Data of the Top Movies 2023:
/*
let movies = [
   {
    Title: "John Wick: Chapter 4",
    Description:
      "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    Genre: {
      Name: "Action",
      Description: "Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work."
    },
    Director: {
      Name: "Chad Stahelski",
      Bio: "Chad Stahelski is an American stuntman and film director. He directed the 2014 film John Wick and its three sequels. He has worked as a stuntman, stunt coordinator and second unit director on several films.",
      Birth: "1968-09-20",
      Death: "",
    },
    ImagePath: "/public/img/John-Wick-Chapter-4.png",
    Featured: false,
    Year: "2023",
    Rating: "7.9",
    Actors: ["Keanu Reeves", "Scott Adkins"]
  },
  
  {
    Title: " Killers of the Flower Moon",
    Description:
      "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation involving J. Edgar Hoover.",
    Genre: {
      Name: "Crime",
      Description: "As the name implies, the crime genre is largely classified by a story that is centered around the solving of a crime. The story needs a protagonist, usually some type of detective, whether a professional or an amateur or even a private investigator, who is determined to solve the crime.",
    },
    Director: {
      Name: "Martin Scorsese",
      Bio: "Martin Charles Scorsese is an American and Italian film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era.",
      Birth: "1942-11-17",
      Death: "",
    },
    ImagePath:"/public/img/Killers-of-the-Flower-Moon.png",
    Featured: false,
    Year: "2023",
    Rating: "9.3",
    Actors: ["Leonardo DiCaprio", "Lily Gladstone"],
  },

  {
    Title: "Spider-Man: Across the Spider-Verse",
    Description:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    genre: {
      Name: "Animation",
      Description: "An animated movie or cartoon, is made up of a series of slightly different drawings of people, animals, and objects that make them appear to move.",
    },
    Director: {
      Name: "Joaquim Dos Santos",
      Bio: "Joaquim Aranha dos Santos is a Portuguese-American animator, storyboard artist, director, producer, and writer. He is best known for his directing work on the television series Justice League Unlimited, Avatar: The Last Airbender, G.I. Joe: Resolute, The Legend of Korra, and Voltron: Legendary Defender.",
      Birth: "1977-6-22",
      Death: "",
    },
    ImagePath: "/public/img/Spider-Man-Across-the-Spider-Verse.png",
    Featured: false,
    Year: "2023",
    Rating: "9.0",
    Actors: ["Oscar Isaac", "Shameik Moore"],
  },

  {
    Title: "Oppenheimer",
    Description:
    "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    Genre: {
      Name: "Biography",
      Description: "A biopic is a movie that dramatizes the life of a real, non-fictional individual. Short for “biographical motion picture,” a biopic can cover a person's entire life or one specific moment in their history.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century. His films have grossed $5 billion worldwide.",
      Birth: "1970-7-30",
      Death: "",
    },
    ImagePath: "/public/img/Oppenheimer.png",
    Featured: true,
    Year: "2023",
    Rating: "6.7",
    Actors: ["Robert Downey Jr.", "Florence Pugh"],
  },

  {
    Title: "Dune: Part Two",
    Description:
      "A boy becomes the Messiah of nomads on a desert planet that has giant worms that protect a commodity called Spice. Spice changes people into travelers, mystics and madmen. What price will he pay to become the new ruler of their universe?",
    Genre: {
      Name: "Action",
      Description: "Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work.",
    },
    Director: {
      Name: "Denis Villeneuve",
      Bio: "Denis Villeneuve OC CQ RCA is a French-Canadian filmmaker. He is a four-time recipient of the Canadian Screen Award for Best Direction, winning for Maelström in 2001, Polytechnique in 2009, Incendies in 2010 and Enemy in 2013.",
      Birth: "1967-10-03",
      Death: "",
    },
    ImagePath: "/public/img/Dune-Part-Two.png",
    Featured: false,
    Year: "2023",
    Rating: "8.2",
    Actors: ["Austin Butler", "Zendaya"],
  },

  {
    Title: "Indiana Jones and the Dial of Destiny",
    Description:
      "Archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.",
    Genre: {
      Name: "Action",
      Description: "Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work.",
    },
    Director: {
      Name: "James Mangold",
      Bio: "James Allen Mangold is an American filmmaker. He made his debut as a film director with Heavy, and is best known for the films Cop Land, Girl, Interrupted, Identity, Walk the Line.",
      Birth: "1963-12-16",
      Death: "",
    },
    ImagePath: "/public/img/Indiana-Jones-and-the-Dial-of-Destiny.png",
    Featured: true,
    Year: "2023",
    Rating: "9.8",
    Actors: ["Harrison Ford", "Mads Mikkelsen"],
  },

  {
    Title: "Mission: Impossible - Dead Reckoning Part One",
    Description:
    "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.",
    Genre: {
      Name: "Action",
      Description: "Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work.",
    },
    Director: {
      Name: "Christopher McQuarrie",
      Bio: "Christopher McQuarrie is an American filmmaker. He received the BAFTA Award, Independent Spirit Award, and Academy Award for Best Original Screenplay for the neo-noir mystery film The Usual Suspects. He made his directorial debut with the crime thriller film The Way of the Gun.",
      Birth: "1968-10-25",
      Death: "",
    },
    ImagePath: "/public/img/Mission-Impossible-Dead-Reckoning-Part-One.png",
    Featured: true,   
    Year: "2023",
    Rating: "9.9",
    Actors: ["Tom Cruise", "Haytley Atwell"],
  },

  {
    Title: "A Haunting in Venice",
    Description:
      "In post-World War II Venice, Poirot, now retired and living in his own exile, reluctantly attends a seance. But when one of the guests is murdered, it is up to the former detective to once again uncover the killer.",
    Genre: {
      Name: "Crime",
      Description: "As the name implies, the crime genre is largely classified by a story that is centered around the solving of a crime. The story needs a protagonist, usually some type of detective, whether a professional or an amateur or even a private investigator, who is determined to solve the crime.",
    },
    Director: {
      Name: "Kenneth Branagh",
      Bio: "Sir Kenneth Charles Branagh is a British actor and filmmaker. He has won an Academy Award, four BAFTAs, two Emmy Awards, a Golden Globe Award, and an Olivier Award. He was appointed a Knight Bachelor in the 2012 Birthday Honours, and was given Freedom of the City in his native Belfast in 2018.",
      Birth: "1960-12-10",
      Death: "",
    },
    ImagePath: "/public/img/A-Haunting-in-Venice.png",
    Featured: false,
    Year: "2023",
    Rating: "8.3",
    Actors: ["Kenneth Branagh", "Kelly Reilly"],
  },

  {
    Title: "Dungeons & Dragons: Honour Among Thieves",
    Description:
      "A charming thief and a band of unlikely adventurers embark on an epic quest to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.",
    Genre: {
      Name: "Action",
      Description: "Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work.",
    },
    Director: {
      Name: "John Francis Daley",
      Bio: "John Francis Daley is an American actor, filmmaker, and musician. He is best known for playing high school freshman Sam Weir on the NBC comedy-drama Freaks and Geeks and FBI criminal profiler Dr. Lance Sweets on the crime drama series Bones, for which he was nominated for a 2014 PRISM Award.",
      Birth: "1985-7-20",
      Death: "",
    },
    ImagePath: "/public/img/Dungeons-Dragons-Honour-Among-Thieves.png",
    Featured: false,
    Year: "2023",
    Rating: "7.3",
    Actors: ["Sophie Lillis", "Chris Pine"],
  },

  {
    Title: "Asteroid City",
    Description:
      "Following a writer on his world famous fictional play about a grieving father, who travels with his tech-obsessed family to small rural Asteroid City, to compete in a stargazing event. Only to have his world view disrupted forever.",
    Genre: {
      Name: "Comedy",
      Description: "Comedy films are make them laugh films designed to elicit laughter from the audience. Comedies are light-hearted dramas, crafted to amuse, entertain, and provoke enjoyment. The comedy genre humorously exaggerates the situation, the language, action, and characters.",
    },
    Director: {
      Name: "Wes Anderson",
      Bio: "Wesley Wales Anderson is an American filmmaker. His films are known for their eccentricity, unique visual and narrative styles, and frequent use of ensemble casts. They often contain themes of grief, loss of innocence, and dysfunctional families.",
      Birth: "1969-05-01",
      Death: "",
    },
    ImagePath: "/public/img/Asteroid-City.png",
    Featured: false,
    Year: "2023",
    Rating: "7.0",
    Actors: ["Scarlett Johansson", "Tom Hanks"],
  },

  {
  Title: "The Irishman",
    Description:
      "An illustration of Frank Sheeran's life, from W.W.II veteran to hit-man for the Bufalino crime family and his alleged assassination of his close friend Jimmy Hoffa",
    Genre: {
      Name: "Crime",
      Description: "As the name implies, the crime genre is largely classified by a story that is centered around the solving of a crime. The story needs a protagonist, usually some type of detective, whether a professional or an amateur or even a private investigator, who is determined to solve the crime.",
    },
    Director: {
      Name: "Martin Scorsese",
      Bio: "Martin Charles Scorsese is an American and Italian film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era.",
      Birth: "1942-11-17",
      Death: "",
    },
    ImagePath: "/public/img/The-Irishman.png",
    Featured: false,
    Year: "2019",
    Rating: "9.0",
    Actors: ["Robert De Niro", "Al Paciono"],
  },
];
*/
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
app.get("/movies/genre.name/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genre.name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Sorry, no such genre found");
  }
});

//READ: Get route to get a specific director
app.get("/movies/directors.name/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director.name === directorName
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
