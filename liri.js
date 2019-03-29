var axios = require("axios");
const inquirer = require("inquirer");
require("dotenv").config();
var keys = require("./keys.js");

//Using inquirer in place of a user interface to select type of search and enter search terms
inquirer
    .prompt([
        {
            type: "list",
            message: "Which category would you like to search?",
            choices: ["Music Events", "Songs", "Movie Summaries" ],//could add an 'all' option
            name: "searchType"
        },{
            type: "input",
            message: "What do you want to search for?",
            name: "searchTerms"
        }
    ]).then((responses) =>{
        console.log(responses);
        const searchType = responses.searchType;
        const searchTerms = responses.searchTerms;
        switch(searchType){
            case 'Music Events':
                bandsInTown(searchTerms);
                break;
            case 'Songs':
                spotifySearch(searchTerms);
                break;
            case 'Movie Summaries':
                omdbSearch(searchTerms);
                break;
            default:
            console.log("there was a problem");            
        }
    });

//function for Bands in Town search
const bandsInTown = function(searchTerms){
    console.log("Concerts!")
} 

//function for Spotify Search
const spotifySearch = function(searchTerms) {
    console.log(searchTerms);
    var Spotify = require('node-spotify-api');    
    var spotify = new Spotify(keys.spotify);

    spotify
        .search({ type: 'track', query: searchTerms, limit: 10 })
        .then(function(response) {
            var responseItems = response.tracks.items
            if (responseItems.length > 0){
                for (i=0; i<responseItems.length; i++){
                    console.log("------------------------");
                    console.log(i+1 +" of "+ responseItems.length);
                    console.log("Track Name: " + responseItems[i].name);
                    console.log("Album Name: " + responseItems[i].album.name);
                    console.log("Artist: " + responseItems[i].album.artists[0].name);
                    console.log("Contains Explicit Content: " + responseItems[i].explicit);                
                    console.log("Spotify Link: " + responseItems[i].external_urls.spotify);
                    console.log("------------------------");
                };
            }else{
                console.log("How about some Ace of Base instead?");
                console.log("Track: The Sign");
                console.log("Spotify Link: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
            };
        })
        .catch(function(err) {
            console.log(err);
        });
};

//function for OMDB search
const omdbSearch = function(searchTerms){
    axios.get("http://www.omdbapi.com/?t=" +searchTerms+ "&r&plot=short&apikey=trilogy")
        .then(function(response){
                console.log("------------------------");
                console.log("Summary of: " +response.data.Title);
                console.log("Year: " +response.data.Year);
                console.log("IMDB Rating: " +response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " +response.data.Ratings[1].Value);
                console.log("Produced in: " +response.data.Country);
                console.log("Language: " +response.data.Language);
                console.log("Plot Summary: " +response.data.Plot);
                console.log("Screen Monkies " +response.data.Actors);
                console.log("------------------------");
            },
        )
}