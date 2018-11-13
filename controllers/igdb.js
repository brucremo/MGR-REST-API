const igdb = require('igdb-api-node').default;
const client = igdb('aef56bac5ab539faba6d9f9b9429487b');

//GET requests handling - RETRIEVE - OK
async function getByName(req, res, next) {
    try {

        if (req.params.offset == undefined) {
            req.params.offset = 0;
        }

        client.games({
            fields: [
                'name', 'cover', 'summary', 'screenshots', 'aggregated_rating'
            ], // Return all fields
            limit: 20, // Limit results
            offset: req.params.offset,
            search: req.params.name
        }).then(response => {

            for (var i = 0; i < response.body.length; i++) {

                if (response.body[i].cover != undefined && response.body[i].screenshots != undefined) {
                    //Getting a larger size image, instead of a thumbnail following IGDB documentation
                    response.body[i].cover.url = response.body[i].cover.url.replace("thumb", "1080p");
                } else {

                    response.body.splice(i, 1);
                    i -= 1;
                }
            }

            res.status(200).json(response.body);
        }).catch(err => {
            res.status(429).end(err.message);
        });

    } catch (err) {
        res.status(429).end();
    }
}

module.exports.getByName = getByName;

async function getGame(req, res, next) {
    try {

        var game;

        client.games({
            ids: [
                req.params.id
            ],
            fields: [
                'name', 'cover', 'summary', 'screenshots', 'aggregated_rating'
            ] // Return all fields

        }).then(response => {
            //res.status(200).json(response.body);
            game = response.body;

            client.companies({
                ids: [
                    game[0].developers
                ],
                fields: 'name'
            }).then(response => {
                game[0].developers = response.body;

                for (var i = 0; i < game[0].screenshots.length; i++) {
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