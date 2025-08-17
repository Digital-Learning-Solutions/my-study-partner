
import { useState, useEffect, useRef } from 'react';
import bg1 from './assets/canvas.jpg';
import bg2 from './assets/bg.jpg';
import reactLogo from './assets/react.svg';

const sponsors = [
  'Atlassian',
  'Dropbox',
  'Duolingo',
  'GitHub',
  'Microsoft',
  'Netflix',
  'The New York Times',
  'Pearson',
];

function App() {
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
      {/* Header */}
      <div className=" top-0 left-0 w-[100vw] h-16 bg-white/25 backdrop-blur-[16px] saturate-[180%] border-b border-[#c8c8ff2e] shadow-[0_4px_24px_0_rgba(80,80,180,0.08)] flex items-center justify-between z-[1000] px-8">
        <div className="flex items-center">
          <img src={reactLogo} alt="Logo" className="h-11 mr-4 rounded-xl shadow-[0_2px_8px_rgba(100,108,255,0.10)]" />
        </div>
        <div className="flex gap-6">
          <button className="bg-white/35 border border-[#646cff22] text-base text-[#2a2a44] font-medium cursor-pointer py-2 px-6 rounded-lg transition hover:bg-[#646cff1a] hover:shadow-[0_2px_8px_rgba(100,108,255,0.13)] mx-0.5">Courses</button>
          <button className="bg-white/35 border border-[#646cff22] text-base text-[#2a2a44] font-medium cursor-pointer py-2 px-6 rounded-lg transition hover:bg-[#646cff1a] hover:shadow-[0_2px_8px_rgba(100,108,255,0.13)] mx-0.5">Quiz</button>
          <button className="bg-white/35 border border-[#646cff22] text-base text-[#2a2a44] font-medium cursor-pointer py-2 px-6 rounded-lg transition hover:bg-[#646cff1a] hover:shadow-[0_2px_8px_rgba(100,108,255,0.13)] mx-0.5">Discussions</button>
        </div>
        <div>
          <button className="bg-[#646cff] text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#4b4be7] transition">Sign In</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-[#222] text-shadow-lg bg-white/10 rounded-3xl mt-10 max-w-[700px] mx-auto p-12 pt-12 pb-8 shadow-[0_4px_32px_rgba(100,108,255,0.08)]">
        <h1 className="text-[2.2rem] font-bold mb-4 text-[#2a2a44]">Welcome to the AI Driven Personalized Student Learning Platform</h1>
        <p className="text-[1.18rem] text-[#333] mb-0">
          Empower your learning journey with personalized courses, interactive quizzes, and engaging discussions. Our platform leverages AI to adapt to your unique needs and help you achieve your academic goals.
        </p>
      </main>

      {/* Image Slider */}
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

      {/* Courses Section */}
      <section className="max-w-[700px] mx-auto mt-8 p-8 pt-8 pb-4 bg-white/95 rounded-2xl shadow-[0_2px_16px_rgba(100,108,255,0.07)] text-center">
        <h2 className="text-2xl text-[#2a2a44] mb-3">Courses</h2>
        <p className="text-[1.1rem] text-[#444] mb-2">Explore a wide range of AI-powered courses tailored to your learning needs.</p>
        <p className="text-[1.1rem] text-[#444] mb-2">Each course adapts to your progress, helping you master concepts efficiently and effectively.</p>
      </section>

      {/* Sponsors Marquee */}
      <div className="w-full overflow-hidden bg-white border-y border-[#eee] my-0 mb-8 py-1.5">
        <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-20">
          {sponsors.concat(sponsors).map((name, idx) => (
            <span className="text-[1.2rem] font-bold text-[#222] opacity-85 tracking-wider whitespace-nowrap font-sans" key={idx}>{name}</span>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#141622fa] text-[#e6e6f0] border-t-2 border-[#646cff22] shadow-[0_-2px_16px_0_rgba(80,80,180,0.08)] relative bottom-0 left-0 z-[100]">
      <div className="flex flex-wrap justify-between items-center max-w-[1200px] mx-auto py-6 px-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[1.2rem] font-bold text-[#646cff] tracking-wider">AI Learning</span>
          <span className="text-[0.95rem] text-[#b0b0c3]">© {new Date().getFullYear()} AI Driven Personalized Student Learning Platform</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-[#e6e6f0] no-underline text-base font-medium hover:text-[#646cff] transition">About</a>
          <a href="#" className="text-[#e6e6f0] no-underline text-base font-medium hover:text-[#646cff] transition">Contact</a>
          <a href="#" className="text-[#e6e6f0] no-underline text-base font-medium hover:text-[#646cff] transition">Careers</a>
        </div>
        <div className="flex gap-3">
          <a href="#" className="text-2xl hover:text-[#646cff] transition">🌐</a>
          <a href="#" className="text-2xl hover:text-[#646cff] transition">🐦</a>
          <a href="#" className="text-2xl hover:text-[#646cff] transition">💼</a>
        </div>
      </div>
    </footer>
  );
}
export default App;
