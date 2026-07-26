import { motion } from "framer-motion";

const Status = () => {
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
      <motion.div
        className="h-2 w-2 rounded-full bg-primary"
        animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="text-xs font-medium text-primary dark:text-primary-300">
        Hire me
      </span>
    </div>
  );
};

export default Status;
