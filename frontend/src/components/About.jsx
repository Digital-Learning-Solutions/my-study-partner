import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mt-20 px-6 pb-20 max-w-4xl mx-auto text-center"
    >
      <h2 className="text-2xl font-semibold mb-4">About Us</h2>
      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        We are committed to providing high-quality courses that empower learners
        worldwide. Our platform offers interactive modules, expert instructors,
        and engaging content to make learning effective and enjoyable.
      </p>
    </motion.div>
  );
}
