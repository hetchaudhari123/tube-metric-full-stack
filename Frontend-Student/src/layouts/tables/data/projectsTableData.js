
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import { useEffect,useState } from "react";
import { useYoutube } from "context/YoutubeContext";
export default function data() {
  const { youtubeId, setYoutubeId,currentYoutubeId,setCurrentYoutubeId } = useYoutube();
  // const {videoIds,setVideoIds} = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [views, setViews] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments,setComments] = useState([]);
  const [commentRatio,setCommentRatio] = useState([]);
  const [videoCount, setVideoCount] = useState([]);
  const [country, setCountry] = useState(null);
  const [playlistId,setPlaylistId] = useState([])
  const [titles,setTitles] = useState([])
  const [thumbnails,setThumbnails] = useState([])
  const [positiveRatio,setPositiveRatio] = useState([])
  

  useEffect(()=>{
    const fetchChannelDetails = async () => {
      if (!youtubeId) return;

      try {
        // const response = await fetch(`http://127.0.0.1:5000/api/channel/${currentYoutubeId}`);
        const response = await fetch(`https://tube-metrics-full-stack.onrender.com${currentYoutubeId}`);
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
  },[youtubeId])
  useEffect(() => {
    const fetchVideosDetails = async () => {
      if (!playlistId || playlistId.length === 0) return; // Check if playlistId is available
      console.log("Playlist.......",playlistId)
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/videos/get-videos-details-from-playlistId`, {
          method: 'POST', // Change to POST request
          headers: {
            'Content-Type': 'application/json', // Specify content type
          },
          body: JSON.stringify({ playlistId }), // Send playlistId in the request body
        });
        const data = await response.json();
        if (response.ok) {
          // Create arrays to hold views, likes, and comments
          const viewsList = [];
          const likesList = [];
          const commentsList = [];
          const titlesList = []; // Fixed typo from titlesLise to titlesList
          const thumbnailsList = []; // Fixed typo from titlesLise to titlesList
          const videoIds = [];
          // Iterate over each video in the data
          data["videoData"].forEach(video => {
            viewsList.push(video.viewCount || 0); // Add views to the list
            likesList.push(video.likeCount || 0); // Add likes to the list
            commentsList.push(video.commentCount || 0); // Add comments to the list
            titlesList.push(video.title || ""); // Add the title of the video
            thumbnailsList.push(video.thumbnails.default.url)
            videoIds.push(video.video_id)
          });
  
          // Update state with the lists
          setViews(viewsList);
          setLikes(likesList); // Make sure to define this state setter
          setTitles(titlesList); // Fixed typo here
          setComments(commentsList); // Make sure to define this state setter
          setThumbnails(thumbnailsList);
          // setVideoIds(videoIds);
          try {
            const response = await fetch(`http://127.0.0.1:5000/api/videos/positive-sentiment-ratio`, {
                method: 'POST', // Change to POST request
                headers: {
                    'Content-Type': 'application/json', // Specify content type
                },
                body: JSON.stringify({ videoIds }), // Send videoIds in the request body
            });
        
            const data = await response.json();
            
            if (response.ok) {
                // Extract positive percentages from the response data
                const positivePercentages = Object.values(data); // Get the values from the dictionary
                
                // console.log(positivePercentages); // Log the list of positive percentages
                setPositiveRatio(positivePercentages)
                // You can now use `positivePercentages` as needed in your application
            } else {
                console.error("Error fetching channel details:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        } else {
          console.error("Error fetching channel details:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchVideosDetails();
    
  }, [playlistId]);
  
  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );
  return {
    columns: [
      { Header: "Title", accessor: "Title", width: "30%", align: "left" },
      { Header: "Views", accessor: "Views", align: "left" },
      { Header: "Likes", accessor: "Likes", align: "center" },
      { Header: "Comments", accessor: "Comments", align: "center" },
      { Header: "Positive Percentage of the Comments", accessor: "positive_percentage_of_the_comments", align: "center" },
    ],
    rows: titles.map((title, index) => ({
      Title: <Project name={title} image={thumbnails[index]} />,
      Views: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {views[index]}
        </MDTypography>
      ),
      Likes: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {likes[index]}
        </MDTypography>
      ),
      Comments: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {comments[index]}
        </MDTypography>
      ),
      positive_percentage_of_the_comments:(
        <MDTypography component="a" href="#" color="text">
        {`${positiveRatio[index]}%`}
      </MDTypography>
      )
    })),
  };
  
  // return {
  //   columns: [
  //     { Header: "Title", accessor: "Title", width: "30%", align: "left" },
  //     { Header: "Views", accessor: "Views", align: "left" },
  //     { Header: "Likes", accessor: "Likes", align: "center" },
  //     { Header: "Comment_Ratio", accessor: "Comment_Ratio", align: "center" },
  //   ],

  //   rows: [
  //     {
  //       Title: <Project image={LogoAsana} name="Asana" />,
  //       Views: (
  //         <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
  //           $2,500
  //         </MDTypography>
  //       ),
  //       Likes: (
  //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //           working
  //         </MDTypography>
  //       ),
  //       Comment_Ratio: <Progress color="info" value={60} />,
  //       action: (
  //         <MDTypography component="a" href="#" color="text">
  //           <Icon>more_vert</Icon>
  //         </MDTypography>
  //       ),
  //     },
  //     {
  //       Title: <Project image={logoGithub} name="Github" />,
  //       Views: (
  //         <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
  //           $5,000
  //         </MDTypography>
  //       ),
  //       Likes: (
  //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //           done
  //         </MDTypography>
  //       ),
  //       Comment_Ratio: <Progress color="success" value={100} />,
  //       action: (
  //         <MDTypography component="a" href="#" color="text">
  //           <Icon>more_vert</Icon>
  //         </MDTypography>
  //       ),
  //     },
  //     {
  //       Title: <Project image={logoAtlassian} name="Atlassian" />,
  //       Views: (
  //         <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
  //           $3,400
  //         </MDTypography>
  //       ),
  //       Likes: (
  //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //           canceled
  //         </MDTypography>
  //       ),
  //       Comment_Ratio: <Progress color="error" value={30} />,
  //       action: (
  //         <MDTypography component="a" href="#" color="text">
  //           <Icon>more_vert</Icon>
  //         </MDTypography>
  //       ),
  //     },
  //     {
  //       Title: <Project image={logoSpotify} name="Spotify" />,
  //       Views: (
  //         <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
  //           $14,000
  //         </MDTypography>
  //       ),
  //       Likes: (
  //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //           working
  //         </MDTypography>
  //       ),
  //       Comment_Ratio: <Progress color="info" value={80} />,
  //       action: (
  //         <MDTypography component="a" href="#" color="text">
  //           <Icon>more_vert</Icon>
  //         </MDTypography>
  //       ),
  //     },
  //     {
  //       Title: <Project image={logoSlack} name="Slack" />,
  //       Views: (
  //         <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
  //           $1,000
  //         </MDTypography>
  //       ),
  //       Likes: (
  //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //           canceled
  //         </MDTypography>
  //       ),
  //       Comment_Ratio: <Progress color="error" value={0} />,
  //       action: (
  //         <MDTypography component="a" href="#" color="text">
  //           <Icon>more_vert</Icon>
  //         </MDTypography>
  //       ),
  //     },
  //     {
  //       Title: <Project image={logoInvesion} name="Invesion" />,
  //       Views: (
  //         <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
  //           $2,300
  //         </MDTypography>
  //       ),
  //       Likes: (
  //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //           done
  //         </MDTypography>
  //       ),
  //       Comment_Ratio: <Progress color="success" value={100} />,
  //       action: (
  //         <MDTypography component="a" href="#" color="text">
  //           <Icon>more_vert</Icon>
  //         </MDTypography>
  //       ),
  //     },
  //   ],
  // };
   
}
