import { useEffect, useState } from 'react';
import { Button, Container, Grid, Link, Slider, TextField, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import PlayerCard from '../components/PlayerCard';
// import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function PlayersPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedplayerId, setSelectedplayerId] = useState(null);
  const [fifa_version, setfifaversion] = useState(23);
  const [position, setposition] = useState('');
  const [defending, setdefending] = useState([0, 100]);
  const [dribbling, setdribbling] = useState([0, 100]);
  const [pace, setPace] = useState([0, 100]);
  const [shooting, setshooting] = useState([0, 100]);
  const [passing, setpassing] = useState([0, 100]);
  const [nationality_name, setnationality_name] = useState('');
  // const [selectedYear, setSelectedYear] = useState('');

// define options for dropdown
  const yearOptions = [
    { label: 'Select year', value: '' },
    { label: '15', value: 15 },
    { label: '16', value: 16 },
    { label: '17', value: 17 },
    { label: '18', value: 18 },
    { label: '19', value: 19 },
    { label: '20', value: 20 },
    { label: '21', value: 21 },
    { label: '22', value: 22 },
    { label: '23', value: 23 },
  ];
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

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {selectedplayerId && <PlayerCard playerId={selectedplayerId} fifa_version={fifa_version} handleClose={() => setSelectedplayerId(null)} />}
      <h2>Search Players</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField label='Position' value={position} onChange={(e) => setposition(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={6}>
          <TextField label='Nationality' value={nationality_name} onChange={(e) => setnationality_name(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={12}>
        <InputLabel id="year-label">Years</InputLabel>
          <Select
            labelId="year-label"
            value={fifa_version}
            onChange={(e) => setfifaversion(e.target.value)}
            fullWidth
          >
            {yearOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <p>defending</p>
          <Slider
            value={defending}
            min={30}
            max={99}
            step={1}
            onChange={(e) => setdefending(e.target.value)}
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
            onChange={(e) => setdribbling(e.target.value)}
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
            onChange={(e) => setPace(e.target.value)}
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
            onChange={(e) => setshooting(e.target.value)}
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
            onChange={(e) => setpassing(e.target.value)}
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

