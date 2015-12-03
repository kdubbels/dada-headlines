var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var Headline = mongoose.model('Headline');

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

var headlines_array = [];

// request('http://www.nytimes.com', function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//        var $ = cheerio.load(html);
//        $('h2.story-heading').each(function(i, element) {
//            var headline = $(element).text();
//            var trimmed = headline.trim();
//            var goodQuotes = trimmed.replace(/[\u2018\u2019]/g, "'");
//            var splitted = goodQuotes.split(" ");
//            for (var i = 0; i < splitted.length; i++) {
//             headlines_array.push(splitted[i]);
//            }
//        });
//     }
//     var shuffled = shuffle(headlines_array);
//     var joined = shuffled.join(' ');
//     var createHeadline = new Headline({
//       headline: joined,
//       createdAt: new Date().getTime()
//     });
//     createHeadline.save(function (err, createHeadline) {
//       if (err) return console.error(err);
//     });
//     console.log(joined);
//     console.log(createHeadline);
// });

// setInterval(function(){
//   request('http://www.nytimes.com', function (error, response, html) {
//       if (!error && response.statusCode == 200) {
//          var $ = cheerio.load(html);
//          $('h2.story-heading').each(function(i, element) {
//              var headline = $(element).text();
//              var trimmed = headline.trim();
//              var goodQuotes = trimmed.replace(/[\u2018\u2019]/g, "'");
//              var splitted = goodQuotes.split(" ");
//              for (var i = 0; i < splitted.length; i++) {
//               headlines_array.push(splitted[i]);
//              }
//          });
//       }
//       var shuffled = shuffle(headlines_array);
//       var joined = shuffled.join(' ');
//       var createHeadline = new Headline({
//         headline: joined,
//         createdAt: new Date().getTime()
//       });
//       createHeadline.save(function (err, createHeadline) {
//         if (err) {
//           return console.error(err);
//         } else {
//           console.log("Headline added to db.");
//         }
//       });
//       headlines_array.length = 0;
//       console.log("Array cleared.");
//   });
// }, 1000 *60 *60); //update every hour

var dataStore = [];

module.exports.makeRequest = function(){
  request('http://www.nytimes.com', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('h2.story-heading').each(function(i, element) {
        var headline = $(element).text();
        var trimmed = headline.trim();
        var goodQuotes = trimmed.replace(/[\u2018\u2019]/g, "'");
        var splitted = goodQuotes.split(" ");
        for (var i = 0; i < splitted.length; i++) {    
            dataStore.push(splitted[i]);
        }
        var headline_text = combine(shuffle(dataStore));
console.log(headline_text);
        // var dada_headline = new Headline({
        //     headline: headline_text,
        //     createdAt: new Date().getTime()
        // });

        // dada_headline.save(function (err, dada_headline) {
        //   if (err) {
        //     return console.error(err);
        //   } else {
        //     console.log("Headline added to db.");
        //   }
        // });

        dataStore.length = 0;
      });
    }
  });
};

function combine(shuffled){
    var combined = shuffled.join(' ');
    return combined;
}

function saveHeadline(createHeadline) {
  createHeadline.save(function (err, createHeadline) {
    if (err) {
      return console.error(err);
    } else {
      console.log("Headline added to db.");
    }
  });
}

function foo() {
  console.log("foo");
}

module.exports.foo = function() {
  console.log("foo");
}