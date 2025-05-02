import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import axios from 'axios';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import './findEvents.css';

function FindEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState('San Francisco');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle event addition
  const handleAddEvent = async (event) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { myEvents: arrayUnion(event) });

      alert('✅ Event added to your list!');
    } catch (err) {
      console.error('Add event failed:', err);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get('/api/events/ticketmaster', {
        params: { keyword: searchQuery, city: userLocation }
      });
      setSearchResults(res.data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="find-events-page">
      <h1 className="find-events-title">Events</h1>

      {/* Search Section */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for Events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : searchResults.length > 0 ? (
        <div className="results-section">
          <h2>Events related to "{searchQuery}"</h2>
          <div className="event-grid">
            {searchResults.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={() => navigate(`/event/${event.id}`, { state: { event } })}
                onAddEvent={handleAddEvent}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default FindEventsPage;