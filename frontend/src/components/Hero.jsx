import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center pt-10"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-sky-600 dark:text-sky-400">
        What you want to learn
      </h1>
      <SearchBar/>
    </motion.div>
  );
}
