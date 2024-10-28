/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useYoutube } from "context/YoutubeContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect,useState } from "react";
function Overview() {
  const { youtubeId,setYoutubeId,playlistId, setPlaylistId, videoIds, setVideoIds, currentYoutubeId, setCurrentYoutubeId } = useYoutube();
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [views, setViews] = useState(null);
  const [videoCount, setVideoCount] = useState(null);
  const [country, setCountry] = useState(null);
  const [description,setDescription] = useState(null);
  const { user, isAuthenticated } = useAuth0(); // Access Auth0 user information

  useEffect(() => {  
    const fetchChannelDetails = async () => {
      // let cnt = 1;
      // while(cnt<=2){
      if (!youtubeId || youtubeId === '') {
        console.log("Empty current youtube id.........")
        return
      }
      // await delay(2000); // 1 second delay
      try {
        console.log("YoutubeId tried.....", youtubeId)
        const response = await fetch(`http://127.0.0.1:5000/api/channel/${youtubeId}`);
        const data = await response.json();

        if (response.ok) {
          setSubscriberCount(data.channel_details?.subscriberCount || 0);
          setViews(data.channel_details?.viewCount || 0);
          setVideoCount(data.channel_details?.videoCount || 0);
          setCountry(data.channel_details?.country || '');
          setPlaylistId(data.channel_details?.all_videos_playlist || '');
          setDescription(data.channel_details?.description || '');
          // cnt=2;
        } else {
          console.error("Error fetching channel details:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      // cnt++;
    // }
    };
    fetchChannelDetails();
  }, [youtubeId]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            {/* <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid> */}
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Description"
                description={description || ""}
                info={{
                  fullName: user?.name,
                  email: user?.email,
                  location: country,
                }}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "youtube",
                  }
                  // },
                  // {
                  //   link: "https://twitter.com/creativetim",
                  //   icon: <TwitterIcon />,
                  //   color: "twitter",
                  // },
                  // {
                  //   link: "https://www.instagram.com/creativetimofficial/",
                  //   icon: <InstagramIcon />,
                  //   color: "instagram",
                  // },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
