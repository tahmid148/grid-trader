import React from 'react';
import { useState, useEffect } from 'react';

export default function App() {

  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch("/info")
      .then(res => res.json())
      .then(data => {
        setData(data)
        console.log(data)
      })
  }, [])


  return (
    <div>
    </div>
  );
}

