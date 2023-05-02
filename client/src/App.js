import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { amber, green } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
// import SongsPage from './pages/SongsPage';
// import AlbumInfoPage from './pages/AlbumInfoPage'
import ClubVersionPage from './pages/ClubVersion'
import ClubInfonPage from './pages/ClubPlayerPage'
import PlayersPage from "./pages/SongsPage";
import BestTeam from "./pages/BestTeam";
import BestTeamForm from "./pages/BestTeamForm";

import BestTeamForamVersion from "./pages/BestTeamForamVersion";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: green,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clubs" element={<AlbumsPage />} />
          <Route path="/clubs/:fifa_version" element={<ClubVersionPage />} />
          <Route path="/clubs/:fifa_version/:team_id" element={<ClubInfonPage />} />
          <Route path="/player_search" element={<PlayersPage />} />
          <Route path="/best11" element={<BestTeam />} />
          <Route path="/best11/:formation/:fifa_version" element={<BestTeamForm />}/>
          <Route path="/best11/:formation" element={<BestTeamForamVersion />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}