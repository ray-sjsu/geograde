"use client";

import Image from "next/image";
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username, email, password,
      });
      console.log('Response: ', response.data);
    }
    catch (error){
      console.error('Error: ', error.response.data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        temp register page for db testing

        <div>put username below</div>
        <input
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className = "text-black"
        />

      <div>put email below</div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className = "text-black"
          required 
        />

<div>put password below</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className = "text-black"
          required 
        />

        <button type = "submit">Submit here</button>

        
      </main>
    </div>
    </form>
    
  );
}
