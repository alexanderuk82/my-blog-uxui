import React, { useState, useEffect } from 'react';
import { motion, useAnimation, Variants, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ValueProposition: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Variants for container animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Variants for text reveal animation
  const textVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Variants for line animation
  const lineVariants: Variants = {
    hidden: { width: 0 },
    visible: {
      width: '6rem',
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  // Sections of text with different styles
  const textSections = [
    { text: 'WE WORK CLOSELY WITH OUR CLIENTS', isHighlight: true },
    { text: 'TO UNDERSTAND THEIR UNIQUE NEEDS AND REQUIREMENTS,', isHighlight: false },
    { text: 'AND WE STRIVE TO PROVIDE PERSONALIZED SOLUTIONS', isHighlight: true },
    { text: 'THAT MEET THEIR SPECIFIC', isHighlight: false },
    { text: 'GOALS.', isHighlight: true },
  ];

  return (
    <section 
      id="about" 
      className="py-32  border-t border-keyline overflow-hidden"
      ref={ref}
    >
      <motion.div 
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div>
          <motion.span 
            className="text-sm uppercase tracking-wide block"
            variants={textVariants}
          >
            ABOUT UI STORE
          </motion.span>
          <motion.div 
            className="h-px bg-black dark:bg-white mt-2"
            variants={lineVariants}
          ></motion.div>
        </div>
        
        {/* Original heading - kept for reference */}
        <motion.h2 
          className="text-3xl md:leading-snug sm:text-4xl md:text-5xl uppercase mb-12"
          variants={textVariants}
        >
          WE BUILD <span className="font-bold">PIXEL-PERFECT</span> COMPONENTS 
          SO DEVELOPERS <span className="font-bold">SHIP FASTER</span> & WITH 
          <span className="font-bold"> CONFIDENCE</span>.
        </motion.h2>
        
        {/* New text reveal effect */}
        <div className="relative mt-8">
          <div className="flex flex-col gap-4 space-y-2 md:space-y-4">
            {textSections.map((section, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden"
                onMouseEnter={() => setHoveredSection(index)}
                onMouseLeave={() => setHoveredSection(null)}
                variants={textVariants}
              >
                <motion.div
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium uppercase leading-tight ${section.isHighlight ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'} transition-colors duration-300`}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {section.text}
                </motion.div>
                
                {/* Hover effect overlay */}
                <AnimatePresence>
                  {hoveredSection === index && (
                    <motion.div 
                      className={`absolute inset-0 ${section.isHighlight ? 'bg-black dark:bg-white' : 'bg-gray-400 dark:bg-gray-500'} mix-blend-difference pointer-events-none`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ValueProposition;