import React, { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimalSeparator?: string;
  className?: string;
}

export default function CountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  decimalSeparator = '.',
  className = '',
}: CountUpProps) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for energetic start and smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeProgress;
      setValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, start, duration]);

  // Format the numeric value
  const formattedNumber = (() => {
    const fixed = value.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    
    // Add thousands separators
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    if (decimals > 0 && decPart !== undefined) {
      return `${formattedInt}${decimalSeparator}${decPart}`;
    }
    return formattedInt;
  })();

  return (
    <span className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
