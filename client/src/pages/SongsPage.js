import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function PlayersPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedplayerId, setSelectedplayerId] = useState(null);

  const [position, setposition] = useState('');
  const [defending, setdefending] = useState([60, 660]);
  const [dribbling, setdribbling] = useState([0, 1100000000]);
  const [pace, setPace] = useState([30, 99]);
  const [shooting, setshooting] = useState([0, 1]);
  const [passing, setpassing] = useState([0, 1]);
  const [nationality_name, setnationality_name] = useState('');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_players`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({ id: player.long_name, ...player }));
        setData(playersWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_players?position=${position}` +
      `&defending_low=${defending[0]}&defending_high=${defending[1]}` +
      `&dribbling_low=${dribbling[0]}&dribbling_high=${dribbling[1]}` +
      `&pace_low=${pace[0]}&pace_high=${pace[1]}` +
      `&shooting_low=${shooting[0]}&shooting_high=${shooting[1]}` +
      `&passing_low=${passing[0]}&passing_high=${passing[1]}` +
      `&nationality=${nationality_name}`
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
        <Link onClick={() => setSelectedplayerId(params.row.player_id)}>{params.value}</Link>
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
      {selectedplayerId && <playerCard playerId={selectedplayerId} handleClose={() => setSelectedplayerId(null)} />}
      <h2>Search Players</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField label='Position' value={position} onChange={(e) => setposition(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={6}>
          <TextField label='Nationality' value={nationality_name} onChange={(e) => setnationality_name(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={4}>
          <p>defending</p>
          <Slider
            value={defending}
            min={30}
            max={99}
            step={1}
            onChange={(e, newValue) => setdefending(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>dribbling</p>
          <Slider
            value={dribbling}
            min={30}
            max={99}
            step={1}
            onChange={(e, newValue) => setdribbling(newValue)}
            valueLabelDisplay='auto'
            
          />
        </Grid>
        {/* TODO (TASK 24): add sliders for danceability, energy, and passing (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
        <Grid item xs={4}>
          <p>pace</p>
          <Slider
            value={pace}
            min={30}
            max={99}
            step={1}
            onChange={(e, newValue) => setPace(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>shooting</p>
          <Slider
            value={shooting}
            min={30}
            max={99}
            step={1}
            onChange={(e, newValue) => setshooting(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>passing</p>
          <Slider
            value={passing}
            min={30}
            max={99}
            step={1}
            onChange={(e, newValue) => setpassing(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
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