import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav, setOpenConfigurator } from "context";
import MDButton from "components/MDButton";
import { AuthContext } from "context";
import { useAuth0 } from "@auth0/auth0-react";
import { useYoutube } from "context/YoutubeContext";

// LINK = 'http://127.0.0.1:5000/api/channel/'


function DashboardNavbar({ absolute, light, isMini }) {
  const authContext = useContext(AuthContext);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  let navigate = useNavigate();
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const { youtubeId, setYoutubeId,currentYoutubeId,setCurrentYoutubeId,apiKey,setApiKey } = useYoutube();
  // const [localYoutubeId, setLocalYoutubeId] = useState(youtubeId ?? ""); 
  const [localYoutubeId, setLocalYoutubeId] = useState(currentYoutubeId ?? ""); 
  // State for YouTube ID input

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Function to handle YouTube ID submission
  const [channelDetails, setChannelDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch(`http://127.0.0.1:5000/api/channel/${localYoutubeId}`, {
      const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/channel/${localYoutubeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey:apiKey }),
      });
      // const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/channel/${localYoutubeId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      const data = await response.json();
      if (response.ok) {
        console.log("Channel details retrieved:", data);
        setChannelDetails(data); // Save the channel details to the state
        // setYoutubeId(localYoutubeId); // Update global YouTube ID with the valid one
        setCurrentYoutubeId(localYoutubeId);
        setLocalYoutubeId("");
      } else {
        console.error("Error fetching channel details:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogOut = async () => {
    await logout();
  };

  return (
    <AppBar position={absolute ? "absolute" : navbarType} color="inherit">
      <Toolbar>
        <MDBox mb={{ xs: 1, md: 0 }}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox display="flex" alignItems="center" ml="auto">
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <MDInput
                label="Enter your YouTube ID"
                value={localYoutubeId} // Bind input to local state
                onChange={(e) => setLocalYoutubeId(e.target.value)} // Update local input field state
                sx={{ mr: 1 }} // Add margin to the right for spacing
              />
              <MDButton type="submit" variant="gradient" color="info" sx={{ mr: 1 }}>
                Save
              </MDButton>
              <IconButton size="small" onClick={handleConfiguratorOpen}>
                <Icon>settings</Icon>
              </IconButton>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleLogOut}
                sx={{ ml: 1 }} // Add margin to the left for spacing
              >
                Log Out
              </MDButton>
            </form>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
