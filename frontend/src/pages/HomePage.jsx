import React from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/imageSlider';// Import the new component
import bg1 from '../assets/canvas.jpg'; // Ensure paths are correct
import bg2 from '../assets/bg.jpg';

const sponsors = [
  'Atlassian', 'Dropbox', 'Duolingo', 'GitHub',
  'Microsoft', 'Netflix', 'The New York Times', 'Pearson',
];

function HomePage() {
  // Define the images to be used in the sliders
  const sliderImages = [bg1, bg2];

  return (
    <div>
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your AI-Powered Learning Partner
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
          Our platform adapts to your unique learning style, providing customized quizzes, real-time feedback, and a path to academic success.
        </p>
        <div className="mt-8">
          <Link to="/register" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Get Started for Free
          </Link>
        </div>
      </div>

      {/* NEW: Three Image Sliders in a responsive grid */}
      <div className="container mx-auto px-6 my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ImageSlider images={sliderImages} />
          <ImageSlider images={sliderImages} />
          <ImageSlider images={sliderImages} />
        </div>
      </div>

      {/* Retained Sponsors Marquee */}
      <div className="w-full overflow-hidden bg-black/20 backdrop-blur-md py-4 my-12 border-y border-slate-200/20">
        <div className="flex w-max animate-marquee gap-16 md:gap-20">
          {sponsors.concat(sponsors).map((name, idx) => (
            <span className="text-lg font-semibold text-slate-200 tracking-wider whitespace-nowrap" key={idx}>{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;