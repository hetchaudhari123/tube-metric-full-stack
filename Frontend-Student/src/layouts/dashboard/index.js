import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import ReportsAreaChart from "examples/Charts/AreaCharts/ReportsAreaChart";
import { useYoutube } from "context/YoutubeContext";
import { useAuth } from "context/AuthContextProvider";
import { useState, useEffect } from "react";
// import { PieChart } from "@mui/icons-material";
import PieChart from "examples/Charts/PieChart";
import { Chart } from "react-chartjs-2";
import "chart.js/auto";
import { useAuth0 } from "@auth0/auth0-react";
function Dashboard() {
  // const { user } = useAuth();
  const { user, isAuthenticated } = useAuth0(); // Access Auth0 user information

  const { youtubeId,setYoutubeId,playlistId, setPlaylistId, videoIds, setVideoIds, currentYoutubeId, setCurrentYoutubeId,apiKey,setApiKey } = useYoutube();
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [views, setViews] = useState(null);
  const [videoCount, setVideoCount] = useState(null);
  const [country, setCountry] = useState(null);

  const [reportsBarChartData, setReportsBarChartData] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });
  const [reportsLikesChartData, setReportsLikesChartData] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });
  const [reportsCommentsChartData, setReportsCommentsChartData] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });
  const [reportsPublishedViewsData, setReportsPublishedViewsData] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });
  const [reportsViewsVsMonth, setReportsViewsVsMonth] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });
  const [reportsCommentAnalysis, setReportsCommentAnalysis] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {  
    const fetchChannelDetails = async () => {
        if (!currentYoutubeId || currentYoutubeId === '') {
            console.log("Empty current youtube id.........", currentYoutubeId);
            setCurrentYoutubeId(youtubeId);
            return;
        }

        // Check localStorage for existing data
        const storedData = localStorage.getItem(`channelDetails-${currentYoutubeId}`);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setSubscriberCount(parsedData.subscriberCount || 0);
            setViews(parsedData.viewCount || 0);
            setVideoCount(parsedData.videoCount || 0);
            setCountry(parsedData.country || '');
            setPlaylistId(parsedData.playlistId || '');
            console.log("Loaded data from localStorage:", parsedData);
            return;
        }

        // If no data in localStorage, fetch from API
        try {
            console.log("Fetching data from API for youtubeId:", currentYoutubeId);
            // const response = await fetch(`http://127.0.0.1:5000/api/channel/${currentYoutubeId}`);
            // const response = await fetch(`http://127.0.0.1:5000/api/channel/${currentYoutubeId}`, {
            const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/channel/${currentYoutubeId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                // video_details_list: video_details_list,
                apiKey :apiKey
              }),
            });
            const data = await response.json();

            if (response.ok) {
                // Save API response to state
                const channelDetails = {
                    subscriberCount: data.channel_details?.subscriberCount || 0,
                    viewCount: data.channel_details?.viewCount || 0,
                    videoCount: data.channel_details?.videoCount || 0,
                    country: data.channel_details?.country || '',
                    playlistId: data.channel_details?.all_videos_playlist || ''
                };

                setSubscriberCount(channelDetails.subscriberCount);
                setViews(channelDetails.viewCount);
                setVideoCount(channelDetails.videoCount);
                setCountry(channelDetails.country);
                setPlaylistId(channelDetails.playlistId);

                // Store in localStorage
                localStorage.setItem(`channelDetails-${currentYoutubeId}`, JSON.stringify(channelDetails));
                console.log("Stored data in localStorage:", channelDetails);
            } else {
                console.error("Error fetching channel details:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    fetchChannelDetails();
}, [currentYoutubeId]);


  // useEffect(() => {
  //   const fetchVideosIdsAndTopN = async () => {
  //       if (!playlistId) {
  //         return;
  //       }
  //       // await delay(2000); // 1 second delay
  //       try {
  //         const response = await fetch(`http://127.0.0.1:5000/api/videos/get-videos-ids/${playlistId}`);
  //         // const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/videos/get-videos-ids/${playlistId}`);
  //         const data = await response.json();
  //         if (response.ok) {
  //           setVideoIds(data);
  //           // Fetch top N videos by views
  //           const topResponse = await fetch(`http://127.0.0.1:5000/api/videos/top-n-videos-views`, {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               videoIds: data,
  //               top_values: 5,
  //             }),
  //           });
  //           // const topResponse = await fetch(`https://tube-metrics-full-stack.onrender.com/api/videos/top-n-videos-views`, {
  //           //   method: 'POST',
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //   },
  //           //   body: JSON.stringify({
  //           //     videoIds: data,
  //           //     top_values: 5,
  //           //   }),
  //           // });
  //           const topData = await topResponse.json();

  //           if (topResponse.ok) {
  //             const chartData = prepareChartData(topData);
  //             console.log("CHART DATA.........", chartData)
  //             setReportsBarChartData(chartData);
  //           } else {
  //             console.error("Error fetching top videos:", topData.error);
  //           }

  //           // Fetch top N videos by likes
  //           const topLikesResponse = await fetch('http://127.0.0.1:5000/api/videos/top-n-videos-likes', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               videoIds: data,
  //               top_values: 5,
  //             }),
  //           });
  //           // const topLikesResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/top-n-videos-likes', {
  //           //   method: 'POST',
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //   },
  //           //   body: JSON.stringify({
  //           //     videoIds: data,
  //           //     top_values: 5,
  //           //   }),
  //           // });
  //           const topLikesData = await topLikesResponse.json();

  //           if (topLikesResponse.ok) {
  //             const likesChartData = prepareLikesChartData(topLikesData);
  //             // console.log("Likes Chart Data...", likesChartData)
  //             setReportsLikesChartData(likesChartData);
  //           } else {
  //             console.error("Error fetching top videos by likes:", topLikesData.error);
  //           }
  //           // Fetch top N videos by comments
  //           const topCommentedResponse = await fetch('http://127.0.0.1:5000/api/videos/top-n-commented-videos', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               videoIds: data,
  //               top_values: 5,
  //             }),
  //           });
  //           // const topCommentedResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/top-n-commented-videos', {
  //           //   method: 'POST',
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //   },
  //           //   body: JSON.stringify({
  //           //     videoIds: data,
  //           //     top_values: 5,
  //           //   }),
  //           // });
  //           const topCommentData = await topCommentedResponse.json();

  //           if (topCommentedResponse.ok) {
  //             const recentChartData = preparesCommentsChartData(topCommentData);
  //             setReportsCommentsChartData(recentChartData);
  //           } else {
  //             console.error("Error fetching top videos by likes:", topCommentData.error);
  //           }
  //           // Fetch top vidoes by published-views
  //           const topPublishedVsViewsResponse = await fetch('http://127.0.0.1:5000/api/videos/views-vs-published', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               videoIds: data,
  //               top_values: 5,
  //             }),
  //           });
  //           // const topPublishedVsViewsResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/views-vs-published', {
  //           //   method: 'POST',
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //   },
  //           //   body: JSON.stringify({
  //           //     videoIds: data,
  //           //     top_values: 5,
  //           //   }),
  //           // });
  //           const topViewsVsPublishedAt = await topPublishedVsViewsResponse.json();
  //           if (topCommentedResponse.ok) {
  //             const recentChartData = preparesPublishedViewsChartData(topViewsVsPublishedAt);
  //             setReportsPublishedViewsData(recentChartData);
  //           } else {
  //             console.error("Error fetching top videos by views vs publishedAt:", topViewsVsPublishedAt.error);
  //           }
  //           // Fetch  viewsVsMoth
  //           const viewsVsMonthResponse = await fetch('http://127.0.0.1:5000/api/videos/views-vs-month', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               videoIds: data,
  //               top_values: 5,
  //             }),
  //           });
  //           // const viewsVsMonthResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/views-vs-month', {
  //           //   method: 'POST',
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //   },
  //           //   body: JSON.stringify({
  //           //     videoIds: data,
  //           //     top_values: 5,
  //           //   }),
  //           // });
  //           const viewsVsMonthData = await viewsVsMonthResponse.json();
  //           if (viewsVsMonthResponse.ok) {
  //             const viewsVsMonthChartData = prepareViewsVsMonth(viewsVsMonthData);
  //             setReportsViewsVsMonth(viewsVsMonthChartData);
  //             // console.log("Views vs Month....", viewsVsMonthChartData)
  //           } else {
  //             console.error("Error fetching views-vs-month:", viewsVsMonthData.error);
  //           }
  //           // Fetch  commentsPercentage
  //           const commentsPercentResponse = await fetch('http://127.0.0.1:5000/api/videos/comments-sentiment', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               videoIds: data,
  //               top_values: 5,
  //             }),
  //           });
  //           // const commentsPercentResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/comments-sentiment', {
  //           //   method: 'POST',
  //           //   headers: {
  //           //     'Content-Type': 'application/json',
  //           //   },
  //           //   body: JSON.stringify({
  //           //     videoIds: data,
  //           //     top_values: 5,
  //           //   }),
  //           // });
  //           const commentsPercentData = await commentsPercentResponse.json();
  //           if (commentsPercentResponse.ok) {
  //             const commentsPercentChartData = preparesCommentsPercent(commentsPercentData);
  //             setReportsCommentAnalysis(commentsPercentChartData);
  //             // console.log("comments percentage....", commentsPercentChartData)
  //             // cnt=2;
  //           } else {
  //             console.error("Error fetching comments-percentage:", commentsPercentData.error);
  //           }
  //         } else {
  //           console.error("Error fetching video IDs:", data.message);
  //         }
  //       } catch (error) {
  //         console.error("Error:", error);
  //       }
  //   };
  //   fetchVideosIdsAndTopN();
  // }, [playlistId]);
  
  useEffect(() => {
    const fetchVideosIdsAndTopN = async () => {
        if (!playlistId) {
            console.log("Playlist ID is not available.");
            return;
        }

        const cachedData = localStorage.getItem(`playlist_${playlistId}`);
        if (cachedData) {
            console.log("Using cached data for playlist:", playlistId);
            const parsedData = JSON.parse(cachedData);
            setVideoIds(parsedData.videoIds || []);
            setReportsBarChartData(parsedData.reportsBarChartData || []);
            setReportsLikesChartData(parsedData.reportsLikesChartData || []);
            setReportsCommentsChartData(parsedData.reportsCommentsChartData || []);
            setReportsPublishedViewsData(parsedData.reportsPublishedViewsData || []);
            setReportsViewsVsMonth(parsedData.reportsViewsVsMonth || []);
            setReportsCommentAnalysis(parsedData.reportsCommentAnalysis || []);
            return;
        }

        try {
            // Fetch video IDs
            // const response = await fetch(`http://127.0.0.1:5000/api/videos/get-videos-ids/${playlistId}`);
            // const response = await fetch(`http://127.0.0.1:5000/api/videos/get-videos-ids/${playlistId}`, {
            const response = await fetch(`https://tube-metrics-full-stack.onrender.com/api/videos/get-videos-ids/${playlistId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                // video_details_list: video_details_list,
                apiKey :apiKey
              }),
            });
            const videoIdsData = await response.json();

            if (!response.ok) {
                console.error("Error fetching video IDs:", videoIdsData.message);
                return;
            }

            setVideoIds(videoIdsData);

            // Prepare an object to store fetched data
            const newCacheData = { videoIds: videoIdsData };

            // Helper function to fetch and process chart data

            const fetchAndProcessData = async (url, body, processFunction, setState, key) => {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                const result = await res.json();
                if (res.ok) {
                    const chartData = processFunction(result);
                    setState(chartData);
                    newCacheData[key] = chartData; // Store data in the cache object
                } else {
                    console.error(`Error fetching data for ${key}:`, result.error);
                }
            };

            // Fetch and process all chart data
            await Promise.all([
                fetchAndProcessData(
                    // 'http://127.0.0.1:5000/api/videos/top-n-videos-views',
                    'https://tube-metrics-full-stack.onrender.com/api/videos/top-n-videos-views',
                    { videoIds: videoIdsData, top_values: 5,apiKey : apiKey },
                    prepareChartData,
                    setReportsBarChartData,
                    'reportsBarChartData'
                ),
                fetchAndProcessData(
                    // 'http://127.0.0.1:5000/api/videos/top-n-videos-likes',
                    'https://tube-metrics-full-stack.onrender.com/api/videos/top-n-videos-likes',
                    { videoIds: videoIdsData, top_values: 5,apiKey:apiKey },
                    prepareLikesChartData,
                    setReportsLikesChartData,
                    'reportsLikesChartData'
                ),
                fetchAndProcessData(
                    // 'http://127.0.0.1:5000/api/videos/top-n-commented-videos',
                    'https://tube-metrics-full-stack.onrender.com/api/videos/top-n-commented-videos',
                    { videoIds: videoIdsData, top_values: 5,apiKey:apiKey },
                    preparesCommentsChartData,
                    setReportsCommentsChartData,
                    'reportsCommentsChartData'
                ),
                fetchAndProcessData(
                    // 'http://127.0.0.1:5000/api/videos/views-vs-published',
                    'https://tube-metrics-full-stack.onrender.com/api/videos/views-vs-published',
                    { videoIds: videoIdsData, top_values: 5,apiKey:apiKey },
                    preparesPublishedViewsChartData,
                    setReportsPublishedViewsData,
                    'reportsPublishedViewsData'
                ),
                fetchAndProcessData(
                    // 'http://127.0.0.1:5000/api/videos/views-vs-month',
                    'https://tube-metrics-full-stack.onrender.com/api/videos/views-vs-month',
                    { videoIds: videoIdsData, top_values: 5,apiKey:apiKey },
                    prepareViewsVsMonth,
                    setReportsViewsVsMonth,
                    'reportsViewsVsMonth'
                ),
                fetchAndProcessData(
                    // 'http://127.0.0.1:5000/api/videos/comments-sentiment',
                    'https://tube-metrics-full-stack.onrender.com/api/videos/comments-sentiment',
                    { videoIds: videoIdsData, top_values: 5,apiKey:apiKey },
                    preparesCommentsPercent,
                    setReportsCommentAnalysis,
                    'reportsCommentAnalysis'
                )
            ]);

            // Store the final data in localStorage
            localStorage.setItem(`playlist_${playlistId}`, JSON.stringify(newCacheData));
        } catch (error) {
            console.error("Error fetching videos and charts:", error);
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
  const prepareLikesChartData = (data) => {
    const labels = data.map(item => item.title);
    const likeCounts = data.map(item => item.likeCount);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Like Count',
          data: likeCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Customize as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Customize as needed
          borderWidth: 1,
        },
      ],
    };
  };
  const preparesCommentsChartData = (data) => {
    const labels = data.map(item => item.title);
    const commentCounts = data.map(item => item.commentCount);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Comment Count',
          data: commentCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Customize as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Customize as needed
          borderWidth: 1,
        },
      ],
    };
  };
  const preparesPublishedViewsChartData = (data) => {
    const labels = data.map(item => {
      // Convert the publishedAt date string to a Date object
      const date = new Date(item.publishedAt);
      // Format the date to YYYY-MM-DD
      return date.toISOString().split("T")[0]; // Extract only the date part
    });
    const views = data.map(item => item.viewCount);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Views',
          data: views,
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Customize as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Customize as needed
          borderWidth: 1,
        },
      ],
    };
  };
  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };
  const prepareViewsVsMonth = (data) => {
    const month = data.map(item => item.viewCount);
    const labels = data.map(item => item.month);
    // Generate an array of random colors for each dataset entry
    const backgroundColors = month.map(() => getRandomColor());
    return {
      labels: labels,
      datasets: [
        {
          label: 'Total Views',
          data: month,
          backgroundColor: backgroundColors, // Use random colors
          borderColor: 'rgba(0, 0, 0, 1)', // Set a fixed border color if desired
          borderWidth: 1,
        },
      ],
    };
  };
  const preparesCommentsPercent = (data) => {
    // Extract labels and data from the input data object
    const labels = Object.keys(data); // ['Negative Percentage', 'Neutral Percentage', 'Positive Percentage']
    const percentages = Object.values(data); // [7.317073170731707, 46.34146341463415, 46.34146341463415]

    // Generate an array of random colors for each dataset entry
    const backgroundColors = percentages.map(() => getRandomColor());

    return {
      labels: labels,
      datasets: [
        {
          label: 'Sentiment Percentages',
          data: percentages,
          backgroundColor: backgroundColors, // Use random colors
          borderColor: 'rgba(0, 0, 0, 1)', // Set a fixed border color if desired
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
                  label: "",
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
                  // description=""
                  // date=""
                  chart={reportsBarChartData} // Pass the prepared chart data here
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}> {/* Changed this to xs={12} to take full width */}
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  title="Top 5 videos by Like Count" // Updated title
                  // description={<> </>}
                  // date=""
                  chart={reportsLikesChartData} // Use the likes chart data
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}> {/* Changed this to xs={12} to take full width */}
              <MDBox mb={3}>
                <ReportsBarChart
                  color="primary"
                  title="Top 5 most commented videos" // Updated title
                  // description={<> </>}
                  // date=""
                  chart={reportsCommentsChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}> {/* Changed this to xs={12} to take full width */}
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "pie_chart" }}
                  title="Monthly View Distribution"
                  // description="View count per month"
                  height="19.125rem"
                  chart={reportsViewsVsMonth}
                />

              </MDBox>
            </Grid>
            <Grid item xs={12}> 
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "pie_chart" }}
                  title="Comment Percentage"
                  // description="Comment Percentage per month"
                  height="19.125rem"
                  chart={reportsCommentAnalysis}
                />

              </MDBox>
            </Grid>
            <Grid item xs={12} md={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Views over the time"
                  // description="Last Campaign Performance"
                  date=""
                  chart={reportsPublishedViewsData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6}>
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