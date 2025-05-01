import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import axios from 'axios';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Events</h1>

      {/* Search Section */}
      <div className="flex mb-6 items-center gap-2">
        <input
          type="text"
          placeholder="Search for Events"
          className="p-2 border rounded w-full sm:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-black text-white px-4 py-2 rounded">Search</button>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : searchResults.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Events related to "{searchQuery}"</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <p className="text-gray-600">No results found.</p>
      )}
    </div>
  );
}

export default FindEventsPage;
