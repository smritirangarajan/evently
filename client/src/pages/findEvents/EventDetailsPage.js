import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './eventDetails.css';

function EventDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [event, setEvent] = useState(location.state?.event || null);

  if (!event) return <div className="event-details-container">Event not found.</div>;

  const imageUrl = event.images?.[0]?.url;
  const attractions = event._embedded?.attractions || [];
  const venue = event._embedded?.venues?.[0];
  const date = new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const time = event.dates?.start?.localTime
    ? new Date(`${event.dates?.start?.localDate}T${event.dates?.start?.localTime}`).toLocaleTimeString([], {
        hour: 'numeric', minute: '2-digit', hour12: true,
      })
    : null;

  const addToGoogleCalendar = () => {
    const startDateTime = event.dates?.start?.dateTime || event.dates?.start?.localDate;
    const startTime = new Date(startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime = startTime;

    const text = encodeURIComponent(event.name || "Event");
    const details = encodeURIComponent(event.info || "No description provided.");
    const locationName = encodeURIComponent(venue?.name || "Location TBD");

    const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${text}&dates=${startTime}/${endTime}&details=${details}&location=${locationName}`;
    window.open(url, '_blank');
  };

  return (
    <div className="event-details-container">


      <h1 className="event-title">{event.name}</h1>

      {imageUrl && (
        <img src={imageUrl} alt={event.name} className="event-image" />
      )}

      <div className="event-info">
        <p><strong>Date:</strong> {formattedDate}</p>
        {time && <p><strong>Time:</strong> {time}</p>}
        {venue && (
          <>
            <p><strong>Venue:</strong> {venue.name}</p>
            <p><strong>Address:</strong> {venue.address?.line1}, {venue.city?.name}, {venue.state?.name} {venue.postalCode}</p>
            {venue.location && (
              <p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.location.latitude},${venue.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="back-button"
                >
                  View on Google Maps
                </a>
              </p>
            )}
          </>
        )}
        {event.info && <p><strong>Description:</strong> {event.info}</p>}
      </div>

      {attractions.length > 0 && (
        <div className="attractions-section">
          <h2>Artists / Attractions</h2>
          <div className="attractions-grid">
            {attractions.map((artist) => (
              <div key={artist.id} className="artist-card">
                <p className="artist-name">{artist.name}</p>
                {artist.externalLinks?.facebook && (
                  <a
                    href={artist.externalLinks.facebook[0]?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="artist-link facebook"
                  >
                    Facebook
                  </a>
                )}
                {artist.externalLinks?.instagram && (
                  <a
                    href={artist.externalLinks.instagram[0]?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="artist-link instagram"
                  >
                    Instagram
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-buttons">
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Tickets
          </a>
        )}

        <button onClick={addToGoogleCalendar}>
          Add to Google Calendar
        </button>
      </div>
    </div>
  );
}

export default EventDetailsPage;