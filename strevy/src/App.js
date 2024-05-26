import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = "https://mango-api-helguind.csclub.cloud";

function App() {

  const [data, setData] = useState(null);

  useEffect(()=> {
    fetch(`${BASE_URL}/hevy/workouts`)
      .then(response => response.json())
      .then(json =>setData(json))
      .catch(error=>console.error(error));
  },
  []);

  return (
    <div className="App">
      <header className="App-header">
        Personal fitness tracker
      </header>
      <div>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
      </div>
    </div>
  );
}

export default App;
