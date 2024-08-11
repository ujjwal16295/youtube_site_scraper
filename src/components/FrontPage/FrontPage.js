import React, { useState } from 'react';
import axios from 'axios';

const FrontPage = () => {
  const [channelName, setChannelName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchAccessToken, setAccessToken] = useState('');

  // Fetch channel name
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

  // Handle video selection and redirect to YouTube
  const handleVideoClick = (videoId) => {
    window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
  };

  return (
    <div>
      <h1>YouTube App</h1>
      {channelName && <h2>Channel: {channelName}</h2>}
      <input
        type='text'
        value={searchAccessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        placeholder='Enter access token'
      />
      <button onClick={fetchChannelName}>Search Channel</button>

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
          <li
            key={result.id.videoId}
            onClick={() => handleVideoClick(result.id.videoId)}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
          >
            {result.snippet.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FrontPage;
