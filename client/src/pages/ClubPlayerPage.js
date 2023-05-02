import { useEffect, useState } from 'react';
import { Button, Container, Grid, Link, Slider, TextField, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';

import PlayerCard from '../components/PlayerCard';
// import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function PlayersPage() {

  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedplayerId, setSelectedplayerId] = useState(null);
//   const [fifa_version, setfifaversion] = useState(23);
  const [position, setposition] = useState('');
  const [defending, setdefending] = useState([0, 100]);
  const [dribbling, setdribbling] = useState([0, 100]);
  const [pace, setPace] = useState([0, 100]);
  const [shooting, setshooting] = useState([0, 100]);
  const [passing, setpassing] = useState([0, 100]);
  const [nationality_name, setnationality_name] = useState('');
  const { fifa_version } = useParams();
  const { team_id } = useParams();

  // const [selectedYear, setSelectedYear] = useState('');


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_players/${fifa_version}/${team_id}?fifa_version=${fifa_version}`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({ id: player.long_name, ...player }));
        setData(playersWithId);
      });
  }, [fifa_version,team_id]);
  console.log(fifa_version)
  console.log(team_id)


  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_players?position=${position}` +
      `&defending_low=${defending[0]}&defending_high=${defending[1]}` +
      `&dribbling_low=${dribbling[0]}&dribbling_high=${dribbling[1]}` +
      `&pace_low=${pace[0]}&pace_high=${pace[1]}` +
      `&shooting_low=${shooting[0]}&shooting_high=${shooting[1]}` +
      `&passing_low=${passing[0]}&passing_high=${passing[1]}` +
      `&nationality=${nationality_name}` +
      `&fifa_version=${fifa_version}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const playersWithId = resJson.map((player) => ({ id: player.player_id, ...player }));
        setData(playersWithId);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'long_name', headerName: 'Name', width: 200, renderCell: (params) => (
        <Link onClick={() => setSelectedplayerId(params.row.player_id)}>{params.row.short_name}</Link>
        // <Link onClick={() => setSelectedplayerId(params.row.player_id)}>nihao</Link>
    ) },
    // { field: 'position', headerName: 'Position' },
    { field: 'nationality_name', headerName: 'Nationality' },
    { field: 'defending', headerName: 'Defending' },
    { field: 'dribbling', headerName: 'Dribbling' },
    { field: 'pace', headerName: 'Pace' },
    { field: 'shooting', headerName: 'Shooting' },
    { field: 'passing', headerName: 'Passing' },
    { field: 'overall', headerName: 'Overall' },

  ]

  return (
    <Container>
      {selectedplayerId && <PlayerCard playerId={selectedplayerId} fifa_version={fifa_version} handleClose={() => setSelectedplayerId(null)} />}
      <h2>Club Players</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}

