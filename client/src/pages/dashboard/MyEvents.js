import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './myEvents.css';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const savedEvents = userSnap.data().myEvents || [];
          setEvents(savedEvents);
        }
      } catch (error) {
        console.error('Error fetching saved events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleDelete = async (eventToDelete) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        myEvents: arrayRemove(eventToDelete),
      });

      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const formatCountdown = (dateTimeString) => {
    const now = new Date();
    const eventDate = new Date(dateTimeString);
    const diff = eventDate - now;
    if (diff < 0) return 'Event passed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="my-events-page">
      <h1 className="my-events-title">My Saved Events</h1>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No saved events yet.</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Countdown</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const dateTime = new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate);
              const dateStr = dateTime.toLocaleDateString();
              const timeStr = dateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
              const countdown = formatCountdown(dateTime);

              return (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{dateStr}</td>
                  <td>{timeStr}</td>
                  <td>{countdown}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(event)}
                      className="delete-button"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyEvents;
