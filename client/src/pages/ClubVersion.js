import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function ClubVersionPage() {
  const { fifa_version } = useParams();
  const [clubs_ver, setClubsVer] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/clubs_ver/${fifa_version}`)
      .then(res => res.json())
      .then(resJson => setClubsVer(resJson));
  }, [fifa_version]);

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // TODO (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // TODO (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container style={{flexFormat}}>
      {clubs_ver.map((club) =>
        <Box
          key={club.team_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          
        <img
          src={club.team_photo}
          alt={`${club.team_name} Club Logo`}
          width="100"
          height="100"
        />
         
          <h4><NavLink to={`/clubs/${club.fifa_version}/${club.team_id}`}>{club.team_name}</NavLink></h4>
        </Box>
      )}
    </Container>
  );
}