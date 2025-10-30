import React from 'react';

interface LoadingSpinnerProps {
  size?: number; // Size in pixels
  color?: string; // Any valid CSS color
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 32,
  color = '#043915',
  className = '',
}) => {
  const borderWidth = Math.max(2, Math.floor(size / 8)); // Dynamic border width based on size

  return (
    <div
      className={`animate-spin rounded-full border-solid border-gray-200 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
        borderTopColor: color,
      }}
    />
  );
};

export default LoadingSpinner;
