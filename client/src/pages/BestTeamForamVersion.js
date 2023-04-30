import { NavLink } from 'react-router-dom';
import * as React from 'react';
// import footballField from '../images/football-field.jpg';
import { useParams } from 'react-router-dom';

export default function BestTeamForamVersion() {
    const { formation } = useParams();
    
  return (
    <div>
      <h1>Choose the version for the best 11</h1>
      
        <ul>
          <li>
            <NavLink to={`/best11/${formation}/23`} activeClassName="active">Version 23</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/22`} activeClassName="active">Version 22</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/21`} activeClassName="active">Version 21</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/20`} activeClassName="active">Version 20</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/19`} activeClassName="active">Version 19</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/18`} activeClassName="active">Version 18</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/17`} activeClassName="active">Version 17</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/16`} activeClassName="active">Version 16</NavLink>
          </li>
          <li>
            <NavLink to={`/best11/${formation}/15`} activeClassName="active">Version 15</NavLink>
          </li>
        </ul>
      
      <img src={'https://d32ydbgkw6ghe6.cloudfront.net/production/uploads/imageuploader_cms/c9127291f7bd7b49403a0aa9081f07ac4b6d/i640x640.jpg'} alt="Football field" />
    </div>

  );
//   return <BestTeamForamVersion/>;
    
}