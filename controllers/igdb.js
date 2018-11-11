const igdb = require('igdb-api-node').default;
const client = igdb('aef56bac5ab539faba6d9f9b9429487b');

//GET requests handling - RETRIEVE - OK
async function getByName(req, res, next) {
    try {

        if(req.params.offset == undefined){
            req.params.offset = 0;
        }
        
        client.games({
            fields: '*', // Return all fields
            limit: 10, // Limit results
            offset: req.params.offset,
            search: req.params.name
        }).then(response => {
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
            fields: '*', // Return all fields

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