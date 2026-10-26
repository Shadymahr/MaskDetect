import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';

interface DetectionBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'MASK' | 'NO_MASK';
  label: string;
}

export function VideoFeed() {
  const [detections, setDetections] = useState<DetectionBox[]>([]);

  // Simulate real-time detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate 0-3 detections
      const count = Math.floor(Math.random() * 3) + 1;
      const newDetections: DetectionBox[] = [];

      for (let i = 0; i < count; i++) {
        const isMask = Math.random() > 0.3;
        newDetections.push({
          id: Date.now() + i,
          x: Math.random() * 60 + 20, // 20-80%
          y: Math.random() * 50 + 20, // 20-70%
          width: 15,
          height: 25,
          type: isMask ? 'MASK' : 'NO_MASK',
          label: isMask ? 'MASK' : (Math.random() > 0.5 ? 'UNKNOWN' : 'JOHN DOE')
        });
      }
      setDetections(newDetections);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border bg-black shadow-2xl group">
      {/* Webcam Layer */}
      <Webcam
        audio={false}
        className="w-full h-full object-cover opacity-80"
        screenshotFormat="image/jpeg"
      />

      {/* Scanlines & Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] bg-repeat" />

      {/* HUD UI */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
        <span className="font-mono text-red-500 text-sm tracking-widest font-bold">LIVE PREVIEW / SIMULATED BOXES</span>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <span className="font-mono text-primary text-xs">CAM-01 // LOBBY</span>
      </div>

      <div className="absolute bottom-4 left-4 z-20 font-mono text-xs text-muted-foreground">
        Demo overlays - performance not measured
      </div>

      {/* Crosshairs */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-primary/50" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-primary/20" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary/20" />
      </div>

      {/* Detection Boxes */}
      <AnimatePresence>
        {detections.map((box) => (
          <motion.div
            key={box.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`absolute z-30 border-2 flex flex-col items-start ${
              box.type === 'MASK' ? 'border-success text-success' : 'border-destructive text-destructive'
            }`}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
              boxShadow: box.type === 'MASK' ? '0 0 15px -3px rgba(74, 222, 128, 0.5)' : '0 0 15px -3px rgba(248, 113, 113, 0.5)'
            }}
          >
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-current" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-current" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-current" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-current" />

            {/* Label */}
            <div className={`absolute -top-7 left-0 px-2 py-0.5 text-[10px] font-bold tracking-wider text-black ${
              box.type === 'MASK' ? 'bg-success' : 'bg-destructive'
            }`}>
              {box.label}
            </div>
            
            <div className="absolute -bottom-5 left-0 text-[9px] font-mono font-bold">
              {(0.85 + Math.random() * 0.14).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
