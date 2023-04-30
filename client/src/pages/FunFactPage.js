import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField ,Divider} from '@mui/material';
import * as React from 'react';
import Box from '@mui/material/Box';
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

