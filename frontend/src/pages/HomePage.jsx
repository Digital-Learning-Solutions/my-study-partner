// src/pages/HomePage.jsx

import { useState, useEffect, useRef } from 'react';
import bg1 from '../assets/canvas.jpg'; // Make sure these paths are correct
import bg2 from '../assets/bg.jpg';

const sponsors = [
  'Atlassian', 'Dropbox', 'Duolingo', 'GitHub',
  'Microsoft', 'Netflix', 'The New York Times', 'Pearson',
];

function HomePage() {
  const images = [bg1, bg2];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, images.length]);

  return (
    <>
      <main className="flex flex-col items-center justify-center text-[#222] bg-white/10 rounded-3xl mt-10 max-w-[700px] mx-auto p-12 pt-12 pb-8 shadow-[0_4px_32px_rgba(100,108,255,0.08)]">
        <h1 className="text-[2.2rem] font-bold mb-4 text-[#2a2a44]">Welcome to the AI Driven Personalized Student Learning Platform</h1>
        <p className="text-[1.18rem] text-[#333] mb-0">
          Empower your learning journey with personalized courses, interactive quizzes, and engaging discussions. Our platform leverages AI to adapt to your unique needs and help you achieve your academic goals.
        </p>
      </main>

      <div
        className="relative w-[600px] max-w-[90vw] mx-auto my-8 rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(100,108,255,0.13)] transition-transform duration-100 cursor-pointer hover:scale-110 z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          className="absolute top-1/2 left-1 -translate-y-1/2 bg-opacity-70 text-white border-none rounded-full w-20 h-80 text-xl cursor-pointer z-20 transition hover:bg-[#646cff] hover:opacity-100 shadow opacity-80"
          onClick={() => setCurrent((current - 1 + images.length) % images.length)}
          aria-label="Previous image"
        >&#8592;</button>
        <img
          src={images[current]}
          alt="slider"
          className="w-full h-80 object-cover block transition-filter duration-300"
        />
        <button
          className="absolute top-1/2 right-1 -translate-y-1/2 bg-opacity-70 text-white border-none rounded-full w-20 h-80 text-xl cursor-pointer z-20 transition hover:bg-[#646cff] hover:opacity-100 shadow opacity-80"
          onClick={() => setCurrent((current + 1) % images.length)}
          aria-label="Next image"
        >&#8594;</button>
        <div className="flex justify-center gap-2 mt-2 absolute bottom-0 left-1/2 -translate-x-1/2 z-30">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full bg-[#646cff] cursor-pointer transition-all duration-200 ${current === idx ? 'scale-125 shadow-lg' : 'bg-opacity-40'}`}
              onClick={() => setCurrent(idx)}
            >
              &bull;
            </span>
          ))}
        </div>
      </div>

      <section className="max-w-[700px] mx-auto mt-8 p-8 pt-8 pb-4 bg-white/95 rounded-2xl shadow-[0_2px_16px_rgba(100,108,255,0.07)] text-center">
        <h2 className="text-2xl text-[#2a2a44] mb-3">Courses</h2>
        <p className="text-[1.1rem] text-[#444] mb-2">Explore a wide range of AI-powered courses tailored to your learning needs.</p>
        <p className="text-[1.1rem] text-[#444] mb-2">Each course adapts to your progress, helping you master concepts efficiently and effectively.</p>
      </section>

      <div className="w-full overflow-hidden bg-white border-y border-[#eee] my-0 mb-8 py-1.5">
        <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-20">
          {sponsors.concat(sponsors).map((name, idx) => (
            <span className="text-[1.2rem] font-bold text-[#222] opacity-85 tracking-wider whitespace-nowrap font-sans" key={idx}>{name}</span>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;



























// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Home(){
//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Welcome — Solo or with friends</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="p-6 bg-white rounded shadow">
//           <h2 className="text-xl font-semibold">Play Solo</h2>
//           <p className="mt-2 text-sm">Generate a quick quiz from interests or upload notes.</p>
//           <Link to="/solo" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Play Solo</Link>
//         </div>
//         <div className="p-6 bg-white rounded shadow">
//           <h2 className="text-xl font-semibold">Play with Friends</h2>
//           <p className="mt-2 text-sm">Create a private room and invite friends with a code.</p>
//           <Link to="/multiplayer" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded">Create / Join</Link>
//         </div>
//       </div>
//     </div>
//   )
// }