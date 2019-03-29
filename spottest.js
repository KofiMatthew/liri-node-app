var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "2b8197c8b86b49b7ad316bfcdb7d5d05",
  secret: "12959fa5715d4131b036377922fbe40b"
});
 
spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(data); 
});

