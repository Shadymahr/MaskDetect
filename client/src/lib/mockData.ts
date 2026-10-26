import { subMinutes, subHours } from 'date-fns';

// Stock images for simulation
import personMask1 from '@assets/stock_images/placeholder.svg';
import personMask2 from '@assets/stock_images/placeholder.svg';
import personNoMask1 from '@assets/stock_images/placeholder.svg';
import personNoMask2 from '@assets/stock_images/placeholder.svg';

export type DetectionEvent = {
  id: string;
  timestamp: Date;
  type: 'MASK' | 'NO_MASK';
  confidence: number;
  imageUrl: string;
  identity?: string;
  location: string;
};

export type DailyStats = {
  time: string;
  mask: number;
  noMask: number;
};

// Generate some recent history
const generateHistory = (): DetectionEvent[] => {
  const events: DetectionEvent[] = [];
  const now = new Date();
  
  // Create 20 recent events
  for (let i = 0; i < 20; i++) {
    const isMask = Math.random() > 0.3; // 70% mask compliance
    const timeOffset = Math.floor(Math.random() * 60); // within last hour
    
    events.push({
      id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: subMinutes(now, timeOffset),
      type: isMask ? 'MASK' : 'NO_MASK',
      confidence: 0.85 + (Math.random() * 0.14), // 85-99% confidence
      imageUrl: isMask 
        ? (Math.random() > 0.5 ? personMask1 : personMask2) 
        : (Math.random() > 0.5 ? personNoMask1 : personNoMask2),
      identity: !isMask && Math.random() > 0.5 ? ['John Doe', 'Sarah Smith', 'Mike Ross'][Math.floor(Math.random() * 3)] : undefined,
      location: ['Main Entrance', 'Lobby', 'Corridor A'][Math.floor(Math.random() * 3)]
    });
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate chart data
const generateChartData = (): DailyStats[] => {
  const data: DailyStats[] = [];
  const now = new Date();
  
  for (let i = 12; i >= 0; i--) {
    const hour = subHours(now, i);
    data.push({
      time: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mask: Math.floor(Math.random() * 50) + 20,
      noMask: Math.floor(Math.random() * 10) + 1,
    });
  }
  return data;
};

export const MOCK_EVENTS = generateHistory();
export const MOCK_CHART_DATA = generateChartData();
