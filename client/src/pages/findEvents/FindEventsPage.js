import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import axios from 'axios';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

function FindEventsPage() {
  const [events, setEvents] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [selectedPref, setSelectedPref] = useState(null);
  const [userLocation, setUserLocation] = useState('San Francisco');
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
          const userData = userSnap.data();
          const prefs = userData.preferences || [];
          setPreferences(prefs);

          if (prefs.length > 0) {
            setSelectedPref(prefs[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
        setError('Could not load preferences.');
      }
    };

    loadPreferences();
  }, []);

  // Fetch events when selectedPref or location changes
  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedPref || !userLocation) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get('/api/events/ticketmaster', {
          params: {
            mood: selectedPref.toLowerCase(),
            location: userLocation
          }
        });

        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [selectedPref, userLocation]);

  const handlePreferenceClick = (pref) => {
    setSelectedPref(pref);
  };

  const handleAddEvent = async (event) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        myEvents: arrayUnion(event)
      });

      alert('✅ Event added to your list!');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recommended Events for You</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {preferences.map((pref) => (
          <button
            key={pref}
            onClick={() => handlePreferenceClick(pref)}
            className={`px-4 py-2 rounded-full text-sm transition duration-200 ${
              selectedPref === pref
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-orange-200'
            }`}
          >
            {pref}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading events...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={() => navigate(`/event/${event.id}`, { state: { event } })}
              onAddEvent={handleAddEvent}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No events found for "{selectedPref}" in San Francisco</p>
      )}
    </div>
  );
}

export default FindEventsPage;
