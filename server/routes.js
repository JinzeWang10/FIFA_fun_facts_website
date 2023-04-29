// const exp = require('constants');
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
      where team_url like '%01'
      ORDER BY a.avg_wage DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /club_wage problem?!

const club_wage = async function(req, res) {

  connection.query(`with avg_pay as (SELECT FLOOR(club_team_id) as club_team_id,AVG(wage_eur)
  as avg_wage FROM Players
  where league_id != 78
  GROUP BY club_team_id
  ORDER BY avg_wage DESC)
  SELECT distinct t.team_name as Team, t.league_name as League, a.avg_wage as
  "Average Wage" from avg_pay a
  join Team t on t.team_id = a.club_team_id
  where where team_url like '%01'
  ORDER BY a.avg_wage DESC;`, (err, data) => {
  if (err || data.length === 0) {
    // if there is an error for some reason, or if the query is empty (this should not be possible)
    // print the error message and return an empty object instead
    console.log(err);
    res.json({});
  } else {
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
    where t.team_url like '%01'
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


// Route 4: GET /prime_age/:N

const prime_age = async function(req, res) {
  // TODO (TASK 4): implement a route that given number N, returns the top N prime ages of the soccer players based on the wages paid.
  const N = req.params.N;
  connection.query(`
  with prime_age as (SELECT age,AVG(wage_eur) as avg
  FROM Players
  GROUP BY age
  ORDER BY avg DESC
  LIMIT ${N})
  Select age as 'Prime Ages' from prime_age order by age;
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
  where t.team_url like '%01'
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



// Route 6: GET  /performance_measure/:position
const performance_measure = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const position = req.params.position;
  connection.query(`
  SELECT 'dribbling' AS performance_measure,
  ABS(AVG(dribbling) - AVG(overall)) AS difference
  FROM Players
  WHERE player_positions like '%${position}%' 
  UNION ALL
  SELECT
  'passing' AS performance_measure,
  ABS(AVG(passing) - AVG(overall)) AS difference
  FROM Players
  WHERE player_positions like '%${position}%'
  UNION ALL
  SELECT
  'pace' AS performance_measure,
  ABS(AVG(pace) - AVG(overall)) AS difference
  FROM Players
  WHERE player_positions like '%${position}%'
  UNION ALL
  SELECT
  'shooting' AS performance_measure,
  ABS(AVG(shooting) - AVG(overall)) AS difference
  FROM Players
  WHERE player_positions like '%${position}%'
  UNION ALL
  SELECT
  'defending' AS performance_measure,
  ABS(AVG(defending) - AVG(overall)) AS difference
  FROM Players
  WHERE player_positions like '%${position}%'
  UNION ALL
  SELECT
  'physic' AS performance_measure,
  ABS(AVG(physic) - AVG(overall)) AS difference
  FROM Players
  WHERE player_positions like '%${position}%'
  ORDER BY difference ASC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
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
  where team_url like '%01'
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


// Route 8: GET /new_good_players
const new_good_players = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  
  connection.query(`
  WITH Player_2020 AS
  (
  SELECT player_id,club_team_id,fifa_version,overall
  FROM Players
  WHERE fifa_version='20'
  ),
  Player_2021 AS
  (
  SELECT player_id,club_team_id,fifa_version,overall
  FROM Players
  WHERE fifa_version='21'
  ),
  Player_2022 AS
  (
  SELECT player_id,club_team_id,fifa_version,overall
  FROM Players
  WHERE fifa_version='22'
  ),
  Club_newPlayer AS
  (
  SELECT club_team_id,player_id,fifa_version,overall FROM Player_2021
  WHERE player_id not in (SELECT player_id FROM Player_2020)
  UNION
  SELECT club_team_id,player_id,fifa_version,overall FROM Player_2022
  WHERE player_id not in (SELECT player_id FROM Player_2021)
  ),
  Club_overall AS
  (
  SELECT
  Cn.club_team_id,T.team_name,Cn.player_id,Cn.fifa_version,Cn.overall as
  player_overall, T.overall as team_overall FROM Club_newPlayer Cn
  LEFT JOIN Team T ON T.team_id=Cn.club_team_id
  where T.team_url like '%01'
  )
  SELECT team_name,COUNT(player_id) as good_player_num FROM Club_overall
  WHERE player_overall>team_overall
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


// Route 10: GET /spidar_chart

const spidar_chart = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const version = req.query.version ?? 23;
  connection.query(`
  with team_temp as (
    select distinct team_id, team_url, fifa_version, team_name, league_id,
    league_name, league_level, nationality_id, nationality_name, overall,
    attack, midfield, defence, coach_id, home_stadium, rival_team,
    international_prestige, domestic_prestige, transfer_budget_eur,
    club_worth_eur,
    starting_xi_average_age,
    whole_team_average_age,
    captain,
    short_free_kick,
    long_free_kick,
    left_short_free_kick,
    right_short_free_kick,
    penalties,
    left_corner,
    right_corner,
    def_team_width,
    def_team_depth,
    build_up_play_speed,
    build_up_play_dribbling,
    build_up_play_passing,
    build_up_play_positioning,
    chance_creation_passing,
    chance_creation_crossing,
    chance_creation_shooting,
    chance_creation_positioning from Team
    where team_url like '%01' and fifa_version = ${version}),
    attacking as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.attack,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE attack >= p.attack) /
    (SELECT COUNT(*) FROM team_temp)) * 100 AS percentile_attacking
    FROM
    team_temp p
    ORDER BY
    p.attack DESC),
    defending as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.defence,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE defence >= p.defence) /
    (SELECT COUNT(*) FROM team_temp)) * 100 AS percentile_defending
    FROM
    team_temp p
    ORDER BY
    p.defence DESC),
    midfielding as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.midfield,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE midfield >= p.midfield) /
    (SELECT COUNT(*) FROM team_temp)) * 100 AS percentile_midfield
    FROM
    team_temp p
    ORDER BY
    p.midfield DESC),
    budget as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.transfer_budget_eur,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE transfer_budget_eur >=
    p.transfer_budget_eur) / (SELECT COUNT(*) FROM team_temp)) * 100 AS
    percentile_budget
    FROM
    team_temp p
    ORDER BY
    p.transfer_budget_eur DESC),
    overa as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.overall,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE overall >= p.overall) /
    (SELECT COUNT(*) FROM team_temp)) * 100 AS percentile_overall
    FROM
    team_temp p
    ORDER BY
    p.overall DESC),
    level as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.league_level,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE league_level >=
    p.league_level) / (SELECT COUNT(*) FROM team_temp)) * 100 AS
    percentile_level
    FROM
    team_temp p
    ORDER BY
    p.league_level DESC),
    domestic as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.domestic_prestige,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE domestic_prestige >=
    p.domestic_prestige) / (SELECT COUNT(*) FROM team_temp)) * 100 AS
    percentile_domestic
    FROM
    team_temp p
    ORDER BY
    p.domestic_prestige DESC),
    inter as (
    SELECT
    p.team_id,
    p.fifa_version,
    p.team_name,
    p.international_prestige,
    100 - ((SELECT COUNT(*) FROM team_temp WHERE international_prestige >=
    p.international_prestige) / (SELECT COUNT(*) FROM team_temp)) * 100 AS
    percentile_inter
    FROM
    team_temp p
    ORDER BY
    p.international_prestige DESC)
    Select a.team_id, a.fifa_version, a.team_name, percentile_overall,
    percentile_attacking, percentile_defending, percentile_midfield,
    percentile_inter, percentile_domestic, percentile_budget,
    percentile_level
    from attacking a
    join defending d on a.team_id = d.team_id
    join midfielding m on m.team_id = d.team_id
    join overa o on o.team_id = m.team_id
    join budget b on b.team_id = o.team_id
    join domestic do on do.team_id = b.team_id
    join inter i on i.team_id = do.team_id
    join level l on l.team_id = i.team_id
    order by a.team_name;
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

