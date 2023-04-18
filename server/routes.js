const exp = require('constants');
const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /league_wage problem?!
const league_wage = async function(req, res) {

  connection.query(`
      with avg_pay as (SELECT FLOOR(league_id) as club_league_id,AVG(wage_eur) as avg_wage FROM Players
      where league_id != 78 
      GROUP BY club_league_id
      ORDER BY avg_wage DESC
      )
      SELECT DISTINCT t.league_name as League, a.avg_wage as "Average_Wage" from avg_pay a
      join Team t on t.league_id = a.club_league_id
      ORDER BY a.avg_wage DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      // console.log(Object.keys(data[0]));
      // res.json({
      //   league: data[0].League,
      //   average_wage:data[0].Average_Wage
      // });
      res.json({data});
    }
  });
}

// Route 3: GET /club_wise   problem?!
const club_wise = async function(req, res) {
  connection.query(`
    with avg_pay as (SELECT FLOOR(club_team_id) as club_team_id,AVG(wage_eur) as avg_wage, avg(overall) as avg_overall FROM Players
    where league_id != 78
    GROUP BY club_team_id
    
    
    ORDER BY avg_wage DESC),
    
    
    range_skill as (select club_team_id, '75+' as skill_value, avg_wage from avg_pay
    where avg_overall>=75)
    
    
    SELECT t.team_name as Team, t.league_name as League, avg_wage as 'Average_Wage' from range_skill a
    join Team t on t.team_id = a.club_team_id
    ORDER BY a.avg_wage ASC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({data});
    }
  });
}


