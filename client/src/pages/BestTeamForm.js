import React from "react";
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { useParams } from 'react-router-dom';
const config = require('../config.json');
// import { NavLink } from 'react-router-dom';




// Define an array of button labels


export default function BestTeamForm(){
  const { formation } = useParams();
  const { fifa_version } = useParams();
  const [players, setBestTeam] = useState([]);
//   const players = [
//     { name: "Player 1", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 2", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 3", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 4", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 5", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 6", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 7", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 8", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 9", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 10", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" },
//     { name: "Player 11", photo: "https://cdn.sofifa.net/players/158/023/15_120.png" }
// ];
  
// const positions = {};
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/best11/${formation}/${fifa_version}`)
      .then(res => res.json())
      .then(resJson => setBestTeam(resJson));
  }, [formation, fifa_version])
  
  const positions = {433: {'GK': { x: "48.3%", y: "71%" }, // GK
    'LB': { x: "39%", y: "61%" }, // LB
    'CB1': { x: "45%", y: "63%" }, // CB1
    'CB2': { x: "52%", y: "63%" }, // CB2
    'RB': { x: "58%", y: "61%" }, // RB
    'CM1': { x: "44%", y: "46.5%" }, // CM1
    'CM2': { x: "52.7%", y: "46.5%" }, // CM2
    'LW': { x: "40%", y: "33%" }, // LW
    'CDM': { x: "48.3%", y: "52%" }, // CDM
    'RW': { x: "57%", y: "33%" }, // RW
    'CF': { x: "48.3%", y: "31%"} },// CF

    442: {'GK': { x: "48.3%", y: "71%" }, // GK
    'LB': { x: "39%", y: "61%" }, // LB
    'CB1': { x: "45%", y: "63%" }, // CB1
    'CB2': { x: "52%", y: "63%" }, // CB2
    'RB': { x: "58%", y: "61%" }, // RB
    'CM1': { x: "44%", y: "46.5%" }, // CM1
    'CM2': { x: "52.7%", y: "46.5%" }, // CM2
    'LM': { x: "37%", y: "44%" }, // LW
    'CF1': { x: "44%", y: "31%" }, // CDM
    'RM': { x: "59%", y: "44%" }, // RW
    'CF2': { x: "53%", y: "31%"} },// CF


    452: {'GK': { x: "48.3%", y: "71%" }, // GK
    'LB': { x: "39%", y: "61%" }, // LB
    'CB1': { x: "45%", y: "63%" }, // CB1
    'CB2': { x: "52%", y: "63%" }, // CB2
    'RB': { x: "58%", y: "61%" }, // RB
    'CM1': { x: "44%", y: "46.5%" }, // CM1
    'CM2': { x: "52.7%", y: "46.5%" }, // CM2
    'LM': { x: "37%", y: "44%" }, // LW
    'CDM': { x: "48.3%", y: "40.5%" }, // CDM
    'RM': { x: "59%", y: "44%" }, // RW
    'CF': { x: "48.3%", y: "31%"} }// CF
};
//   const positions = [{ x: "48.3%", y: "71%" }, // GK
//     { x: "39%", y: "61%" }, // LB
//     { x: "45%", y: "63%" }, // CB1
//     { x: "52%", y: "63%" }, // CB2
//     { x: "58%", y: "61%" }, // RB
//     { x: "44%", y: "46.5%" }, // CM1
//     { x: "52.7%", y: "46.5%" }, // CM2
//     { x: "40%", y: "33%" }, // LW
//     { x: "48.3%", y: "52%" }, // CDM
//     { x: "57%", y: "33%" }, // RW
//     { x: "48.3%", y: "31%"} // CF
// ];



  const Field = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 66.67%;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/d/db/493px-Soccer_field_-_empty.png");
    background-size: 30%;
    background-repeat: no-repeat;
    // background-color: #666;
    background-position: center center;
  `;

  const PlayerPhoto = styled.img`
    position: absolute;
    top: ${props => props.top};
    left: ${props => props.left};
    width: 50px;
    height: 50px;
    border-radius: 70%;
  `;

  const PlayerName = styled.div`
    position: absolute;
    top: ${props => props.top};
    left: ${props => props.left};
    font-size: 12px;
    text-align: center;
    color: black;
  `;
//   const firstPosition = players.Position;
  
//   document.write("positions[players[0].Position].y="+positions[players[0].Position].y)
  const FootballField = () => {
    // console.log(positions1[players[0].Position].x);
    return (
      <Field title = 'Best 11'> Formation: {formation}
        {players.map((player, index) => (
          
          <React.Fragment key={index}>
            <PlayerPhoto src={player.photo} top={positions[formation][player.Position].y} left={positions[formation][player.Position].x} />
            <PlayerName src={player.Name} top={`${parseFloat(positions[formation][player.Position].y) + 5}%`} left={positions[formation][player.Position].x}>
              {player.Name}
            </PlayerName>
          </React.Fragment>
        ))}
      </Field>
    );
  };
  
  return <FootballField />;
}