import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function EventDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams(); // for deep linking in the future
  const [event, setEvent] = useState(location.state?.event || null);

  // Optional: fetch event by ID if not passed via navigation
  // useEffect(() => {
  //   if (!event && params.id) {
  //     axios.get(`/api/events/${params.id}`).then(res => {
  //       setEvent(res.data);
  //     });
  //   }
  // }, [params.id]);

  if (!event) return <div className="p-6 text-gray-600">Event not found.</div>;

  const imageUrl = event.images?.[0]?.url;
  const attractions = event._embedded?.attractions || [];
  const venue = event._embedded?.venues?.[0];
  const date = new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate);
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = event.dates?.start?.localTime
  ? new Date(`${event.dates?.start?.localDate}T${event.dates?.start?.localTime}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/find-events')}
        className="text-blue-500 text-sm mb-4 hover:underline"
      >
        ← Back to Events
      </button>

      <h1 className="text-4xl font-bold mb-4">{event.name}</h1>

      {imageUrl && (
        <img src={imageUrl} alt={event.name} className="w-full h-96 object-cover rounded-lg mb-6" />
      )}

      <div className="mb-6 text-lg space-y-2">
        <p><strong>Date:</strong> {formattedDate}</p>
        {time && <p><strong>Time:</strong> {time}</p>}
        {venue && (
          <>
            <p><strong>Venue:</strong> {venue.name}</p>
            <p><strong>Address:</strong> {venue.address?.line1}, {venue.city?.name}, {venue.state?.name} {venue.postalCode}</p>
            {venue.location && (
              <p className="text-sm text-blue-500 hover:underline">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.location.latitude},${venue.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Artists / Attractions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {attractions.map((artist) => (
              <div key={artist.id} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-semibold">{artist.name}</p>
                {artist.externalLinks?.facebook && (
                  <p><a href={artist.externalLinks.facebook[0]?.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Facebook</a></p>
                )}
                {artist.externalLinks?.instagram && (
                  <p><a href={artist.externalLinks.instagram[0]?.url} target="_blank" rel="noreferrer" className="text-pink-500 hover:underline">Instagram</a></p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            🎟 Book Tickets
          </a>
        )}

        <button
          onClick={addToGoogleCalendar}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
        >
          📅 Add to Google Calendar
        </button>
      </div>
    </div>
  );
}

export default EventDetailsPage;
