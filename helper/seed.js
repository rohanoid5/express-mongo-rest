const campground = require('../models/campground');

let data = [
	{
		"name": "Rupkund",
      	"image": "image_one",
      	"description": "A nice place to go for trekking."
    },
    {
    	"name": "Baranti",
      	"image": "image_two",
      	"description": "A place where rookies go to get the first trekking experience"
  	},
  	{
  		"name": "Simla",
      	"image": "image_three",
      	"description": "A chill place to do some badass trekking and snowball fighting."
  	},
  	{
  		"name": "Himachal Prades",
      	"image": "image_four",
     	 "description": "The paradise of true trekkers in India."
  	}
];

function seedDb() {
	campground.remove({}, (err, data) => {
		if (err) console.log(err);
		else console.log("Removed all data");
	});

	data.forEach((seed) => {
		campground.create(seed, (err, data) => {
			if (err) console.log(err);
			else console.log("Added "+data);
		});
	});
}

module.exports = seedDb;