var mongoose  = require('mongoose'),
    // Used for date parsing/display because its sucky
    moment    = require('moment'),
    // Used as a helper for option parsing - nothing more
    options   = require('nomnom')
      .option('insert', {
        abbr    : 'i',
        flag    : true,
        default : false,
        help    : 'Print debugging info'
     })
    .option('name', {
        abbr    : 'n',
        default : "",
        help    : 'The name in the record'
     })
     .option('display', {
        abbr    : 'd',
        flag    : true,
        default : false,
        help    : 'Display all records'
     })
     .parse();

//Define the schema of our kittens
var kittySchema = mongoose.Schema({
      name    : String,
      created : { type: Date, default: Date.now }
    }),
    Kitten = mongoose.model('Kitten', kittySchema);

// Connect to our db
mongoose.connect('mongodb://localhost/chickity-check-dev');

var db = mongoose.connection;


function findAndDisplayKittens(exit) {
  Kitten.find({},function(err,kittens){
    // If there was an error from the db
    if(err) {
      console.log('There was an error!');
    }
    // If no kittens were found
    if(kittens.length < 1) {
      console.log('No Kittens were found =(');
    }
    else {
      // WE HAVE KITTENS! Now display them
      kittens.forEach(function(kitten){
        console.log('[Kitten] '+kitten.name+' was found on '+moment(kitten.created).format('MMM Do YY'));
      });
    }
    
    exit();
  });
};


db.once('open', function(){
  
  if(options.insert){
    var name = options.name || 'A New Kitty',
        newKitty = new Kitten({
          name: name
        });
    // Once the kitty is saved we want to display all of them
    newKitty.save(function(){
      // Passing in the exit command so findAndDisplayKittens can handle when to exit
      findAndDisplayKittens(process.exit);  
    });
  }

  // Want to display all kittens after I create one
  if(options.display){
    // Passing in the exit command so findAndDisplayKittens can handle when to exit
    findAndDisplayKittens(process.exit);  
  }

});

