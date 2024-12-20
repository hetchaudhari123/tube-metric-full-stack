import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook

const YoutubeContext = createContext();

export const YoutubeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0(); // Access Auth0 user information
  const [youtubeId, setYoutubeId] = useState(null);
  const [videoIds, setVideoIds] = useState([]);
  const [playlistId, setPlaylistId] = useState();
  const [currentYoutubeId,setCurrentYoutubeId] = useState()
  const [apiKey,setApiKey] = useState(null)
  // Function to fetch youtubeId from the backend
  const fetchYoutubeId = async (email) => {
    try {
      // const response = await fetch("http://127.0.0.1:5000/api/get-youtube-id", {
      const response = await fetch("https://tube-metrics-full-stack.onrender.com/api/get-youtube-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log("youtubeId data fetched is....",data.youtubeId)
      if (response.ok) {
        setYoutubeId(data.youtubeId);
        setCurrentYoutubeId(data.youtubeId);
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
        
      } else {
        console.error("Failed to fetch youtubeId:", data.message);
      }
    } catch (error) {
      console.error("Error fetching youtubeId:", error);
    }
  };



  // useEffect(() => {
  //   if (youtubeId) {
  //     localStorage.setItem("youtubeId", youtubeId);
  //   }
  //   if (currentYoutubeId) {
  //     localStorage.setItem("currentYoutubeId", currentYoutubeId);
  //   }
  // }, [youtubeId, currentYoutubeId]);
  

  // Automatically fetch youtubeId when user is authenticated and email is available
  useEffect(() => {
    if (youtubeId) {
      localStorage.setItem("youtubeId", youtubeId);
    }
    if (currentYoutubeId) {
      localStorage.setItem("currentYoutubeId", currentYoutubeId);
    }
  }, [youtubeId, currentYoutubeId]);
  useEffect(() => {
    const storedYoutubeId = localStorage.getItem("youtubeId");
    const storedCurrentYoutubeId = localStorage.getItem("currentYoutubeId");
    if (storedYoutubeId) setYoutubeId(storedYoutubeId);
    if (storedCurrentYoutubeId) setCurrentYoutubeId(storedCurrentYoutubeId);
    // if (isAuthenticated && user?.email && (!storedYoutubeId )) {
      //   fetchYoutubeId(user.email);
      // }
      if (isAuthenticated && user?.email) {
      console.log("INSIDE YOUTUBE PROVIDER.........")
      fetchYoutubeId(user.email);
    }
  }, [isAuthenticated, user]);
  
  
  // useEffect(() => {
  //   if (isAuthenticated && user?.email) {
  //     fetchYoutubeId(user.email);
  //   }
  // }, [isAuthenticated, user]);

  return (
    <YoutubeContext.Provider
      value={{
        youtubeId,
        setYoutubeId,
        videoIds,
        setVideoIds,
        playlistId,
        setPlaylistId,
        fetchYoutubeId, // Optional manual fetch
        currentYoutubeId,
        setCurrentYoutubeId,
        apiKey,
        setApiKey
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};

export const useYoutube = () => {
  return useContext(YoutubeContext);
};
