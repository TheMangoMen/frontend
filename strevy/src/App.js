import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [data, setData] = useState(null);

  useEffect(()=> {
    fetch('https://api.coincap.io/v2/assets')
      .then(response => response.json())
      .then(json =>setData(json))
      .catch(error=>console.error(error));
  },
  []);

  return (
    <div className="App">
      <header className="App-header">
        Personal finances tracker
        <p>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
        </p>
        
      </header>
    </div>
  );
}

export default App;
