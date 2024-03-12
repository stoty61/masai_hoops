import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/time') // This will be proxied to http://localhost:5000/time
      .then(response => response.json())
      .then(data => {
        setCurrentTime(data.time); // Assuming your backend returns an object with a 'time' property
      })
      .catch(error => {
        console.error('Error fetching time:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">

        {/* No changes in this part */}

        {error ? (
          <p>Error: {error}</p>
        ) : (
          <p>The current time is {currentTime}.</p>
        )}
      </header>
    </div>
  );
}

export default App;
