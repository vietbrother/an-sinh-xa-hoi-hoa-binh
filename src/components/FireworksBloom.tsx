import React from 'react';

interface FireworksBloomProps {
  active?: boolean;
  className?: string;
}

export default function FireworksBloom({ active = true, className = '' }: FireworksBloomProps) {
  if (!active) return null;

  // Pre-calculated particle trajectories for gentle fireworks bloom
  const sparks = [
    { id: 1, angle: 0, distance: 48, delay: 0, color: '#fced31', size: 6 },
    { id: 2, angle: 30, distance: 58, delay: 0.2, color: '#ff7849', size: 5 },
    { id: 3, angle: 60, distance: 44, delay: 0.1, color: '#ffd700', size: 7 },
    { id: 4, angle: 90, distance: 62, delay: 0.3, color: '#ff3000', size: 5 },
    { id: 5, angle: 120, distance: 48, delay: 0.05, color: '#fced31', size: 6 },
    { id: 6, angle: 150, distance: 54, delay: 0.25, color: '#ffae00', size: 5 },
    { id: 7, angle: 180, distance: 46, delay: 0.15, color: '#ffd700', size: 6 },
    { id: 8, angle: 210, distance: 60, delay: 0.35, color: '#ff4d4d', size: 5 },
    { id: 9, angle: 240, distance: 45, delay: 0.1, color: '#fced31', size: 7 },
    { id: 10, angle: 270, distance: 64, delay: 0.4, color: '#ff9900', size: 6 },
    { id: 11, angle: 300, distance: 52, delay: 0.2, color: '#ffe600', size: 5 },
    { id: 12, angle: 330, distance: 56, delay: 0.3, color: '#ff3366', size: 6 },
  ];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-3xl ${className}`}>
      {/* Gentle ambient halo glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-300/15 rounded-full blur-xl" />

      {/* Primary Firework Bloom Cluster 1 (Top Right) */}
      <div className="absolute top-6 right-8 w-1 h-1">
        <span className="absolute -inset-3 rounded-full bg-amber-400/30 animate-ping duration-1000" />
        {sparks.map((spark) => {
          const rad = (spark.angle * Math.PI) / 180;
          const x = Math.cos(rad) * spark.distance;
          const y = Math.sin(rad) * spark.distance;
          return (
            <span
              key={`spark-tr-${spark.id}`}
              className="absolute rounded-full shadow-sm animate-firework-burst"
              style={{
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                backgroundColor: spark.color,
                boxShadow: `0 0 8px ${spark.color}`,
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${spark.delay}s`,
                animationDuration: '2.4s',
                animationIterationCount: 'infinite',
              }}
            />
          );
        })}
      </div>

      {/* Secondary Firework Bloom Cluster 2 (Top Left) */}
      <div className="absolute top-8 left-10 w-1 h-1">
        <span className="absolute -inset-2.5 rounded-full bg-rose-400/25 animate-ping duration-1200 delay-500" />
        {sparks.slice(0, 8).map((spark) => {
          const rad = ((spark.angle + 45) * Math.PI) / 180;
          const x = Math.cos(rad) * (spark.distance * 0.85);
          const y = Math.sin(rad) * (spark.distance * 0.85);
          return (
            <span
              key={`spark-tl-${spark.id}`}
              className="absolute rounded-full shadow-sm animate-firework-burst"
              style={{
                width: `${spark.size - 1}px`,
                height: `${spark.size - 1}px`,
                backgroundColor: spark.id % 2 === 0 ? '#fced31' : '#ff4d4d',
                boxShadow: `0 0 6px ${spark.color}`,
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${spark.delay + 0.6}s`,
                animationDuration: '2.6s',
                animationIterationCount: 'infinite',
              }}
            />
          );
        })}
      </div>

      {/* Floating Sparkle Stars */}
      <div className="absolute top-3 right-24 animate-bounce duration-1000 text-amber-300 text-xs">✨</div>
      <div className="absolute top-14 right-4 animate-pulse duration-700 text-yellow-300 text-xs">✦</div>
      <div className="absolute bottom-6 right-10 animate-pulse duration-1000 text-amber-400 text-sm">★</div>
      <div className="absolute top-4 left-6 animate-pulse duration-800 text-amber-300 text-xs">✧</div>
    </div>
  );
}
