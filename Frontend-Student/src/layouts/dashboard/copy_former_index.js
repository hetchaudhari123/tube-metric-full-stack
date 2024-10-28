// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useYoutube } from "context/YoutubeContext";
import AuthContextProvider from "context/AuthContextProvider";
import { useAuth } from "context/AuthContextProvider";
import { useState, useEffect } from "react";

function Dashboard() {
  const { user } = useAuth();
  const { sales, tasks } = reportsLineChartData;
  const { youtubeId, setYoutubeId, playlistId, setPlaylistId, videoIds, setVideoIds } = useYoutube(); 
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [views, setViews] = useState(null);
  const [videoCount, setVideoCount] = useState(null);
  const [country, setCountry] = useState(null);
  const [reportsBarChartData, setReportsBarChartData] = useState([]);
  
  useEffect(() => {
    const fetchChannelDetails = async () => {
      if (!youtubeId) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/channel/${youtubeId}`);
        const data = await response.json();

        if (response.ok) {
          setSubscriberCount(data.channel_details?.subscriberCount || 0);
          setViews(data.channel_details?.viewCount || 0);
          setVideoCount(data.channel_details?.videoCount || 0);
          setCountry(data.channel_details?.country || '');
          setPlaylistId(data.channel_details?.all_videos_playlist || '');
        } else {
          console.error("Error fetching channel details:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchChannelDetails();
  }, [youtubeId]);

  useEffect(() => {
    setYoutubeId('UCjmJDM5pRKbUlVIzDYYWb6g');
    const fetchVideosIdsAndTopN = async () => {
      if (!playlistId) return;

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/videos/get-videos-ids/${playlistId}`);
        const data = await response.json();

        if (response.ok) {
          setVideoIds(data);

          const topResponse = await fetch('http://127.0.0.1:5000/api/videos/top-n-videos-views', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoIds: data,
              top_values: 5,
            }),
          });
          const topData = await topResponse.json();

          if (topResponse.ok) {
            const chartData = prepareChartData(topData);
            setReportsBarChartData(chartData);
          } else {
            console.error("Error fetching top videos:", topData.error);
          }
        } else {
          console.error("Error fetching video IDs:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchVideosIdsAndTopN();
  }, [playlistId]);

  const prepareChartData = (data) => {
    const labels = data.map(item => item.title);
    const viewCounts = data.map(item => item.viewCount);
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'View Count',
          data: viewCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Subscriber Count"
                count={subscriberCount || 0}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Total Views"
                count={views ?? 0}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Video Count"
                count={videoCount || 0}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Country"
                count={country ?? 0}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Top 5 videos by View Count"
                  description=""
                  date=""
                  chart={reportsBarChartData} // Pass the prepared chart data here
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Top 5 videos by Like Count"
                  description={
                    // <>(<strong>+15%</strong>) increase in today sales.</>
                    <></>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Completed Tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
