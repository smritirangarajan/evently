import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import axios from 'axios';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import './upcomingEvents.css';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [selectedPref, setSelectedPref] = useState(null);
  const [userLocation, setUserLocation] = useState('San Francisco');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedPref || !userLocation) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get('/api/events/ticketmaster', {
          params: {
            keyword: selectedPref.toLowerCase(),
            city: userLocation
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
    <div className="upcoming-events-page">
      <h1 className="upcoming-events-title">Recommended Events for You</h1>

      <div className="preferences-bar">
        {preferences.map((pref) => (
          <button
            key={pref}
            onClick={() => handlePreferenceClick(pref)}
            className={`pref-button ${selectedPref === pref ? 'selected' : ''}`}
          >
            {pref}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : events.length > 0 ? (
        <div className="event-grid">
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
        <p>No events found for "{selectedPref}" in San Francisco</p>
      )}
    </div>
  );
}

export default UpcomingEvents;
