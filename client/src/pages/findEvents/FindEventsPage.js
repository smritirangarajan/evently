import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import axios from 'axios';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

function FindEventsPage() {
  const [events, setEvents] = useState([]);
  const [userLocation, setUserLocation] = useState('Berkeley');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.city) {
          setUserLocation(userData.city);
        }
        fetchRecommendedEvents('music');
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const fetchRecommendedEvents = async (mood) => {
    try {
      const res = await axios.get('/api/events/ticketmaster', {
        params: {
          location: userLocation,
          mood
        }
      });
      const ticketmasterEvents = res.data || [];
      setEvents(ticketmasterEvents);
    } catch (error) {
      console.error('Error fetching recommended events:', error);
    }
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
      <h1 className="text-2xl font-bold mb-6">Recommended Events for You</h1>
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
    </div>
  );
}

export default FindEventsPage;
