const Course = [
  {
    id: 1,
    title: "Mastering Algebra Foundations",
    description:
      "A complete beginner to intermediate guide on algebraic concepts, equations, and problem solving.",
    courceType: "maths",
    image: "https://img.youtube.com/vi/f9KqSgS1C1I/maxresdefault.jpg",
    enrollCount: 1280,
    rating: 4.6,
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
    id: 2,
    title: "Exploring the World of Physics",
    description:
      "Dive into fundamental physics concepts that explain how the universe works.",
    courceType: "science",
    image: "https://img.youtube.com/vi/2uVZ2T_S6x0/maxresdefault.jpg",
    enrollCount: 980,
    rating: 4.8,
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
    id: 3,
    title: "Understanding Human Civilization",
    description:
      "Explore ancient civilizations, their cultures, and contributions to modern society.",
    courceType: "social-science",
    image: "https://img.youtube.com/vi/3Xl0Qr0uXuY/maxresdefault.jpg",
    enrollCount: 760,
    rating: 4.4,
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
];

export default Course;
