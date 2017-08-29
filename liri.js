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

if (command === "my-tweets") {
 
  // This will show your last 20 tweets and when they were created at in your terminal/bash window.

    var params = {screen_name: 'GonskiDesigns'};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log(tweets[0].text);
      } else {
        console.log(error); 
      }

    });

} else if (command === "make-tweet") {
    var tweetText = inputString[3]; 
      client.post('statuses/update', {status: "this is a new tweet"}, function(error, tweet, response) {
        if (!error) {
          console.log(tweet);
        } else {
          console.log(error); 
        }
    });

} else if (command === "spotify-this-song") {
// 2. `node liri.js spotify-this-song '<song name here>'`
//    * This will show the following information about the song in your terminal/bash window     
//      * Artist(s)     
//      * The song's name    
//      * A preview link of the song from Spotify
//      * The album that the song is from
//    * If no song is provided then your program will default to "The Sign" by Ace of Base.
      var spotify = new Spotify({
            id: myKeys.spotifyKeys.client_id,
            secret: myKeys.spotifyKeys.client_secret
          });
       
      spotify.search({ type: 'track', query: mediaSearch }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
         
        console.log(data.tracks.items); 

      });

} else if (command === "movie-this") {

    if (process.argv[3] === undefined) {
      var defaultURL = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=40e9cece";
      
      request(defaultURL, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              var obj = JSON.parse(body); 
              console.log(obj); 
              console.log("Title: ", obj.Title); 
              console.log("This movie was released in: ", obj.Year); 
              console.log("IMDB Rating: ", obj.imdbRating);
              console.log("Rotten Tomatoes Rating: ", obj.Ratings[1].Value);
              console.log("Country Produced: ", obj.Country);
              console.log("Language: ", obj.Language);
              console.log("Plot: ", obj.Plot);
              console.log("Starring: ", obj.Actors);
            } else {
              console.log("error: ", error); 
            }
        });
      return; 

    } else {
        var queryUrl = "http://www.omdbapi.com/?t=" + mediaSearch + "&y=&plot=short&apikey=40e9cece";
    // console.log(queryUrl); 

        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              var obj = JSON.parse(body); 
              console.log(obj); 
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
//      ```
 

//    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
     
//      * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
     
//      * It's on Netflix!
   

} else if (command === "do-what-it-says") {
  // 4. `node liri.js do-what-it-says`
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error); 
    }
    var dataArr = data.split(","); 
    console.log(dataArr); 


  })
   
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
     
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
     
//      * Feel free to change the text in that document to test out the feature for other commands.


}
