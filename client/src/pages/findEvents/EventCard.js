import React from 'react';
import './EventCard.css';

function EventCard({ event, onViewDetails, onAddEvent }) {
  const imageUrl = event.images?.[0]?.url;
  const name = event.name;
  const date = event.dates?.start?.localDate || event.dates?.start?.dateTime;
  const venue = event._embedded?.venues?.[0]?.name;

  const addToGoogleCalendar = () => {
    const startDateTime = event.dates?.start?.dateTime || event.dates?.start?.localDate;
    const startTime = startDateTime
      ? new Date(startDateTime).toISOString().replace(/-|:|\.\d\d\d/g, "")
      : "";
    const endTime = startTime;

    const text = encodeURIComponent(event.name || "Event");
    const details = encodeURIComponent(event.info || "No description provided.");
    const location = encodeURIComponent(event._embedded?.venues?.[0]?.name || "Location TBD");

    const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${text}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;

    window.open(url, '_blank');
  };

  return (
    <div className="event-card">
      {imageUrl && (
        <div className="event-card-image-container">
          <img src={imageUrl} alt={name} onClick={onViewDetails} />
        </div>
      )}
      <div className="event-card-content">
        <div>
          <h2>{name}</h2>
          <p>{new Date(date).toLocaleDateString()}</p>
          <p>{venue}</p>
        </div>
        <div className="event-card-buttons">
          <button className="view-details" onClick={onViewDetails}>View Details</button>
          <button className="add-event" onClick={() => onAddEvent(event)}>+ Add to My Events</button>
          <button className="add-calendar" onClick={addToGoogleCalendar}>+ Add to Calendar</button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
