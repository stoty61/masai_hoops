import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Card from './Card'
import './assets/styles.css'; // Add your custom CSS for styling

const ScrollAnimation = () => {
  const { ref: leftRef, inView: leftInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: rightRef, inView: rightInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: centerRef, inView: centerInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className='Kimberly'>
        <motion.div
        ref={centerRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={centerInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{
            ease: "linear",
            duration: 2,
            x: { duration: 1 }
          }}
        className="d-flex justify-content-center"
      >
        <h1 className='mt-2 mb-4 timeline' style={{fontSize: '3em'}}>Championship Navigator: Toronto's Path to Victory</h1>
      </motion.div>

      <motion.div
        ref={leftRef}
        initial={{ x: '0px', opacity: 0 }}
        animate={leftInView ? { x: 0, opacity: 1 } : { x: '-10vw', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className=""
      >
        <Card       
        title="Trade 1"
        text="stuff happened"/>
      </motion.div>

      <motion.div
        ref={rightRef}
        initial={{ x: '0px', opacity: 0 }}
        animate={rightInView ? { x: 0, opacity: 1 } : { x: '10vw', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="right"
      >
        <Card       
        title="Trade 2"
        text="more things"
        right= {true} />

      </motion.div>

    </div>
  );
};

export default ScrollAnimation;
