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
    // if (!error && response.statusCode == 200) {
    //    var $ = cheerio.load(html);
    //    $('h2.story-heading').each(function(i, element) {
    //        var headline = $(element).text();
    //        var trimmed = headline.trim();
    //        var goodQuotes = trimmed.replace(/[\u2018\u2019]/g, "'");
    //        var splitted = goodQuotes.split(" ");
    //        for (var i = 0; i < splitted.length; i++) {
    //         headlines_array.push(splitted[i]);
    //        }
    //    });
    // }
    // console.log(headlines_array);
    // var shuffled = shuffle(headlines_array);
    // var joined = shuffled.join(' ');
    // var createHeadline = new Headline({
    //   headline: joined,
    //   createdAt: new Date().getTime()
    // });
    // createHeadline.save(function (err, createHeadline) {
    //   if (err) return console.error(err);
    // });
    // console.log(joined);
    // console.log(createHeadline);
// });

//setInterval(function(){
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
  //       if (err) {
  //         return console.error(err);
  //       } else {
  //         console.log("Headline added to db.");
  //       }
  //     });
  //     headlines_array.length = 0;
  //     console.log("Array cleared.");
  // });
//}, 1000 *60 *60); //update every hour


/*chopped up methods go here */


var dataStore = []; 

function doScrape(callback) {
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
         });
      }
      saveHeadline(createNewHeadline(cutupHeadline(dataStore)));
      dataStore.length = 0;
    });
};

function cutupHeadline(array) {
    var shuffled = shuffle(array);
    var joined = shuffled.join(' ');

    // console.log(joined);
    return joined;
}

function createNewHeadline(headline) {
    var newHeadline = new Headline({
        headline: headline,
        createdAt: new Date().getTime()
    });
    
    return newHeadline;
}

function saveHeadline(headline) {
    headline.save(function (err, headline) {
        if (err) {
            return console.error(err);
        } else {
            console.log("Headline added to db.");
            return true;
        }
    });
}

var cutup = {};

module.exports.retrieveCutup = function() {
    // Headline.find().limit(1).sort({ createdAt: -1 }).select({ headline: 1 }).exec(callback);
    var query = Headline.find().limit(1).sort({ createdAt: -1 }).select({ headline: 1 });
    query.exec(function (err, headline) {
        if (err) return handleError(err);
        cutup.headline = headline[0].headline;
        console.log("retrieve successful");
        console.log(cutup);
        return cutup;   
    });

}

module.exports.scrapeHeadlines = function() {
  doScrape();
  /* mongodb query to get most recent document in collection */
  // db.headlines.find().sort({createdAt:-1});
}