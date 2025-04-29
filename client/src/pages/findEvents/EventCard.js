import React from 'react';

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
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all w-60 h-80 overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-36 object-cover"
          onClick={onViewDetails}
        />
      )}
      <div className="flex flex-col justify-between flex-grow p-4">
        <div className="flex flex-col space-y-1 text-center">
          <h2 className="text-md font-semibold text-gray-800 truncate">{name}</h2>
          <p className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500 truncate">{venue}</p>
        </div>

        <div className="flex flex-col items-center space-y-2 mt-4">
          <button 
            className="bg-blue-500 text-white text-xs py-1 px-3 rounded hover:bg-blue-600 w-full"
            onClick={onViewDetails}
          >
            View Details
          </button>
          <button 
            className="bg-green-500 text-white text-xs py-1 px-3 rounded hover:bg-green-600 w-full"
            onClick={() => onAddEvent(event)}
          >
            + Add to My Events
          </button>
          <button 
            className="bg-purple-500 text-white text-xs py-1 px-3 rounded hover:bg-purple-600 w-full"
            onClick={addToGoogleCalendar}
          >
            + Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
