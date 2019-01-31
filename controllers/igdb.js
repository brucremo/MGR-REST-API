const igdb = require('igdb-api-node').default;
const client = igdb('aef56bac5ab539faba6d9f9b9429487b'); //IGDB API KEY

//Get game by name
async function getByName(req, res, next) {
    try {

        //Read the search offset
        if (req.params.offset == undefined) {
            req.params.offset = 0;
        }

        //Run request to IGDB API
        client.games({

            //Fields to be retrieved
            fields: [
                'name', 'cover', 'summary', 'screenshots', 'aggregated_rating'
            ],
            limit: 20, // Limit results
            offset: req.params.offset,
            search: req.params.name
        }).then(response => {

            //Loop through the response and parse the images' links
            for (var i = 0; i < response.body.length; i++) {

                if (response.body[i].cover != undefined && response.body[i].screenshots != undefined) {
                    //Getting a larger size image, instead of a thumbnail following IGDB documentation
                    response.body[i].cover.url = response.body[i].cover.url.replace("thumb", "1080p");
                } else {

                    response.body.splice(i, 1);
                    i -= 1;
                }
            }

            //Return response with code 200 - SUCCESS
            res.status(200).json(response.body);
        }).catch(err => {

            //Return error message with code 429 - NOT FOUND
            res.status(429).end(err.message);
        });

    } catch (err) {

        //Return with code 429 - NOT FOUND
        res.status(429).end();
    }
}

module.exports.getByName = getByName;

//Retrieve a game with its ID
async function getGame(req, res, next) {
    try {

        var game;

        //Run request to IGDB API
        client.games({

            //GameID to be retrieved
            ids: [
                req.params.id
            ],

            //Fields to be retrieved
            fields: [
                'name', 'cover', 'summary', 'screenshots', 'aggregated_rating'
            ]
        }).then(response => {
            //set game variable to the response for the game
            game = response.body;

            //Run request to IGDB API to get the company name for that game
            client.companies({
                ids: [
                    game[0].developers
                ],
                fields: 'name'
            }).then(response => {

                //Set the game developer to the response
                game[0].developers = response.body;

                //Loop through the response and parse the images' links
                for (var i = 0; i < game[0].screenshots.length; i++) {
                    //Getting a larger size image, instead of a thumbnail following IGDB documentation
                    game[0].screenshots[i].url = game[0].screenshots[i].url.replace("thumb", "1080p");
                }

                game[0].aggregated_rating = Math.round(game[0].aggregated_rating);

                game[0].cover.url = game[0].cover.url.replace("thumb", "1080p");

                res.status(200).json(game[0]);
            }).catch(err => {
                res.status(429).end(err.message);
            });

        }).catch(err => {
            res.status(429).end(err.message);
        });
    } catch (err) {
        res.status(429).end();
    }
}

module.exports.getGame = getGame;