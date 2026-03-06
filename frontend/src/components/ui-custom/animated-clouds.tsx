import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Cloud } from "lucide-react";

interface AnimatedCloudsProps {
  className?: string;
}

export function AnimatedClouds({ className = "" }: AnimatedCloudsProps) {
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Parallax transforms for different layers
  const cloudY1 = useTransform(smoothScrollProgress, [0, 1], [0, -150]);
  const cloudY2 = useTransform(smoothScrollProgress, [0, 1], [0, -100]);
  const cloudY3 = useTransform(smoothScrollProgress, [0, 1], [0, -200]);
  const cloudY4 = useTransform(smoothScrollProgress, [0, 1], [0, -120]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Cloud 1 - Top Left - Blue tint */}
      <motion.div
        className="absolute top-20 left-10 text-[#E8F4FD]"
        style={{ y: cloudY1 }}>
        <motion.div
          animate={{
            x: [0, 10, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <Cloud className="w-24 h-24" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Cloud 2 - Top Right - Pink tint */}
      <motion.div
        className="absolute top-40 right-20 text-[#FDE8F0]"
        style={{ y: cloudY2 }}>
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}>
          <Cloud className="w-32 h-32" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Cloud 3 - Bottom Left - Yellow tint */}
      <motion.div
        className="absolute bottom-40 left-20 text-[#FEF7E8]"
        style={{ y: cloudY3 }}>
        <motion.div
          animate={{
            x: [0, 8, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}>
          <Cloud className="w-20 h-20" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Cloud 4 - Middle Right - Purple tint */}
      <motion.div
        className="absolute top-1/3 right-10 text-[#F3E8FD]"
        style={{ y: cloudY4 }}>
        <motion.div
          animate={{
            x: [0, -8, 0],
            y: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}>
          <Cloud className="w-16 h-16" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </div>
  );
}
