// import { useEffect, useState } from 'react';
// import { Container, Divider, Link } from '@mui/material';
// import { NavLink } from 'react-router-dom';

// import LazyTable from '../components/LazyTable';
// import PlayerCard from '../components/PlayerCard';
// // import { title } from 'process';
// const config = require('../config.json');

// export default function HomePage() {
//   // We use the setState hook to persist information across renders (such as the result of our API calls)
//   const [songOfTheDay, setSongOfTheDay] = useState({});
//   // TODO (TASK 13): add a state variable to store the app author (default to '')
//   const [appAuthor, setAppAuthor] = useState("");
//   // console.log('asdsad')
  
//   const [selectedSongId, setSelectedSongId] = useState(null);

//   // The useEffect hook by default runs the provided callback after every render
//   // The second (optional) argument, [], is the dependency array which signals
//   // to the hook to only run the provided callback if the value of the dependency array
//   // changes from the previous render. In this case, an empty array means the callback
//   // will only run on the very first render.
//   useEffect(() => {
//     // Fetch request to get the song of the day. Fetch runs asynchronously.
//     // The .then() method is called when the fetch request is complete
//     // and proceeds to convert the result to a JSON which is finally placed in state.
//     fetch(`http://${config.server_host}:${config.server_port}/random`)
//       .then(res => res.json())
//       .then(resJson => setSongOfTheDay(resJson));

//     // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
//     fetch(`http://${config.server_host}:${config.server_port}/author/name`)
//       .then(res => res.text())
//       .then(resText => setAppAuthor(resText));
//   }, []);
//   // console.log(appAuthor)
//   // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
//   // of objects with each object representing a column. Each object has a "field" property representing
//   // what data field to display from the raw data, "headerName" property representing the column label,
//   // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
//   const songColumns = [
//     {
//       field: 'long_name',
//       headerName: 'Name',
//       renderCell: (row) => <Link onClick={() => setSelectedSongId(row.player_id)}>{row.long_name}</Link> // A Link component is used just for formatting purposes
//     },
//     // {
//     //   field: 'album',
//     //   headerName: 'Album',
//     //   renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
//     // },
//     {
//       field: 'player_positions',
//       headerName: 'Positions'
//     },
//     {
//       field: 'overall',
//       headerName: 'Overall'
//     },
//     {
//       field: 'age',
//       headerName: 'Age'
//     },
//     {
//       field: 'club_name',
//       headerName: 'Club'
//     },
//   ];

//   // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
//   // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
//   const albumColumns = [
//     {
//       field: 'album',
//       headerName: 'Album Title',
//       renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.title}</NavLink> // A NavLink component is used to create a link to the album page
//     },
//     {
//       field: 'plays',
//       headerName: 'Plays'
//     },

//   ];

//   return (
//     <Container>
//       {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
//       {selectedSongId && <PlayerCard playerId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
//       <h2>Check out your song of the day:&nbsp;
//         <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link>
//       </h2>
//       <Divider />
//       <h2>Top Players</h2>
//       <LazyTable route={`http://${config.server_host}:${config.server_port}/top_players`} columns={songColumns} />
//       <Divider />

//       <h2>Top Albums</h2>
//       <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5,10]} />
//       <Divider />
//       <p>{appAuthor}</p>
//       {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
//       {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
//     </Container>
//   );
// };


import { useState } from 'react';
import { Button,Divider} from '@mui/material';
import * as React from 'react';
// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import { title } from 'process';
const config = require('../config.json');
export default function BasicCard() {

  const [data, setData] = useState([]);
  const [countF, setCountF]= useState(1);
  // const [countF, setCountF] = useState(1);
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/funfacts`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        // const playersWithId = resJson.map((player) => ({ id: player.player_id, ...player }));
        setCountF(countF+1);
        setData(String(resJson[countF%8]));
      });
  }

  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography sx={{ fontSize: 34 }} color="text.secondary" align="center" gutterBottom>
          Fun Fact of the Day



        </Typography>
        <Divider />
        <Typography variant="h5" component="div" align="center">
          {data}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Explore More
        </Button>
      </CardActions>
    </Card>
  );
};