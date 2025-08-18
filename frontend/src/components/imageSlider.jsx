import React, { useState, useEffect, useRef } from 'react';

// This is a self-contained, reusable component.
// It takes a list of 'images' as a prop.
function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    // This logic starts the automatic sliding effect
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
    }
    // This cleans up the interval when the component is unmounted or paused
    return () => clearInterval(intervalRef.current);
  }, [paused, images.length]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 cursor-pointer hover:scale-105"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        src={images[current]}
        alt="slider"
        className="w-full h-48 object-cover block" // Reduced height for the smaller slider
      />
      
      {/* Slider Controls */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white border-none rounded-full w-8 h-8 flex items-center justify-center text-xl cursor-pointer z-20 transition hover:bg-black/60"
        onClick={() => setCurrent((current - 1 + images.length) % images.length)}
        aria-label="Previous image"
      >
        &#8592;
      </button>
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white border-none rounded-full w-8 h-8 flex items-center justify-center text-xl cursor-pointer z-20 transition hover:bg-black/60"
        onClick={() => setCurrent((current + 1) % images.length)}
        aria-label="Next image"
      >
        &#8594;
      </button>

      {/* Slider Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full bg-white transition-all duration-200 ${current === idx ? 'opacity-100 scale-125' : 'opacity-50'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;