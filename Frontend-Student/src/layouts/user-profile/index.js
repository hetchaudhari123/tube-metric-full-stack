import { useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/user-profile/Header";
import { IconButton } from "@mui/material";

// Auth0 hook
import { useAuth0 } from '@auth0/auth0-react';
import { useYoutube } from "context/YoutubeContext";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

// import handleConfiguratorOpen
const UserProfile = () => {
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const { user, isAuthenticated, isLoading } = useAuth0(); // Get user from Auth0
  const [notification, setNotification] = useState(false);
  const { youtubeId, setYoutubeId, playlistId, setPlaylistId, videoIds, setVideoIds } = useYoutube();
  const [channelName, setChannelName] = useState(null)
  const [localYoutubeId, setLocalYoutubeId] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [views, setViews] = useState(null);
  const [videoCount, setVideoCount] = useState(null);
  const [country, setCountry] = useState(null);
  const [description, setDescription] = useState(null);
  const [reportsBarChartData, setReportsBarChartData] = useState([]);
  const [reportsLikesChartData, setReportsLikesChartData] = useState([]); // New state for likes chart data
  const [reportsCommentsChartData, setReportsCommentsChartData] = useState([]); // New state for likes chart data
  const [reportsPublishedViewsData, setReportsPublishedViewsData] = useState([]); // New state for likes chart data
  const [reportsViewsVsMonth, setReportsViewsVsMonth] = useState([]); // New state for likes chart data
  const [reportsCommentAnalysis, setReportsCommentAnalysis] = useState([]); // New state for likes chart data
  const [thumbnail, setThumbnail] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch(`http://127.0.0.1:5000/api/channel/${localYoutubeId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/channel/${localYoutubeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Channel details retrieved:", data);
        // setChannelDetails(data); // Save the channel details to the state
        setYoutubeId(localYoutubeId); // Update global YouTube ID with the valid one
        setLocalYoutubeId("");
        const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/save-youtube-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.email,
            youtubeId: localYoutubeId
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Data saved successfully:', data);
        } else {
          console.error('Error saving data:', response.status, response.statusText);
        }
      } else {
        console.error("Error fetching channel details:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // setYoutubeId('UCjmJDM5pRKbUlVIzDYYWb6g')
    const fetchChannelDetails = async () => {
      if (!youtubeId) return;
      try {
        // const response = await fetch(`http://127.0.0.1:5000/api/channel/${youtubeId}`);
        const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/channel/${youtubeId}`);
        const data = await response.json();
        if (response.ok) {
          setSubscriberCount(data.channel_details?.subscriberCount || 0);
          setViews(data.channel_details?.viewCount || 0);
          setVideoCount(data.channel_details?.videoCount || 0);
          setCountry(data.channel_details?.country || '');
          setPlaylistId(data.channel_details?.all_videos_playlist || '');
          setDescription(data.channel_details?.description || '');
          setChannelName(data.channel_details?.title || '');
          setThumbnail(data.channel_details?.thumbnail || '');
        } else {
          console.error("Error fetching channel details:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchChannelDetails();
  }, [youtubeId]);
  // useEffect(() => {
  //   // Reset notification state after a timeout
  //   if (notification) {
  //     const timer = setTimeout(() => {
  //       setNotification(false);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [notification]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>; // Optionally handle unauthenticated users
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={user.name || "User"} thumbnail={thumbnail}>
        {notification && (
          <MDAlert color="info" mt="20px">
            <MDTypography variant="body2" color="white">
              Your profile has been updated
            </MDTypography>
          </MDAlert>
        )}
        <MDBox display="flex" flexDirection="column" mt={5} mb={3}>
          <MDBox display="flex" flexDirection="row" mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              mr={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Channel Name
              </MDTypography>
              <MDTypography variant="h6" color="text">
                {channelName || "N/A"}
              </MDTypography>
            </MDBox>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Email
              </MDTypography>
              <MDTypography variant="h6" color="text">
                {user.email || "N/A"}
              </MDTypography>
            </MDBox>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                YoutubeId
              </MDTypography>
              <MDTypography variant="h6" color="text">
                {youtubeId || "N/A"}
              </MDTypography>
            </MDBox>
          </MDBox>

          {/* Additional user profile details can be added here if needed */}

        </MDBox>
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
            {/* <IconButton size="small" onClick={handleConfiguratorOpen}>
                <Icon>settings</Icon>
              </IconButton> */}
            {/* <MDButton
                variant="gradient"
                color="info"
                onClick={handleLogOut}
                sx={{ ml: 1 }} // Add margin to the left for spacing
              >
                Log Out
              </MDButton> */}
          </form>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
};

export default UserProfile;