//Route 12: GET /best_N_clubs
const best_N_clubs = async function(req, res) {
const N = req.query.N ?? 10;
// const version = req.query.version ?? 23;
connection.query(`
Select * from Team where league_id != 78 and team_url like '%01' order by overall DESC
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








//Route 14 GET /search_playerid/:player_id/:fifa_version
const search_playerid = async function(req, res) {
  const player_id = req.params.player_id;
  const fifa_version = req.params.fifa_version;
  // const version = req.query.version ?? 23;
  connection.query(`
  select club_team_id, short_name, fifa_version, pace, passing, dribbling, shooting, defending, 
  physic from Players 
  where player_id = ${player_id} and fifa_version = ${fifa_version};  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
  }

//Route 17: GET /search_club/:club_id/:fifa_version
const search_clubid = async function(req, res) {
  const club_id = req.params.club_id;
  const fifa_version = req.params.fifa_version;
  // const version = req.query.version ?? 23;
  connection.query(`
  select team_id, team_name, fifa_version, overall, attack, midfield, defence from Team 
  where team_id = ${club_id} and team_url like '%01' and fifa_version = ${fifa_version};  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
  }



// /************************
//  * ADVANCED INFO ROUTES *
//  ************************/

// // Route 7: GET /top_songs
// const top_songs = async function(req, res) {
//   const page = req.query.page;
//   // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//   const pageSize = req.query.page_size ?? 10;
//   const offset=pageSize*(page-1);
//   // console.log(page);
//   // console.log(pageSize);
//   // console.log(offset);

//   if (!page) {
//     // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//     // Hint: you will need to use a JOIN to get the album title as well
//     connection.query(`
//       SELECT s.song_id, s.title, s.album_id, a.title as album, s.plays
//       FROM Songs s JOIN Albums a on s.album_id = a.album_id
//       ORDER BY plays DESC 
//     `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json({});
//       } else {
//         res.json(data);
//       }
//     });
//   } else {
//     // TODO (TASK 10): reimplement TASK 9 with pagination
//     // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//     connection.query(`
//       SELECT s.song_id, s.title, s.album_id, a.title as album, s.plays
//       FROM Songs s JOIN Albums a on s.album_id = a.album_id
//       ORDER BY plays DESC 
//       LIMIT ${pageSize} OFFSET ${offset};
//     `, (err, data) => {
//       if (err || data.length === 0) {
//         console.log(err);
//         res.json([]);
//       } else {
//         res.json(data);
//       }
//     });
//   }
// }

// Route 13: GET /best11/:formation
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
  const position = req.query.position ?? 'LB';
  const nationality = req.query.nationality ?? '';
  const pace_low = req.query.pace_low ?? 50;
  const pace_high = req.query.pace_high ?? 99;
  const dribbling_low = req.query.dribbling_low ?? 50;
  const dribbling_high = req.query.dribbling_high ?? 99;
  const shooting_low = req.query.shooting_low ?? 50;
  const shooting_high = req.query.shooting_high ?? 99;
  const passing_low = req.query.passing_low ?? 50;
  const passing_high = req.query.passing_high ?? 99;
  const defending_low = req.query.defending_low ?? 50;
  const defending_high = req.query.defending_high ?? 99;
  const fifa_version = req.query.fifa_version ?? 23;

  // console.log(title)
  connection.query(`
    select * from Players where player_positions like '%${position}%'
    and nationality_name like '${nationality}%' and pace between ${pace_low} and ${pace_high} and
    dribbling between ${dribbling_low} and ${dribbling_high} and
    shooting between ${shooting_low} and ${shooting_high} and
    passing between ${passing_low} and ${passing_high} and
    defending between ${defending_low} and ${defending_high} and
    fifa_version = '${fifa_version}';
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
  club_wage,
  club_wise,
  prime_age,
  player_coach,
  performance_measure,
  worst_team,
  spidar_chart,
  new_good_players,
  search_players,
  best_N_players,
  best_N_clubs,
  best11,
  // song,
  // album,
  // albums,
  // album_songs,
  // top_songs,
  // top_albums,
  // search_songs,
  search_playerid,
  search_clubid
}
