const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/league_wage', routes.league_wage);
app.get('/club_wage', routes.club_wage);
app.get('/club_wise', routes.club_wise);
app.get('/prime_age/:N', routes.prime_age);
app.get('/performance_measure/:position', routes.performance_measure)
app.get('/worst_team', routes.worst_team);
app.get('/new_good_players', routes.new_good_players);
app.get('/top_players', routes.top_players);
app.get('/best_N_players', routes.best_N_players);
app.get('/best11/', routes.best11);
app.get('/player_coach', routes.player_coach);
app.get('/best_N_players', routes.best_N_players);
app.get('/best_N_clubs', routes.best_N_clubs);
app.get('/search_players', routes.search_players);
app.get('/search_playerid/:player_id', routes.search_playerid);
app.get('/funfacts', routes.funfacts);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
