import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Evently!</h1>

      {/* FIND EVENTS BUTTON */}
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        onClick={() => navigate('/find-events')}
      >
        Find Events
      </button>
      <button onClick={() => navigate('/my-events')}>My Events</button>
      <button onClick={() => navigate('/upcoming-events')}>Upcoming Events</button>


      {/* Other dashboard content can go below */}
    </div>
  );
}

export default Dashboard;
