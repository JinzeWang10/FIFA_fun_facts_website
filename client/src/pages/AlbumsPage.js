import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function ClubPage() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/clubs`)
      .then(res => res.json())
      .then(resJson => setClubs(resJson));
  }, []);

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
  // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
  // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    // TODO (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
    // TODO (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
    <Container style={{flexFormat}}>
      {clubs.map((club) =>
        <Box
          key={club.fifa_version}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          
        <img
          src={club.fifa_version === 15 
            ? `https://www.fifplay.com/img/public/fifa-15-logo.jpg` 
            :`https://www.fifplay.com/img/public/fifa-${club.fifa_version}-logo.png`
          }
          alt={`${club.fifa_version} Logo`}
          width="400"
          height="200"
        />
         
          <h4><NavLink to={`/clubs/${club.fifa_version}`}>{`FIFA ${club.fifa_version}`}</NavLink></h4>
        </Box>
      )}
    </Container>
  );
}