var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs"); 

// 7. At the top of the `liri.js` file, write the code you need to grab the data from keys.js. Then store the keys in a variable.
var myKeys = require("./keys.js"); 

var client = new Twitter(myKeys.twitterKeys);

// 8. Make it so liri.js can take in one of the following commands:
//    * `my-tweets`
//    * `spotify-this-song`
//    * `movie-this`
//    * `do-what-it-says`

var inputString = process.argv; 
var command = inputString[2]; 
var titleTokens = inputString.slice(3); 
var mediaSearch = titleTokens.join("+");
var twitterPost = titleTokens.join(" "); 

function searchMovie(query) {
  request(query, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              var obj = JSON.parse(body); 
              //console.log(obj); 
              console.log("Title: ", obj.Title); 
              console.log("This movie was released in: ", obj.Year); 
              console.log("IMDB Rating: ", obj.imdbRating);
              console.log("Rotten Tomatoes Rating: ", obj.Ratings[1].Value);
              console.log("Country Produced: ", obj.Country);
              console.log("Language: ", obj.Language);
              console.log("Plot: ", obj.Plot);
              console.log("Starring: ", obj.Actors);
            }else {
              console.log("error: ", error); 
            }
        });
} 

function searchSong(songInput) {
      spotify.search({ type: 'track', query: songInput }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      } 
      //having some issues with accessing the information within the object. Ideally, I would go in and fetch each bit of information to log out. 
      console.log("\n=================================================\n")
      console.log(data.tracks.items[0].album.artists);
      console.log("Artists: ", data.tracks.items[0].album.artists.name); 
      // console.log("Song Name: ", )
      // console.log("Previe Link: ", )
      // console.log("Song Album: ",);

    });
}

if (command === "my-tweets") {
 
  // This will show your last 20 tweets and when they were created at in your terminal/bash window.

    var params = {screen_name: 'GonskiDesigns'};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < 20; i++) {
          console.log("tweet # " + (i + 1) + ":", tweets[i].text);
        }
      } else {
        console.log(error); 
      }

    });

} else if (command === "make-tweet") {
    var tweetText = inputString[3]; 
    client.post('statuses/update', {status: twitterPost}, function(error, tweet, response) {
        if (!error) {
          console.log(tweet);
        } else {
          console.log(error); 
        }
    });

} else if (command === "spotify-this-song") {

      var spotify = new Spotify({
            id: myKeys.spotifyKeys.client_id,
            secret: myKeys.spotifyKeys.client_secret
          });

      if (process.argv[3] !== undefined) {
          searchSong(mediaSearch);
      } else {
        searchSong("The Sign"); 
      }
      

} else if (command === "movie-this") {

    if (process.argv[3] === undefined) {
      var defaultURL = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=40e9cece";
      
      searchMovie(defaultURL); 

      return; 

    } else {
        var queryUrl = "http://www.omdbapi.com/?t=" + mediaSearch + "&y=&plot=short&apikey=40e9cece";
     
        searchMovie(queryUrl); 

    }


} else if (command === "do-what-it-says") {
  // 4. `node liri.js do-what-it-says`
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error); 
    }
    var dataArr = data.split(","); 
    
    if (dataArr[0] === "movie-this") {
      var queryUrl = "http://www.omdbapi.com/?t=" + dataArr[1] + "&y=&plot=short&apikey=40e9cece";
      searchMovie(queryUrl); 
    }


  })
   
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
     
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
     
//      * Feel free to change the text in that document to test out the feature for other commands.


}
