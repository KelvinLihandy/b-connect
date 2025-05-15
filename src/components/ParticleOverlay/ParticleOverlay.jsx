import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ParticleOverlay = ({ children }) => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Create particles on component mount
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      setDimensions({ width, height });
      
      // Generate particles with random properties
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 1,
        velocity: {
          x: (Math.random() - 0.5) * 0.8,
          y: (Math.random() - 0.5) * 0.8
        },
        opacity: Math.random() * 0.5 + 0.1,
        color: [
          "#ffffff", // white
          "#64B5F6", // light blue
          "#90CAF9", // lighter blue
          "#E3F2FD", // very light blue
        ][Math.floor(Math.random() * 4)]
      }));
      
      setParticles(newParticles);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop for particles
  useEffect(() => {
    if (particles.length === 0 || !dimensions.width) return;
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update position based on velocity
          let newX = particle.x + particle.velocity.x;
          let newY = particle.y + particle.velocity.y;
          
          // Bounce off edges
          if (newX <= 0 || newX >= dimensions.width) {
            particle.velocity.x *= -1;
            newX = particle.x + particle.velocity.x;
          }
          
          if (newY <= 0 || newY >= dimensions.height) {
            particle.velocity.y *= -1;
            newY = particle.y + particle.velocity.y;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );
    };
    
    const interval = setInterval(animateParticles, 30);
    return () => clearInterval(interval);
  }, [particles, dimensions]);

  return (
    <div 
      className="relative w-full h-full"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          animate={{
            x: isHovered ? 
              particle.x + (Math.random() - 0.5) * 40 : 
              particle.x,
            y: isHovered ? 
              particle.y + (Math.random() - 0.5) * 40 : 
              particle.y,
            scale: isHovered ? 
              Math.random() * 1.5 + 0.5 : 
              1
          }}
          transition={{
            duration: isHovered ? 0.8 : 2,
            ease: "easeInOut"
          }}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
          }}
        />
      ))}
      
      {/* Render children inside the particle container */}
      {children}
    </div>
  );
};

export default ParticleOverlay;