// src/pages/dashboard/MyEvents.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <nav className="space-x-4 text-sm">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/find-events')}>Find Events</button>
          <button className="font-bold text-black">My Events</button>
        </nav>
        <button onClick={() => auth.signOut()} className="text-sm text-red-500 hover:underline">
          Log out
        </button>
      </header>

      <h1 className="text-2xl font-bold mb-4">My Saved Events</h1>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No saved events yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Event Name</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Countdown</th>
              <th className="border p-2">Delete</th>
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
                  <td className="border p-2">{event.name}</td>
                  <td className="border p-2">{dateStr}</td>
                  <td className="border p-2">{timeStr}</td>
                  <td className="border p-2">{countdown}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDelete(event)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
