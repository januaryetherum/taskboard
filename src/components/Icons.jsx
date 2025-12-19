import { motion } from 'framer-motion';

// Unified SVG icon system
export const Icon = ({ name, size = 24, color = 'currentColor', className = '' }) => {
  const icons = {
    // Navigation & UI
    home: (
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    docs: (
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    cog: (
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Task types
    delivery: (
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    patrol: (
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    inspection: (
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    transport: (
      <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Doc sections
    overview: (
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    architecture: (
      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    lifecycle: (
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    sdk: (
      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    verification: (
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    economics: (
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Social
    twitter: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill={color} />
    ),
    github: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill={color} />
    ),
    
    // Actions
    copy: (
      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    check: (
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Symbols
    diamond: (
      <path d="M12 2L2 12l10 10 10-10L12 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    hexagon: (
      <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    square: (
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" fill="none" stroke={color} />
    ),
    circle: (
      <circle cx="12" cy="12" r="9" strokeWidth="2" fill="none" stroke={color} />
    ),
    triangle: (
      <path d="M12 3l9 16H3L12 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    grid: (
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    terminal: (
      <path d="M4 17l6-6-6-6M12 19h8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Arrows & Navigation
    arrowRight: (
      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    arrowDown: (
      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    chevronRight: (
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Status
    success: (
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    warning: (
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Tech
    chip: (
      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    server: (
      <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    globe: (
      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    lock: (
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    lightning: (
      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    
    // Misc
    robot: (
      <>
        <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth="2" fill="none" stroke={color} />
        <circle cx="9" cy="13" r="1.5" fill={color} />
        <circle cx="15" cy="13" r="1.5" fill={color} />
        <path d="M10 17h4" strokeLinecap="round" strokeWidth="2" fill="none" stroke={color} />
        <path d="M12 4v4M8 4h8" strokeLinecap="round" strokeWidth="2" fill="none" stroke={color} />
      </>
    ),
    drone: (
      <>
        <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" stroke={color} />
        <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2" strokeLinecap="round" strokeWidth="2" fill="none" stroke={color} />
        <circle cx="5" cy="5" r="2" strokeWidth="2" fill="none" stroke={color} />
        <circle cx="19" cy="5" r="2" strokeWidth="2" fill="none" stroke={color} />
        <circle cx="5" cy="19" r="2" strokeWidth="2" fill="none" stroke={color} />
        <circle cx="19" cy="19" r="2" strokeWidth="2" fill="none" stroke={color} />
      </>
    ),
    warehouse: (
      <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
    truck: (
      <path d="M1 3h15v13H1V3zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" stroke={color} />
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`icon icon-${name} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[name] || icons.circle}
    </svg>
  );
};

// Animated icon wrapper
export const AnimatedIcon = ({ name, size = 24, color = 'currentColor', ...props }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    style={{ display: 'inline-flex' }}
  >
    <Icon name={name} size={size} color={color} {...props} />
  </motion.div>
);

export default Icon;
