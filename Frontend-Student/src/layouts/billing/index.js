// @mui/material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

// Billing page components
import { useEffect, useState } from "react";
import { useYoutube } from "context/YoutubeContext";
import { ControlPointRounded } from "@mui/icons-material";
import PieChart from "examples/Charts/PieChart";
import ReportsStackedBarChart from "examples/Charts/BarCharts/StackedBarChart/ReportsStackedBarChart";

function Billing() {
  const { youtubeId,apiKey,setApiKey, setYoutubeId } = useYoutube();
  const [newYoutubeIds, setNewYoutubeIds] = useState([]);
  const [localYoutubeId, setLocalYoutubeId] = useState("");
  const [subscriberBarChartData, setSubscriberBarChartData] = useState({
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
  const [videoCountBarChartData, setVideoCountBarChartData] = useState({
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
  const [viewCountBarChartData, setViewCountBarChartData] = useState({
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
  const [avgViewPerChannelCountBarChartData, setAvgViewPerChannelCountBarChartData] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });;
  const [avgLikePerChannelCountBarChartData, setAvgLikePerChannelCountBarChartData] = useState({
    labels: [], // Initially empty array for labels
    datasets: [
      {
        label: "View Count", // Or any relevant label
        backgroundColor: "rgba(75,192,192,1)", // Set a default color
        borderWidth: 1,
        data: [], // Initially empty array for data
      },
    ],
  });;
  const [sentimentRatioPieChartData,setSentimentRatioPieChartData] = useState({
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
  useEffect(() => {
    setNewYoutubeIds([
      'UC_5niPa-d35gg88HaS7RrIw',  // Disney
      'UCWkHlUiYLeRSIMP8yM7rxxg', // pjExplained
      'UCRI00CwLZdLRCWg5BdDOsNw', // CanadianLad
      'UCaWd5_7JhbQBe4dknZhsHJg', // Watch Mojo
      'UCjmJDM5pRKbUlVIzDYYWb6g', // Warner Bros
    ]);
  }, []);

  // useEffect(()=>{
  //   console.log("New youtube ids",newYoutubeIds)
  // },[newYoutubeIds])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localYoutubeId.trim()) return;

    setNewYoutubeIds((prevIds) => [...prevIds, localYoutubeId]);
    setLocalYoutubeId("");
  };

  const handleRemove = (idToRemove) => {
    setNewYoutubeIds((prevIds) => prevIds.filter((id) => id !== idToRemove));
  };

  const fetchChannelDetails = async (ids) => {
    try {
      
      // const response = await fetch("http://127.0.0.1:5000/api/videos/get-channels-details", {
      const response = await fetch("https://tube-metrics-full-stack.onrender.com/api/videos/get-channels-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ channel_ids: ids,apiKey :apiKey})
      });
      // const response = await fetch("https://tube-metrics-full-stack.onrender.com/api/videos/get-channels-details", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ channel_ids: ids })
      // });
      return await response.json();
    } catch (error) {
      console.error("Error fetching channel details:", error);
      return null;
    }
  };

  const fetchSubscriberData = async (channelDetails) => {
    try {
      // console.log("CHANNEL_DETAILS INSIDE FETCHSUBSCRIBERDATA...",channelDetails)
      // const response = await fetch("http://127.0.0.1:5000/api/videos/subscriber-channel", {
      const response = await fetch("https://tube-metrics-full-stack.onrender.com/api/videos/subscriber-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoDetails: channelDetails,apiKey :apiKey })
      });
      // const response = await fetch("https://tube-metrics-full-stack.onrender.com/api/videos/subscriber-channel", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ videoDetails: channelDetails })
      // });
      const data = await response.json();
      if (response.ok) return data;
      console.error("Error fetching subscriber data:", data.error);
      return null;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchVideoCountData = async (channelDetails) => {
    // Fetch top N videos by likes
    
    try{
    // const videoCountResponse = await fetch('http://127.0.0.1:5000/api/videos/video-count-channel', {
    const videoCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/video-count-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoDetails: channelDetails,apiKey :apiKey
      }),
    });
    // const videoCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/video-count-channel', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     videoDetails: channelDetails,
    //   }),
    // });
    const videoCountData = await videoCountResponse.json();
    if (videoCountResponse.ok) {
      // const videoCountChartData = prepareVideoCountChartData(videoCountData);
      // setVideoCountBarChartData(videoCountBarChartData);
      return videoCountData
    } else {
      console.error("Error fetching top videos by videoCount:", videoCountData.error);
    }
    return null
  }
  catch(err){
    console.error("Error:", err);
  }
  }
  // View Count of the whole channel
  const fetchViewCountData = async (channelDetails) => {
    // Fetch top N videos by likes
    
    try{
    // const viewCountResponse = await fetch('http://127.0.0.1:5000/api/videos/view-count-channel', {
    const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/view-count-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoDetails: channelDetails,apiKey :apiKey
      }),
    });
    // const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/view-count-channel', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     videoDetails: channelDetails,
    //   }),
    // });
    const viewCountData = await viewCountResponse.json();
    if (viewCountResponse.ok) {
      // const videoCountChartData = prepareVideoCountChartData(videoCountData);
      // setVideoCountBarChartData(videoCountBarChartData);
      return viewCountData
    } else {
      console.error("Error fetching top videos by videoCount:", viewCountData.error);
    }
    return null
  }
  catch(err){
    console.error("Error:", err);
  }
  }
  // Get the information regarding all the videos of all the playlists ids corresponding to each channel
  const fetchVideoInfo = async(channelDetails)=>{
    try{
      // const viewCountResponse = await fetch('http://127.0.0.1:5000/api/videos/info-videos-playlists', {
      const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/info-videos-playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelDetails: channelDetails,apiKey :apiKey
        }),
      });
      // const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/info-videos-playlists', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     channelDetails: channelDetails,
      //   }),
      // });
      const viewCountData = await viewCountResponse.json();
      if (viewCountResponse.ok) {
        // const videoCountChartData = prepareVideoCountChartData(videoCountData);
        // setVideoCountBarChartData(videoCountBarChartData);
        return viewCountData
      } else {
        console.error("Error fetching info :", viewCountData.error);
      }
      return null
    }
    catch(err){
      console.error("Error:", err);
    }
  }
  // Average View per Video
  const fetchAvgViewPerVideoCountData = async (video_details_list) => {
    // Fetch top N videos by likes
    const channelsInfo = video_details_list.channels_info;
    try{
    // const viewCountResponse = await fetch('http://127.0.0.1:5000/api/videos/avg-view-per-video-playlists', {
    const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/avg-view-per-video-playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // video_details_list: video_details_list,
        channels_info:video_details_list.channels_info,apiKey :apiKey
      }),
    });
    // const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/avg-view-per-video-playlists', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // video_details_list: video_details_list,
    //     channels_info:video_details_list.channels_info
    //   }),
    // });
    const viewCountData = await viewCountResponse.json();
    if (viewCountResponse.ok) {
      // const videoCountChartData = prepareVideoCountChartData(videoCountData);
      // setVideoCountBarChartData(videoCountBarChartData);
      return viewCountData
    } else {
      console.error("Error fetching avg views per video through playlists:", viewCountData.error);
    }
    return null
  }
  catch(err){
    console.error("Error:", err);
  }
  }
  // Average Like per Video
  const fetchAvgLikePerVideoCountData = async (video_details_list) => {
    // Fetch top N videos by likes
    
    const channelsInfo = video_details_list.channels_info;
    console.log("Average Likes....",channelsInfo)
    try{
    // const viewCountResponse = await fetch('http://127.0.0.1:5000/api/videos/avg-like-per-video-playlists', {
    const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/avg-like-per-video-playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // video_details_list: video_details_list,
        channels_info:channelsInfo,apiKey :apiKey
      }),
    });
    // const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/avg-like-per-video-playlists', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // video_details_list: video_details_list,
    //     channels_info:channelsInfo
    //   }),
    // });
    const viewCountData = await viewCountResponse.json();
    if (viewCountResponse.ok) {
      // const videoCountChartData = prepareVideoCountChartData(videoCountData);
      // setVideoCountBarChartData(videoCountBarChartData);
      return viewCountData
    } else {
      console.error("Error fetching avg likes per video through playlists:", viewCountData.error);
    }
    return null
  }
  catch(err){
    console.error("Error:", err);
  }
  }
  const fetchSentimentRatios = async (video_details_list) => {
    // Fetch top N videos by likes
    // console.log("here................",video_details_list)
    // console.log("here................",video_details_list.channels_info)
    const channelsInfo = video_details_list.channels_info;
    try{
    // const viewCountResponse = await fetch('http://127.0.0.1:5000/api/videos/sentiment-analysis-multichannels', {
    const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/sentiment-analysis-multichannels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // video_details_list: video_details_list,
        channels_info:channelsInfo,apiKey :apiKey
      }),
    });
    // const viewCountResponse = await fetch('https://tube-metrics-full-stack.onrender.com/api/videos/sentiment-analysis-multichannels', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // video_details_list: video_details_list,
    //     channels_info:channelsInfo
    //   }),
    // });
    const viewCountData = await viewCountResponse.json();
    if (viewCountResponse.ok) {
      // const videoCountChartData = prepareVideoCountChartData(videoCountData);
      // setVideoCountBarChartData(videoCountBarChartData);
      return viewCountData
    } else {
      console.error("Error fetching avg likes per video through playlists:", viewCountData.error);
    }
    return null
  }
  catch(err){
    console.error("Error:", err);
  }
  }
  const handleShowStats = async () => {
    if (newYoutubeIds.length === 0) {
      console.error("No YouTube IDs to fetch stats for.");
      return;
    }
    
    const channelDetails = await fetchChannelDetails(newYoutubeIds);
    console.log("Channel Details..........",channelDetails)
    if (!channelDetails){
      console.log("Error from channelDetails from billing....")
      return;
    }
    const subscriberData = await fetchSubscriberData(channelDetails);
    const chartData = prepareChartData(subscriberData);
    setSubscriberBarChartData(chartData);
    const videoCountData = await fetchVideoCountData(channelDetails);
    const videoChartData = prepareVideoCountChartData(videoCountData)
    setVideoCountBarChartData(videoChartData)
    const viewCountData = await fetchViewCountData(channelDetails);
    const viewChartData = prepareViewCountChartData(viewCountData)
    setViewCountBarChartData(viewChartData)
    const videos_info = await fetchVideoInfo(channelDetails)
    

    if(!videos_info){
      console.log("Error from videos_info from billing....")
      return;
    }
    const avgPerVideoData = await fetchAvgViewPerVideoCountData(videos_info)
    const avgPerVideoChartData = prepareAvgPerVideo(avgPerVideoData)
    setAvgViewPerChannelCountBarChartData(avgPerVideoChartData)
    const avgLikesPerVideoData = await fetchAvgLikePerVideoCountData(videos_info)
    const avgLikesPerVideoChartData = prepareLikePerVideo(avgLikesPerVideoData)
    setAvgLikePerChannelCountBarChartData(avgLikesPerVideoChartData)
    const sentimentRatioData = await fetchSentimentRatios(videos_info)
    const sentimentRatioChartData = prepareSentimentRatio(sentimentRatioData)
    setSentimentRatioPieChartData(sentimentRatioChartData)
    if (!avgPerVideoData){
      console.log("Error from avgPerVideoData from billing....")
      return;
    }
    if (!avgLikesPerVideoData){
      console.log("Error from avgLikesPerVideo from billing....")
      return;
    }
    if (!sentimentRatioData){
      console.log("Error from sentimentRatio from billing....")
      return;
    }
    
    
    
    
    
    
   
  };
 
  const prepareChartData = (data) => {
    const labels = data.map(item => item.title);
    const viewCounts = data.map(item => item.subscriberCount);
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
  const prepareVideoCountChartData = (data) => {
    const labels = data.map(item => item.title);
    const videoCounts = data.map(item => item.videoCount);
    return {
      labels: labels,
      datasets: [
        {
          label: 'Video Counts',
          data: videoCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
  const prepareViewCountChartData = (data) => {
    const labels = data.map(item => item.title);
    const viewCounts = data.map(item => item.viewCount);
    return {
      labels: labels,
      datasets: [
        {
          label: 'View Counts',
          data: viewCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
  
  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };
  
  const prepareAvgPerVideo = (data) => {
    const labels = data['average_views'].map(item => item.title);
    const viewCounts = data['average_views'].map(item => item.average_view_count);
    
    // Generate random colors for each segment
    const backgroundColors = viewCounts.map(() => getRandomColor());
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Average View Counts',
          data: viewCounts,
          backgroundColor: backgroundColors, // Use the random colors here
          borderColor: 'rgba(255, 255, 255, 1)', // Optional: change to white or a contrasting color
          borderWidth: 1,
        },
      ],
    };
  };
  const prepareLikePerVideo = (data) => {
    const labels = data['average_views'].map(item => item.title);
    const viewCounts = data['average_views'].map(item => item.average_like_count);
    
    // Generate random colors for each segment
    const backgroundColors = viewCounts.map(() => getRandomColor());
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Average View Counts',
          data: viewCounts,
          backgroundColor: backgroundColors, // Use the random colors here
          borderColor: 'rgba(255, 255, 255, 1)', // Optional: change to white or a contrasting color
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareSentimentRatio = (data) => {
    const labels = data['sentimentAnalysis'].map(item => item.title);

    // Initialize arrays for positive, negative, and neutral sentiment ratios
    const positiveSentiments = [];
    const negativeSentiments = [];
    const neutralSentiments = [];

    // Fill the arrays based on sentiment ratios in the data
    data['sentimentAnalysis'].forEach(item => {
        positiveSentiments.push(item.sentiment['Positive Percentage']);  // Assuming structure like item.sentiment = { positive: ..., negative: ..., neutral: ... }
        negativeSentiments.push(item.sentiment['Negative Percentage']);
        neutralSentiments.push(item.sentiment['Neutral Percentage']);
    });
    return {
        labels: labels,
        datasets: [
            {
                label: 'Positive Sentiment',
                data: positiveSentiments,
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Example color
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Negative Sentiment',
                data: negativeSentiments,
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Example color
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Neutral Sentiment',
                data: neutralSentiments,
                backgroundColor: 'rgba(255, 206, 86, 0.6)', // Example color
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            },
        ],
    };
};





  // Sample data
const data = [
  { title: "Product A", positive: 70, negative: 20, neutral: 10 },
  { title: "Product B", positive: 50, negative: 30, neutral: 20 },
  { title: "Product C", positive: 60, negative: 25, neutral: 15 },
];

// Extract titles and data for the stacked bar chart
const titles = data.map(item => item.title);
const positiveData = data.map(item => item.positive);
const negativeData = data.map(item => item.negative);
const neutralData = data.map(item => item.neutral);

// Prepare datasets for Chart.js
const datasets = [
  {
    label: "Positive Comments",
    data: positiveData,
    // backgroundColor: "rgba(76, 175, 80, 0.6)", // Green
    backgroundColor: "success", // Green
  },
  {
    label: "Negative Comments",
    data: negativeData,
    // backgroundColor: "rgba(244, 67, 54, 0.6)", // Red
    backgroundColor: "info", // Red
  },
  {
    label: "Neutral Comments",
    data: neutralData,
    // backgroundColor: "rgba(255, 193, 7, 0.6)", // Yellow
    backgroundColor: "secondary", // Yellow
  },
];

// Prepare the chart configuration
const chartData = {
  labels: titles,
  datasets: datasets,
};

  return (
    // <DashboardLayout>
    //   <Grid container spacing={3}>
    //     {/* Input Section */}
    //     <Grid item xs={12} md={6}>
    //       <MDBox display="flex" alignItems="center" ml="auto" mb={2}>
    //         <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
    //           <MDInput
    //             label="Enter your YouTube ID"
    //             value={localYoutubeId}
    //             onChange={(e) => setLocalYoutubeId(e.target.value)}
    //             sx={{ mr: 1 }}
    //           />
    //           <MDButton type="submit" variant="gradient" color="info" sx={{ mr: 1 }}>
    //             Enter
    //           </MDButton>
    //         </form>
    //       </MDBox>

    //       <MDBox>
    //         {newYoutubeIds.map((id) => (
    //           <MDBox key={id} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
    //             <span>{id}</span>
    //             <MDButton variant="outlined" color="error" onClick={() => handleRemove(id)}>
    //               Remove
    //             </MDButton>
    //           </MDBox>
    //         ))}
    //       </MDBox>

    //       <MDBox mt={2}>
    //         <MDButton variant="contained" color="success" onClick={handleShowStats}>
    //           Show Stats
    //         </MDButton>
    //       </MDBox>
    //     </Grid>

    //     {/* Chart Section */}
    //     <Grid item xs={12} md={6}>
    //       <MDBox mt={4} mb={3}>
    //         <ReportsBarChart
    //           color="success"
    //           title="Subscriber Comparison"
    //           chart={subscriberBarChartData}
    //         />
    //       </MDBox>
    //       <MDBox mt={4} mb={3}>
    //         <ReportsBarChart
    //           color="primary"
    //           title="Video Count"
    //           chart={videoCountBarChartData}
    //         />
    //       </MDBox>
    //       <MDBox mt={4} mb={3}>
    //         <ReportsBarChart
    //           color="info"
    //           title="View Count"
    //           chart={viewCountBarChartData}
    //         />
    //       </MDBox>
    //       {/* <MDBox mt={4} mb={3}>
    //         <ReportsBarChart
    //           color="dark"
    //           title="Average Views Per Video"
    //           chart={avgViewPerChannelCountBarChartData}
    //         />
    //       </MDBox> */}
    //       <MDBox mt={4} mb={3}>

    //       <PieChart
    //               icon={{ color: "info", component: "pie_chart" }}
    //               title="Average Views Per Video"
    //               // description="View count per month"
    //               height="19.125rem"
    //               chart={avgViewPerChannelCountBarChartData}
    //               />
    //           </MDBox>
    //       <MDBox mt={4} mb={3}>
    //       <PieChart
    //               icon={{ color: "error", component: "pie_chart" }}
    //               title="Average Likes Per Video"
    //               // description="View count per month"
    //               height="19.125rem"
    //               chart={avgLikePerChannelCountBarChartData}
    //             />
            
    //       </MDBox>
    //       {/* <MDBox mt={4} mb={3}>
    //       <ReportsStackedBarChart
    //   color="primary"
    //   title="Comments Distribution"
    //   chart={chartData}
    // />
            
    //       </MDBox> */}
    //       <MDBox mt={4} mb={3}>
    //       <ReportsStackedBarChart
    //   color="info"
    //   title="Sentiment Ratio of Comments"
    //   chart={sentimentRatioPieChartData}
    // />
            
    //       </MDBox>
    //     </Grid>
    //   </Grid>
    // </DashboardLayout>
    <DashboardLayout>
  <Grid container spacing={3} direction="column">
    {/* Input Section at the Top */}
    <Grid item xs={12}>
      <MDBox display="flex" alignItems="center" justifyContent="center" mb={2}>
        <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
          <MDInput
            label="Enter your YouTube ID"
            value={localYoutubeId}
            onChange={(e) => setLocalYoutubeId(e.target.value)}
            sx={{ mr: 1 }}
          />
          <MDButton type="submit" variant="gradient" color="info" sx={{ mr: 1 }}>
            Enter
          </MDButton>
        </form>
      </MDBox>

      <MDBox display="flex" flexDirection="column" alignItems="center">
        {newYoutubeIds.map((id) => (
          <MDBox key={id} display="flex" alignItems="center" justifyContent="space-between" mb={1} sx={{ width: "50%" }}>
            <span>{id}</span>
            <MDButton variant="outlined" color="error" onClick={() => handleRemove(id)}>
              Remove
            </MDButton>
          </MDBox>
        ))}
      </MDBox>

      <MDBox display="flex" justifyContent="center" mt={2}>
        <MDButton variant="contained" color="success" onClick={handleShowStats}>
          Show Stats
        </MDButton>
      </MDBox>
    </Grid>

    {/* Chart Section Below Input Section */}
    <Grid item xs={12}>
      <MDBox mt={4} mb={3}>
        <ReportsBarChart
          color="success"
          title="Subscriber Comparison"
          chart={subscriberBarChartData}
        />
      </MDBox>
      <MDBox mt={4} mb={3}>
        <ReportsBarChart
          color="primary"
          title="Video Count"
          chart={videoCountBarChartData}
        />
      </MDBox>
      <MDBox mt={4} mb={3}>
        <ReportsBarChart
          color="info"
          title="View Count"
          chart={viewCountBarChartData}
        />
      </MDBox>
      <MDBox mt={4} mb={3}>
        <PieChart
          icon={{ color: "info", component: "pie_chart" }}
          title="Average Views Per Video"
          height="19.125rem"
          chart={avgViewPerChannelCountBarChartData}
        />
      </MDBox>
      <MDBox mt={4} mb={3}>
        <PieChart
          icon={{ color: "error", component: "pie_chart" }}
          title="Average Likes Per Video"
          height="19.125rem"
          chart={avgLikePerChannelCountBarChartData}
        />
      </MDBox>
      <MDBox mt={4} mb={3} width="100%">
  <ReportsStackedBarChart
    color="info"
    title="Sentiment Ratio of Comments"
    height="19.125rem"

    chart={sentimentRatioPieChartData}
  />
</MDBox>

    </Grid>
  </Grid>
</DashboardLayout>
  );
}

export default Billing;
