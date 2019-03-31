const axios = require("axios");
const dayjs = require("dayjs");
const inquirer = require("inquirer");
require("dotenv").config();
const keys = require("./keys.js");

//Using inquirer in place of a user interface to select type of search and enter search terms
inquirer
  .prompt([
    {
      type: "list",
      message: "Which category would you like to search?",
      choices: ["Music Events", "Songs", "Movie Summaries"],
      name: "searchType"
    }
  ])
  .then(response => {
    const searchType = response.searchType;
    switch (searchType) {
      case "Music Events":
        inquirer
          .prompt([
            {
              type: "input",
              message: "What band do you want to see?",
              name: "searchTerms",
              validate: function(value) {
                if (value !== "") {
                  return true;
                }
                return false;
              }
            }
          ])
          .then(responses => {
            const searchTerms = responses.searchTerms
            bandsInTown(searchTerms);
          });
        break;
      case "Songs":
        inquirer
          .prompt([
            {
              type: "input",
              message: "What do you want to search for in songs?",
              name: "searchTerms",
              validate: function(value) {
                if (value !== "") {
                  return true;
                }
                return false;
              }
            }
          ])
          .then(responses => {
            const searchTerms = responses.searchTerms;
            spotifySearch(searchTerms);
          });
        break;
      case "Movie Summaries":
        inquirer
          .prompt([
            {
              type: "input",
              message: "What movie do you want to know about?",
              name: "searchTerms",
              validate: function(value) {
                if (value !== "") {
                  return true;
                }
                return false;
              }
            }
          ])
          .then(responses => {
            const searchTerms = responses.searchTerms;
            omdbSearch(searchTerms);
          });
        break;
    }
  });

//function for Bands in Town search
const bandsInTown = function(searchTerms) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        searchTerms +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      if (response.data.length > 0) {
        for (i = 0; i < response.data.length; i++) {
          console.log(i + 1 + " of " + response.data.length);
          console.log("Venue: " + response.data[i].venue.name);
          console.log(
            "Where: " +
              response.data[i].venue.city +
              ", " +
              response.data[i].venue.region
          );
          console.log(
            "When: " + dayjs(response.data[i].datetime).format("MM/DD/YYYY")
          );
          console.log("------------------------");
        }
      } else {
        console.log(
          "I guess they're not touring. Or you spelled it wrong. How about Death Cab for Cutie?"
        );
        bandsInTown('DEATH CAB FOR CUTIE');
      }
    })
    .catch(function(err) {
      console.log(err);
    });
};

//function for Spotify Search
const spotifySearch = function(searchTerms) {
  var Spotify = require("node-spotify-api");
  var spotify = new Spotify(keys.spotify);

  spotify
    .search({ type: "track", query: searchTerms, limit: 20 })
    .then(function(response) {
      var responseItems = response.tracks.items;
      if (responseItems.length > 0) {
        for (i = 0; i < responseItems.length; i++) {
          console.log("------------------------");
          console.log(i + 1 + " of " + responseItems.length);
          console.log("Track Name: " + responseItems[i].name);
          console.log("Album Name: " + responseItems[i].album.name);
          console.log("Artist: " + responseItems[i].album.artists[0].name);
          console.log(
            "Contains Explicit Content: " + responseItems[i].explicit
          );
          console.log(
            "Spotify Link: " + responseItems[i].external_urls.spotify
          );
          console.log("------------------------");
        }
      } else {
        console.log("How about some Ace of Base instead?");
        console.log("Track: The Sign");
        console.log(
          "Spotify Link: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE"
        );
      }
    })
    .catch(function(err) {
      console.log(err);
    });
};

//function for OMDB search
const omdbSearch = function(searchTerms) {
  axios
    .get(
      "http://www.omdbapi.com/?t=" +
        searchTerms +
        "&r&plot=short&apikey=trilogy"
    )
    .then(function(response) {

      if (response.data.Error === 'Movie not found!'){
        console.log("I couldn't find that movie. May I recommend: Mr. Nobody")
        omdbSearch("Mr. Nobody")
      } else {
        console.log("------------------------");
        console.log("Summary of: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Produced in: " + response.data.Country);
        console.log("Language(s): " + response.data.Language);
        console.log("Plot Summary: " + response.data.Plot);
        console.log("Screen Monkies: " + response.data.Actors);
        console.log("------------------------");
      }      
    })
    .catch(function(err) {
        console.log(err);
    });
};
