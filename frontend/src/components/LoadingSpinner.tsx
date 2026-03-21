import { motion } from "framer-motion";

export const LoadingSpinner = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <motion.div
      className="h-12 w-12 rounded-full border-4 border-muted border-t-primary"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  </div>
);
