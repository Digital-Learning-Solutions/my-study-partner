const CourseDatabase = [
  // ========== Existing 3 courses ==========
  {
    title: "Mastering Algebra Foundations",
    description:
      "A complete beginner to intermediate guide on algebraic concepts, equations, and problem solving.",
    courceType: "maths",
    image: "https://img.youtube.com/vi/f9KqSgS1C1I/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 3,
    modules: [
      {
        id: 1,
        title: "Introduction to Algebra",
        content:
          "Covers basic concepts like variables, constants, and expressions.",
        classCount: 2,
        classes: [
          {
            id: 1,
            title: "What is Algebra?",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=QnQe0xW_JY4",
          },
          {
            id: 2,
            title: "Variables and Constants",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=7sGv1Up6cV0",
          },
        ],
      },
      {
        id: 2,
        title: "Linear Equations",
        content: "Learn one-variable and two-variable equations with examples.",
        classCount: 2,
        classes: [
          {
            id: 1,
            title: "Solving Linear Equations",
            duration: 18,
            videoUrl: "https://www.youtube.com/watch?v=Uy7G8YHjYcE",
          },
          {
            id: 2,
            title: "Word Problems in Linear Equations",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=5f0yP2YrLcc",
          },
        ],
      },
      {
        id: 3,
        title: "Quadratic Equations",
        content: "Understanding quadratic equations, factorization, and roots.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Introduction to Quadratic Equations",
            duration: 20,
            videoUrl: "https://www.youtube.com/watch?v=4EXNedimDMs",
          },
        ],
      },
    ],
  },
  {
    title: "Exploring the World of Physics",
    description:
      "Dive into fundamental physics concepts that explain how the universe works.",
    courceType: "science",
    image: "https://img.youtube.com/vi/2uVZ2T_S6x0/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Laws of Motion",
        content:
          "Understand Newton's three laws and their real-life applications.",
        classCount: 2,
        classes: [
          {
            id: 1,
            title: "Newton's First Law",
            duration: 10,
            videoUrl: "https://www.youtube.com/watch?v=KUaE7sToSBU",
          },
          {
            id: 2,
            title: "Newton's Second Law",
            duration: 13,
            videoUrl: "https://www.youtube.com/watch?v=JGO_zDWmkvk",
          },
        ],
      },
      {
        id: 2,
        title: "Energy and Work",
        content:
          "Learn about kinetic energy, potential energy, and work-energy theorem.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Energy and Its Forms",
            duration: 16,
            videoUrl: "https://www.youtube.com/watch?v=fsQz7nd7xg4",
          },
        ],
      },
    ],
  },
  {
    title: "Understanding Human Civilization",
    description:
      "Explore ancient civilizations, their cultures, and contributions to modern society.",
    courceType: "social-science",
    image: "https://img.youtube.com/vi/3Xl0Qr0uXuY/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 3,
    modules: [
      {
        id: 1,
        title: "The Dawn of Civilization",
        content: "Covers Mesopotamia, Egypt, and Indus Valley civilizations.",
        classCount: 2,
        classes: [
          {
            id: 1,
            title: "Mesopotamia - The Cradle of Civilization",
            duration: 11,
            videoUrl: "https://www.youtube.com/watch?v=sohXPx_XZ6Y",
          },
          {
            id: 2,
            title: "The Indus Valley Civilization",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=1In9KZ5r7nE",
          },
        ],
      },
      {
        id: 2,
        title: "The Rise of Empires",
        content: "Learn about Greek, Roman, and Mauryan empires.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "The Roman Empire Explained",
            duration: 19,
            videoUrl: "https://www.youtube.com/watch?v=oPf27gAup9U",
          },
        ],
      },
      {
        id: 3,
        title: "Modern Civilization",
        content: "Industrial revolution and technological advancement.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Industrial Revolution Overview",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=zhL5DCizj5c",
          },
        ],
      },
    ],
  },

  // ========== New 10 Courses ==========
  // ======= 4 Maths =======
  {
    title: "Trigonometry Made Easy",
    description:
      "Master trigonometric ratios, identities, and real-world applications.",
    courceType: "maths",
    image: "https://img.youtube.com/vi/uq7S9w5jKyc/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Trigonometry Basics",
        content: "Learn angles, sine, cosine, and tangent.",
        classCount: 2,
        classes: [
          {
            id: 1,
            title: "Understanding Angles",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=8H3dCdg1z9I",
          },
          {
            id: 2,
            title: "Sine, Cosine, Tangent",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=3d6DsjIBzJ4",
          },
        ],
      },
      {
        id: 2,
        title: "Trigonometric Identities",
        content: "Master Pythagorean, reciprocal, and quotient identities.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Key Trigonometric Identities",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=FL0XgG4U2nI",
          },
        ],
      },
    ],
  },
  {
    title: "Geometry for Beginners",
    description:
      "Learn shapes, theorems, coordinate geometry, and problem-solving techniques.",
    courceType: "maths",
    image: "https://img.youtube.com/vi/ZT7U6C3D5oY/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Basic Geometry",
        content: "Learn triangles, circles, and polygons.",
        classCount: 2,
        classes: [
          {
            id: 1,
            title: "Triangles and Circles",
            duration: 16,
            videoUrl: "https://www.youtube.com/watch?v=FTtV6xVbF3Y",
          },
          {
            id: 2,
            title: "Polygons Explained",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=xJDrKxI5z8E",
          },
        ],
      },
      {
        id: 2,
        title: "Coordinate Geometry",
        content: "Introduction to points, slopes, distance, and midpoints.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Coordinate Plane Basics",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=3CqfYDfYfY4",
          },
        ],
      },
    ],
  },
  {
    title: "Introduction to Calculus",
    description:
      "Basics of limits, derivatives, and integration for beginners.",
    courceType: "maths",
    image: "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Limits and Continuity",
        content: "Understand limits, continuity, and their applications.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Limits Made Simple",
            duration: 18,
            videoUrl: "https://www.youtube.com/watch?v=1NA0Eyh5r3Y",
          },
        ],
      },
      {
        id: 2,
        title: "Derivatives & Integrals",
        content: "Learn basic differentiation and integration.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Derivative Basics",
            duration: 16,
            videoUrl: "https://www.youtube.com/watch?v=Z5I2dDbrTQ0",
          },
        ],
      },
    ],
  },
  {
    title: "Probability & Statistics",
    description: "Learn basic probability concepts and descriptive statistics.",
    courceType: "maths",
    image: "https://img.youtube.com/vi/k6U-i4gXkLM/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Probability Basics",
        content: "Simple probability, events, and outcomes.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Understanding Probability",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=UZ4aLzRjxhI",
          },
        ],
      },
      {
        id: 2,
        title: "Descriptive Statistics",
        content: "Mean, median, mode, and standard deviation.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Statistics Essentials",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=Vfo5le26IhY",
          },
        ],
      },
    ],
  },

  // ======= 3 Science =======
  {
    title: "Organic Chemistry Basics",
    description:
      "Introduction to carbon compounds, functional groups, and reactions.",
    courceType: "science",
    image: "https://img.youtube.com/vi/3eqE_JXlAdI/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Carbon Compounds",
        content: "Learn alkanes, alkenes, and alkynes.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Introduction to Organic Chemistry",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=LHHK0gPDe9k",
          },
        ],
      },
      {
        id: 2,
        title: "Functional Groups",
        content: "Alcohols, ketones, aldehydes, and more.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Understanding Functional Groups",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=6Jqg9Jm9lSU",
          },
        ],
      },
    ],
  },
  {
    title: "Human Anatomy & Physiology",
    description:
      "Explore human body systems, organs, and their functions in detail.",
    courceType: "science",
    image: "https://img.youtube.com/vi/UDsAokb1L0g/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Skeletal & Muscular System",
        content: "Learn bones, muscles, and movement.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Skeleton Overview",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=vjNd8lckgQQ",
          },
        ],
      },
      {
        id: 2,
        title: "Circulatory & Respiratory System",
        content: "Understand blood flow, heart, lungs, and breathing.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Circulation & Respiration",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=7hTq9qfHqG8",
          },
        ],
      },
    ],
  },
  {
    title: "Introduction to Astronomy",
    description:
      "Explore stars, planets, galaxies, and the universe beyond Earth.",
    courceType: "science",
    image: "https://img.youtube.com/vi/1D4A0rK7IbY/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Solar System",
        content: "Learn about planets, moons, and orbits.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Planets Overview",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=libKVRa01L8",
          },
        ],
      },
      {
        id: 2,
        title: "Stars and Galaxies",
        content: "Understand stars, constellations, and galaxies.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Stars and Constellations",
            duration: 16,
            videoUrl: "https://www.youtube.com/watch?v=0W5QzC1rG0E",
          },
        ],
      },
    ],
  },

  // ======= 3 Social-Science =======
  {
    title: "Modern World History",
    description: "Study revolutions, world wars, and global historical events.",
    courceType: "social-science",
    image: "https://img.youtube.com/vi/Jl4M2rW_kC0/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Industrial Revolution",
        content: "Impact on society, economy, and technology.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Industrial Revolution Overview",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=zhL5DCizj5c",
          },
        ],
      },
      {
        id: 2,
        title: "World Wars",
        content: "Learn causes and outcomes of WWI and WWII.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "WWI & WWII Summary",
            duration: 18,
            videoUrl: "https://www.youtube.com/watch?v=1byU1IbG3M0",
          },
        ],
      },
    ],
  },
  {
    title: "Indian Political System",
    description:
      "Understand Constitution, Parliament, and governance in India.",
    courceType: "social-science",
    image: "https://img.youtube.com/vi/Eq8LrJpAd6A/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Indian Constitution",
        content: "Fundamental rights and duties explained.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Rights & Duties",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=FJUpkgx1Lk0",
          },
        ],
      },
      {
        id: 2,
        title: "Parliament and Governance",
        content: "Learn about Lok Sabha, Rajya Sabha, and central government.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Indian Parliament Overview",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=cq6KJu-UB2Y",
          },
        ],
      },
    ],
  },
  {
    title: "Global Geography",
    description:
      "Learn continents, countries, climates, and major landforms worldwide.",
    courceType: "social-science",
    image: "https://img.youtube.com/vi/3q1ex0W9TS8/maxresdefault.jpg",
    enrollCount: 0,
    rating: 0,
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Continents & Countries",
        content: "Overview of world geography and continents.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "World Geography Basics",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=Q7IdkA6H2mM",
          },
        ],
      },
      {
        id: 2,
        title: "Landforms and Climate",
        content: "Mountains, rivers, deserts, and climate zones explained.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Landforms & Climate Overview",
            duration: 16,
            videoUrl: "https://www.youtube.com/watch?v=F0x7c7e-S2M",
          },
        ],
      },
    ],
  },
];

export default CourseDatabase;
