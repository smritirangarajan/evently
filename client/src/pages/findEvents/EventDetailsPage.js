// src/pages/findEvents/EventDetailsPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function EventDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  if (!event) return <div className="p-6">Event not found.</div>;

  const imageUrl = event.images?.[0]?.url;
  const attractions = event._embedded?.attractions || [];

  const addToGoogleCalendar = () => {
    const startDateTime = event.dates?.start?.dateTime || event.dates?.start?.localDate;
    const startTime = startDateTime
      ? new Date(startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, "")
      : "";
    const endTime = startTime;

    const text = encodeURIComponent(event.name || "Event");
    const details = encodeURIComponent(event.info || "No description provided.");
    const locationName = encodeURIComponent(event._embedded?.venues?.[0]?.name || "Location TBD");

    const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${text}&dates=${startTime}/${endTime}&details=${details}&location=${locationName}`;

    window.open(url, '_blank');
  };

  return (
    <div className="p-8">
      <button onClick={() => navigate('/find-events')} className="text-blue-500 text-sm mb-6 hover:underline">
        ← Back to Events
      </button>

      <h1 className="text-4xl font-bold mb-6">{event.name}</h1>

      {imageUrl && (
        <img src={imageUrl} alt={event.name} className="w-full h-96 object-cover rounded-lg mb-6" />
      )}

      <p className="text-lg mb-2"><strong>Date:</strong> {new Date(event.dates?.start?.localDate).toLocaleDateString()}</p>
      <p className="text-lg mb-2"><strong>Venue:</strong> {event._embedded?.venues?.[0]?.name}</p>
      <p className="text-lg mb-6"><strong>Description:</strong> {event.info || "No description provided."}</p>

      {attractions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Artists / Attractions</h2>
          {attractions.map((artist) => (
            <div key={artist.id} className="mb-4">
              <p><strong>Name:</strong> {artist.name}</p>
              {artist.externalLinks?.facebook && (
                <p><a href={artist.externalLinks.facebook[0]?.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Facebook</a></p>
              )}
              {artist.externalLinks?.instagram && (
                <p><a href={artist.externalLinks.instagram[0]?.url} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Instagram</a></p>
              )}
            </div>
          ))}
        </div>
      )}

      {event.url && (
        <div className="mb-6">
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Book Tickets
          </a>
        </div>
      )}

      <button
        onClick={addToGoogleCalendar}
        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
      >
        Add to Google Calendar
      </button>
    </div>
  );
}

export default EventDetailsPage;