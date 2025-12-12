import logo from "@/assets/fimanage-logo.jpg";
import { motion } from "framer-motion";

const LoadingBig = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="h-full w-full z-50 flex flex-col items-center justify-center overflow-hidden"
  >
    <div className="relative w-24 h-24 mb-4 p-2">
      <div className="absolute inset-0 rounded-full bg-primary"></div>

      <img
        src={logo}
        alt="Loading Logo"
        className="w-full h-full rounded-full object-cover relative z-10"
      />
    </div>

    <h2 className="text-white text-xl font-semibold tracking-wide animate-pulse">
      Just a moment...
    </h2>

    <p className="text-sm text-white mt-2 text-center max-w-xs">
      We're loading everything up for you. Hang tight and enjoy the experience!
    </p>
  </motion.div>
);

export default LoadingBig;
