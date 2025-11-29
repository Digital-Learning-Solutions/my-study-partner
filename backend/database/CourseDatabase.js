const CourseDatabase = [
  // ========== Existing 3 courses ==========
  {
    title: "Mastering Algebra Foundations",
    description:
      "A complete beginner to intermediate guide on algebraic concepts, equations, and problem solving.",
    courseType: "maths",
    enrollCount: 0,
    image : "https://miro.medium.com/v2/resize:fit:1200/1*W-lDuwtIpvoWzrHunlkwLg.png",
    ratings: [],
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
    courseType: "science",
    image: "https://tse1.mm.bing.net/th/id/OIP.SBWCFHQa0o9wrWby2F396wHaEK?pid=Api&P=0&h=180",
    enrollCount: 0,
    ratings: [],
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
    courseType: "social-science",
    image: "https://img.youtube.com/vi/3Xl0Qr0uXuY/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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

  // ========== Existing Maths (4 courses) ==========
  {
    title: "Trigonometry Made Easy",
    description:
      "Master trigonometric ratios, identities, and real-world applications.",
    courseType: "maths",
    image: "https://tse1.mm.bing.net/th/id/OIP.Au6p01qNcJL_ErvSgvwwoQHaEK?pid=Api&P=0&h=180",
    enrollCount: 0,
    ratings: [],
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
    courseType: "maths",
    image: "https://tse4.mm.bing.net/th/id/OIP.PUXUgTMSGZzNEVU0ouaPowAAAA?pid=Api&P=0&h=180",
    enrollCount: 0,
    ratings: [],
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
    courseType: "maths",
    image: "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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
    courseType: "maths",
    image: "https://tse4.mm.bing.net/th/id/OIP.t2gGQrtfMjs3ud3yg_1u7AHaDe?pid=Api&P=0&h=180",
    enrollCount: 0,
    ratings: [],
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

  // ========== Existing Science (3 courses) ==========
  {
    title: "Organic Chemistry Basics",
    description:
      "Introduction to carbon compounds, functional groups, and reactions.",
    courseType: "science",
    image: "https://tse1.mm.bing.net/th/id/OIP.xwwnP_66sMA5xOapmhbljwHaEK?pid=Api&P=0&h=180",
    enrollCount: 0,
    ratings: [],
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
    courseType: "science",
    image: "https://img.youtube.com/vi/UDsAokb1L0g/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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
    courseType: "science",
    image: "https://img.youtube.com/vi/1D4A0rK7IbY/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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

  // ========== Existing Social-Science (3 courses) ==========
  {
    title: "Modern World History",
    description: "Study revolutions, world wars, and global historical events.",
    courseType: "social-science",
    image: "https://img.youtube.com/vi/Jl4M2rW_kC0/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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
    courseType: "social-science",
    image: "https://img.youtube.com/vi/Eq8LrJpAd6A/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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
    courseType: "social-science",
    image: "https://img.youtube.com/vi/3q1ex0W9TS8/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
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

  // =========================================================
  // ========== NEW COURSES (15 total) =======================
  // =========================================================

  // ======= 5 Computer Science Courses =======
  {
    title: "Introduction to Python Programming",
    description:
      "A project-based introduction to Python fundamentals, syntax, and basic libraries.",
    courseType: "computer-science",
    image: "https://img.youtube.com/vi/fWjsdhR3z3c/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Python Setup and Basics",
        content: "Installing Python and understanding core data types.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Python Basics: Variables & Data Types",
            duration: 10,
            videoUrl: "http://www.youtube.com/watch?v=fWjsdhR3z3c",
          },
        ],
      },
      {
        id: 2,
        title: "Control Flow",
        content: "Mastering conditional statements and loops.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "If/Else Statements and For Loops",
            duration: 14,
            videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Web Development Fundamentals",
    description:
      "Build your first websites using the core technologies: HTML, CSS, and JavaScript.",
    courseType: "computer-science",
    image: "https://img.youtube.com/vi/MBlkKE0GYGg/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "HTML and CSS Essentials",
        content: "Structuring content with HTML and styling with CSS.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Intro to HTML & CSS",
            duration: 15,
            videoUrl: "http://www.youtube.com/watch?v=MBlkKE0GYGg",
          },
        ],
      },
      {
        id: 2,
        title: "JavaScript Basics",
        content: "Adding interactivity and logic with vanilla JavaScript.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Variables and Functions in JS",
            duration: 18,
            videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFsGs", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Data Structures & Algorithms (DSA)",
    description:
      "Essential course for mastering data organization and efficient problem-solving.",
    courseType: "computer-science",
    image: "https://img.youtube.com/vi/O9v10jQkm5c/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Linear Data Structures",
        content: "A deep dive into Arrays, Linked Lists, Stacks, and Queues.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Arrays and Linked Lists Explained",
            duration: 15,
            videoUrl: "http://www.youtube.com/watch?v=O9v10jQkm5c",
          },
        ],
      },
      {
        id: 2,
        title: "Searching and Sorting",
        content: "Introduction to common search and sort algorithms.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Bubble Sort and Binary Search",
            duration: 17,
            videoUrl: "https://www.youtube.com/watch?v=KgJ35PzD14Y", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Foundations of AI and Machine Learning",
    description:
      "A conceptual overview of Artificial Intelligence and its core subset, Machine Learning.",
    courseType: "computer-science",
    image: "https://img.youtube.com/vi/qYNweeDHiyU/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Core AI Concepts",
        content: "Defining AI, ML, and Deep Learning.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "AI vs. ML Explained",
            duration: 10,
            videoUrl: "http://www.youtube.com/watch?v=qYNweeDHiyU",
          },
        ],
      },
      {
        id: 2,
        title: "Supervised Learning",
        content: "Understanding regression and classification algorithms.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Linear Regression Intro",
            duration: 13,
            videoUrl: "https://www.youtube.com/watch?v=TzI0n0J938M", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Database Management with SQL",
    description:
      "Learn to design, manage, and query relational databases using Structured Query Language (SQL).",
    courseType: "computer-science",
    image: "https://img.youtube.com/vi/kbKty5ZVKMY/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Relational Database Concepts",
        content: "Tables, columns, rows, and primary/foreign keys.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Basic SQL Queries (SELECT, FROM)",
            duration: 17,
            videoUrl: "http://www.youtube.com/watch?v=kbKty5ZVKMY",
          },
        ],
      },
      {
        id: 2,
        title: "Advanced Queries",
        content: "Joins, aggregations, and subqueries.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Understanding SQL JOINs",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=kYjY-WjK94E", // Placeholder for a second class
          },
        ],
      },
    ],
  },

  // ======= 5 English Courses =======
  {
    title: "English Grammar Mastery",
    description:
      "A complete guide to mastering English grammar rules, punctuation, and sentence construction for flawless communication.",
    courseType: "english",
    image: "https://img.youtube.com/vi/UJMZwjzxuqM/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Foundational Grammar",
        content: "Parts of speech, verb tenses, and sentence structure.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Parts of Speech and Sentence Structure",
            duration: 15,
            videoUrl: "http://www.youtube.com/watch?v=UJMZwjzxuqM",
          },
        ],
      },
      {
        id: 2,
        title: "Advanced Punctuation & Usage",
        content: "Using commas, semicolons, and avoiding common errors.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Punctuation Rules Made Easy",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=wX-83yFfBfQ", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Creative Writing Fundamentals",
    description:
      "Learn the core techniques of crafting compelling fiction and non-fiction, focusing on plot, character, and dialogue.",
    courseType: "english",
    image: "https://img.youtube.com/vi/pRBhZpdnAa8/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Elements of Storytelling",
        content: "Developing plot, setting, and theme.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Story Structure and Character Development",
            duration: 18,
            videoUrl: "http://www.youtube.com/watch?v=pRBhZpdnAa8",
          },
        ],
      },
      {
        id: 2,
        title: "Writing Styles and Techniques",
        content:
          "Mastering descriptive writing and crafting compelling dialogue.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Writing Descriptive Sentences",
            duration: 10,
            videoUrl: "https://www.youtube.com/watch?v=RSoRzTtwgP4", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Public Speaking and Presentation Skills",
    description:
      "Overcome stage fright and deliver confident, impactful presentations to any audience.",
    courseType: "english",
    image: "https://img.youtube.com/vi/962eYqe--Yc/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Managing Anxiety and Confidence",
        content:
          "Techniques for overcoming fear and building speaking presence.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "4 Tips to Captivate an Audience",
            duration: 12,
            videoUrl: "http://www.youtube.com/watch?v=962eYqe--Yc",
          },
        ],
      },
      {
        id: 2,
        title: "Structuring Your Speech",
        content: "The effective use of opening, body, and closing techniques.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "The 3-Part Speech Structure",
            duration: 15,
            videoUrl: "https://www.youtube.com/watch?v=5m-C5mwpmxU", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Essential IELTS Preparation",
    description:
      "Comprehensive training for the International English Language Testing System (IELTS) exam, covering all four modules.",
    courseType: "english",
    image: "https://img.youtube.com/vi/apOCnYpR-9g/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "IELTS Reading and Listening",
        content: "Strategies for improving comprehension and score.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Band 9 Reading Strategy",
            duration: 10,
            videoUrl: "http://www.youtube.com/watch?v=apOCnYpR-9g",
          },
        ],
      },
      {
        id: 2,
        title: "IELTS Writing and Speaking",
        content: "Tips for task achievement and fluency.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Writing Task 2 Structure",
            duration: 13,
            videoUrl: "https://www.youtube.com/watch?v=G8Y2liwGRl8", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Introduction to Classic English Literature",
    description:
      "Explore the masterpieces of English literature from Shakespeare to the modern era, focusing on historical context and literary devices.",
    courseType: "english",
    image: "https://img.youtube.com/vi/eIrnRa8tH1Q/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Medieval to Romantic Era",
        content: "Key authors and movements from Chaucer to the Romantics.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Beginner's Guide to Reading The Classics",
            duration: 9,
            videoUrl: "http://www.youtube.com/watch?v=eIrnRa8tH1Q",
          },
        ],
      },
      {
        id: 2,
        title: "Victorian and Modernism",
        content: "Analyzing works by Dickens, Woolf, and other modernists.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Where to Start with Classics",
            duration: 11,
            videoUrl: "https://www.youtube.com/watch?v=RqRLC4vnJEc", // Placeholder for a second class
          },
        ],
      },
    ],
  },

  // ======= 5 Share Market Courses =======
  {
    title: "Stock Market Investing for Beginners",
    description:
      "A zero-to-hero guide on how to open a brokerage account, buy your first stock, and manage risk.",
    courseType: "share-market",
    image: "https://img.youtube.com/vi/dbDijzEgo7E/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Getting Started",
        content: "What is a stock market and how to buy shares.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "How to Invest in Stocks for Beginners",
            duration: 8,
            videoUrl: "http://www.youtube.com/watch?v=dbDijzEgo7E",
          },
        ],
      },
      {
        id: 2,
        title: "Risk Management",
        content: "Understanding diversification and setting stop-losses.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "The Importance of Diversification",
            duration: 10,
            videoUrl: "https://www.youtube.com/watch?v=7uK7K7f7Y5s", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Technical Analysis 101",
    description:
      "Master the art of reading price charts, candlestick patterns, and technical indicators to time your trades.",
    courseType: "share-market",
    image: "https://img.youtube.com/vi/eynxyoKgpng/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Chart Basics and Candlesticks",
        content: "Reading stock charts and identifying patterns.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Introduction to Candlestick Charts",
            duration: 15,
            videoUrl: "http://www.youtube.com/watch?v=eynxyoKgpng",
          },
        ],
      },
      {
        id: 2,
        title: "Support, Resistance, and Indicators",
        content: "Using moving averages and volume for trend confirmation.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Using Moving Averages",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=Yv2iYYewdf0", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Fundamental Analysis Deep Dive",
    description:
      "Learn to assess the intrinsic value of a company by analyzing its financial statements and business model.",
    courseType: "share-market",
    image: "https://img.youtube.com/vi/3BOE1A8HXeE/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Financial Statement Analysis",
        content:
          "Understanding the Balance Sheet, Income Statement, and Cash Flow.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Understanding Financial Statements",
            duration: 5,
            videoUrl: "http://www.youtube.com/watch?v=3BOE1A8HXeE",
          },
        ],
      },
      {
        id: 2,
        title: "Valuation Metrics",
        content: "Key ratios like P/E, P/B, and Dividend Yield.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Calculating P/E Ratio",
            duration: 10,
            videoUrl: "https://www.youtube.com/watch?v=kXYvRR7gV2E", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Options Trading Basics",
    description:
      "An introduction to the derivatives market, focusing on how call and put options work.",
    courseType: "share-market",
    image: "https://img.youtube.com/vi/XV9avMhNL2Y/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "What are Options?",
        content: "Definitions, terminology, and key concepts.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Calls and Puts Explained",
            duration: 9,
            videoUrl: "http://www.youtube.com/watch?v=XV9avMhNL2Y",
          },
        ],
      },
      {
        id: 2,
        title: "Basic Strategies",
        content: "Long call and long put strategies for beginners.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Buying Calls and Puts",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=4HMm6mBvGKE", // Placeholder for a second class
          },
        ],
      },
    ],
  },
  {
    title: "Portfolio Management Strategies",
    description:
      "Learn how to construct a balanced investment portfolio that aligns with your financial goals and risk tolerance.",
    courseType: "share-market",
    image: "https://img.youtube.com/vi/eJmt9sqDFNc/maxresdefault.jpg",
    enrollCount: 0,
    ratings: [],
    moduleCount: 2,
    modules: [
      {
        id: 1,
        title: "Portfolio Construction",
        content:
          "Asset allocation and the role of different investment vehicles.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "Most Popular Investment Strategies",
            duration: 14,
            videoUrl: "http://www.youtube.com/watch?v=eJmt9sqDFNc",
          },
        ],
      },
      {
        id: 2,
        title: "Rebalancing and Review",
        content: "When and how to adjust your portfolio over time.",
        classCount: 1,
        classes: [
          {
            id: 1,
            title: "The Simple 3 Fund Portfolio",
            duration: 12,
            videoUrl: "https://www.youtube.com/watch?v=R0rEZYA01lM", // Placeholder for a second class
          },
        ],
      },
    ],
  },
];

export default CourseDatabase;
