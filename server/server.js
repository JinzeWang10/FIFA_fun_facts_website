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
// app.get('/author/:type', routes.author);
app.get('/club_wise', routes.club_wise);
app.get('/worst_team', routes.worst_team);
app.get('/best_N_players', routes.best_N_players);
app.get('/best11/', routes.best11);
app.get('/player_coach', routes.player_coach);
app.get('/search_players', routes.search_players);
app.get('/top_players', routes.top_players);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
