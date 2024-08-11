import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FrontPage = () => {
  const [channelName, setChannelName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchAccessToken ,setAccessToken]= useState('');

  // Replace this with the access token you obtained from your OAuth flow
//   const accessToken = 'ya29.a0AcM612yt-ttTarJf4orG2QDPTp6twPhGbhkMgA7MNNHoAdUUNryIRnngAnkHOPxl6CBgSlSLwPWs-6AHovKOAn5Y0k5Xztrf2H1VQuWS8Odj5goUC35esBk4nbh5jJYpqPOm63W40TRxR0wOUAVz64cOdmSMlC_FHd2OaCgYKAXQSARESFQHGX2MiXzEH6yinTfgDUiU2ZZh6xA0171';


  //search channel name
  const fetchChannelName = async () => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels',
        {
          headers: {
            Authorization: `Bearer ${searchAccessToken}`,
          },
          params: {
            part: 'snippet',
            mine: true,
          },
        }
      );

      const channel = response.data.items[0];
      if (channel) {
        setChannelName(channel.snippet.title);
      }
    } catch (error) {
      console.error('Error fetching channel name:', error);
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          headers: {
            Authorization: `Bearer ${searchAccessToken}`,
          },
          params: {
            part: 'snippet',
            q: searchQuery,
            type: 'video',
            maxResults: 10,
          },
        }
      );

      setSearchResults(response.data.items);
      setSelectedVideo(null); // Clear the selected video if a new search is made
    } catch (error) {
      console.error('Error searching videos:', error);
    }
  };

  // Handle video selection and load it into an iframe for playback
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div>
      <h1>YouTube App</h1>
      {channelName && <h2>Channel: {channelName}</h2>}
      <input
        type='text'
        value={searchAccessToken}
        onChange={(e)=>setAccessToken(e.target.value)}
        placeholder='search for access token'
      />
      <button onClick={fetchChannelName}>Search channel</button>
 

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for videos"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h2>Search Results</h2>
      <ul>
        {searchResults.map((result) => (
          <li key={result.id.videoId} onClick={() => handleVideoClick(result)}>
            {result.snippet.title}
          </li>
        ))}
      </ul>

      {selectedVideo && (
        <div>
          <h3>{selectedVideo.snippet.title}</h3>
          <iframe
            id="player"
            type="text/html"
            width="640"
            height="390"
            src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
            frameBorder="0"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default FrontPage;