// Route 7: GET /worst_team
const worst_team = async function(req, res) {
  connection.query(`
  WITH American_Coach AS
  (
  SELECT coach_id,short_name FROM Coaches
  WHERE nationality_name='United States'
  ),
  American_Player AS
  (
  SELECT player_id, short_name FROM Players
  WHERE nationality_name='United States'
  ),
  Team_Simpler AS
  (
  SELECT team_id,team_name,fifa_version,coach_id,captain,penalties,overall
  FROM Team
  GROUP BY fifa_version,team_id
  ),
  Team_with_US_Coach AS
  (
  SELECT T.team_id,T.team_name,T.fifa_version,AC.short_name as coach_name,T.captain,T.penalties,T.overall FROM Team_Simpler T
  JOIN American_Coach AC
  ON AC.coach_id=T.coach_id
  ),
  Team_US AS
  (
  SELECT T.team_id,T.team_name,T.fifa_version,T.coach_name,T.captain,T.penalties,T.overall FROM Team_with_US_Coach T
  JOIN American_Player AP
  ON AP.player_id=T.captain
  UNION
  SELECT T.team_id,T.team_name,T.fifa_version,T.coach_name,T.captain,T.penalties,T.overall FROM Team_with_US_Coach T
  JOIN American_Player AP
  ON AP.player_id=T.penalties
  ),
  Min_overall_year AS
  (
  SELECT fifa_version,MIN(overall) as min_overall
  FROM Team_US
  GROUP BY fifa_version
  ORDER BY fifa_version
  ),
  Team_overall AS
  (
  SELECT TU.team_name,TU.fifa_version,TU.overall,MOY.min_overall as lowest_overall FROM Team_US TU
  LEFT JOIN Min_overall_year MOY
  ON MOY.fifa_version=TU.fifa_version
  )
  SELECT team_name,COUNT(fifa_version) AS No_lowest_overall FROM Team_overall
  WHERE overall=lowest_overall
  GROUP BY team_name
  LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 11: GET /best_N_players
const best_N_players = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const N = req.query.N ?? 10;
  const version = req.query.version ?? 23;
  connection.query(`
    Select long_name, club_name, fifa_version, overall from Players
    where fifa_version = ${version}
    order by fifa_version desc, overall desc
    limit ${N}
    ;  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}



// Route 5: GET /player_coach
const player_coach = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`
  Select distinct p.long_name as Name, p.club_name as 'Club Played', t.team_name as 'Club/Country Coaching' from Players p join Coaches c on c.long_name=p.long_name and c.dob = p.dob
  join Team t on t.coach_id = c.coach_id
  order by p.long_name;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
  // res.json([]); // replace this with your implementation
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const album_id = req.params.album_id;
  connection.query(`
    SELECT song_id, title, number, duration, plays
    FROM Songs
    WHERE album_id = '${album_id}'
    ORDER BY number 
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_players
const top_players = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 5;
  const offset=pageSize*(page-1);
  // console.log(page);
  // console.log(pageSize);
  // console.log(offset);

  if (!page) {
    connection.query(`
      SELECT player_id, long_name, player_positions, overall, age, club_name
      FROM Players
      where fifa_version=23
      ORDER BY overall DESC 
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    connection.query(`
      SELECT long_name, player_positions, overall, age, club_name
      FROM Players
      where fifa_version=23
      ORDER BY overall DESC 
      LIMIT ${pageSize} OFFSET ${offset};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 11: GET /best11/:formation
const best11 = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  // const formation = req.params.formation ?? '433';
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  // const pageSize = req.query.page_size ?? 10;
  // const offset=pageSize*(page-1)


  connection.query(`
  with cm as(
    select * from Players
    where player_positions LIKE '%CM%'
    order by overall desc
    limit 2
       ),
    cf as(
    select * from Players
    where player_positions LIKE '%CF%' or player_positions LIKE '%ST%'
    order by overall desc
    limit 1
       ),
    rm as(
    select * from Players
    where player_positions LIKE '%RM%'
    order by overall desc
    limit 1
       ),
    
    
    lm as (
    select * from Players
    where player_positions LIKE '%LM%'
    order by overall desc
    limit 1
       ),
    gk as(
    select * from Players
    where player_positions LIKE '%GK%'
    order by overall desc
    limit 1
       ),
    cb as(
    select * from Players
    where player_positions LIKE '%CB%'
    order by overall desc
    limit 2
       ),
    rb as(
    select * from Players
    where player_positions LIKE '%RB%'
    order by overall desc
    limit 1
       ),
    lb as(
    select * from Players
    where player_positions LIKE '%LB%'
    order by overall desc
    limit 1
       ),
    cdm as(
    select * from Players
    where player_positions LIKE '%CDM%' OR player_positions LIKE '%CAM%'
    order by overall desc
    limit 1
       )
    
    
    select long_name as Name, 'CM' as Position from cm
    union
    select long_name as Name, 'CF' as Position from cf
    union
    select long_name as Name, 'GK' as Position from gk
    union
    select long_name as Name, 'CB' as Position from cb
    union
    select long_name as Name, 'RB' as Position from rb
    union
    select long_name as Name, 'LB' as Position from lb
    union
    select long_name as Name, 'CDM' as Position from cdm
    union
    select long_name as Name, 'RM' as Position from rm
    union
    select long_name as Name, 'LM' as Position from lm;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });

}

// Route 9: GET /search_players
const search_players = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const position = req.query.position ?? 'ST';
  const nationality = req.query.nationality ?? 'England';
  const pace_low = req.query.pace_low ?? 30;
  const pace_high = req.query.pace_high ?? 99;
  const dribbling_low = req.query.dribbling_low ?? 30;
  const dribbling_high = req.query.dribbling_high ?? 99;
  const shooting_low = req.query.shooting_low ?? 30;
  const shooting_high = req.query.shooting_high ?? 99;
  const passing_low = req.query.passing_low ?? 30;
  const passing_high = req.query.passing_high ?? 99;
  const defending_low = req.query.defending_low ?? 30;
  const defending_high = req.query.defending_high ?? 99;
  const version = req.query.version ?? 23;
  // console.log(title)
  connection.query(`
    select * from Players where player_positions like '%${position}%'
    and nationality_name = '${nationality}' and pace between ${pace_low} and ${pace_high} and
    dribbling between ${dribbling_low} and ${dribbling_high} and
    shooting between ${shooting_low} and ${shooting_high} and
    passing between ${passing_low} and ${passing_high} and
    defending between ${defending_low} and ${defending_high} and
    fifa_version = ${version}
    order by overall desc;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });

}

module.exports = {
  league_wage,
  club_wise,
  player_coach,
  worst_team,
  search_players,
  best_N_players,
  best11,
  // song,
  // album,
  // albums,
  // album_songs,
  top_players,
  // top_albums,
  // search_songs,
}
