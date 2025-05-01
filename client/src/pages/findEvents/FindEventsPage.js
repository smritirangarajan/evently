import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import axios from 'axios';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

function FindEventsPage() {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [userLocation, setUserLocation] = useState('San Francisco');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const prefs = userSnap.data().preferences || [];
          setPreferences(prefs);
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
        setError('Could not load preferences.');
      }
    };

    loadPreferences();
  }, []);

  // Fetch grouped events by preference
  useEffect(() => {
    const fetchGrouped = async () => {
      if (!preferences.length) return;
      setIsLoading(true);

      const results = {};

      await Promise.all(preferences.map(async (pref) => {
        try {
          const res = await axios.get('/api/events/ticketmaster', {
            params: { keyword: pref, location: userLocation }
          });
          results[pref] = res.data;
        } catch (err) {
          console.error(`Error fetching for ${pref}:`, err);
          results[pref] = [];
        }
      }));

      setGroupedEvents(results);
      setIsLoading(false);
    };

    fetchGrouped();
  }, [preferences, userLocation]);

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
        params: { keyword: searchQuery, location: userLocation }
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
      {searchResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {searchResults.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={() => navigate(`/event/${event.id}`, { state: { event } })}
                onAddEvent={handleAddEvent}
              />
            ))}
          </div>
        </>
      )}

      {/* Grouped by Preferences */}
      {Object.entries(groupedEvents).map(([pref, events]) => (
        <div key={pref} className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Events related to {pref}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={() => navigate(`/event/${event.id}`, { state: { event } })}
                onAddEvent={handleAddEvent}
              />
            ))}
          </div>
        </div>
      ))}

      {isLoading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default FindEventsPage;
