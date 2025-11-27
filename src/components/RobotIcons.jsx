import { motion } from 'framer-motion';

// Hover wobble animation
const wobbleVariants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: [0, -3, 3, -2, 2, 0],
    transition: { 
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Robot icons using extracted images
export const RobotDrone = ({ size = 120, className = '' }) => (
  <motion.img 
    src="/robot-drone.png" 
    alt="Drone Robot"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
    variants={wobbleVariants}
    initial="initial"
    whileHover="hover"
  />
);

export const RobotHumanoid = ({ size = 120, className = '' }) => (
  <motion.img 
    src="/robot-humanoid.png" 
    alt="Humanoid Robot"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
    variants={wobbleVariants}
    initial="initial"
    whileHover="hover"
  />
);

export const RobotIndustrial = ({ size = 120, className = '' }) => (
  <motion.img 
    src="/robot-industrial.png" 
    alt="Industrial Robot"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
    variants={wobbleVariants}
    initial="initial"
    whileHover="hover"
  />
);

export const RobotDelivery = ({ size = 120, className = '' }) => (
  <motion.img 
    src="/robot-delivery.png" 
    alt="Delivery Robot"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
    variants={wobbleVariants}
    initial="initial"
    whileHover="hover"
  />
);

export const RobotIcon = ({ type = 'humanoid', ...props }) => {
  const robots = {
    drone: RobotDrone,
    humanoid: RobotHumanoid,
    industrial: RobotIndustrial,
    delivery: RobotDelivery,
  };
  
  const Component = robots[type] || RobotHumanoid;
  return <Component {...props} />;
};

export default RobotIcon;
