import { useState, useEffect } from 'react';
import { VideoFeed } from '@/components/VideoFeed';
import { EventLog } from '@/components/EventLog';
import { StatsPanel } from '@/components/StatsPanel';
import { MOCK_EVENTS, MOCK_CHART_DATA, DetectionEvent } from '@/lib/mockData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, Play, Pause, Maximize2 } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState<DetectionEvent[]>(MOCK_EVENTS);
  const [isSystemActive, setIsSystemActive] = useState(true);
  
  // Simulate new events arriving
  useEffect(() => {
    if (!isSystemActive) return;

    const interval = setInterval(() => {
      // 30% chance to add a new event every 3 seconds
      if (Math.random() > 0.7) {
        const isMask = Math.random() > 0.3;
        const newEvent: DetectionEvent = {
          id: `new-${Date.now()}`,
          timestamp: new Date(),
          type: isMask ? 'MASK' : 'NO_MASK',
          confidence: 0.9 + (Math.random() * 0.09),
          imageUrl: MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)].imageUrl,
          identity: !isMask && Math.random() > 0.6 ? 'Identified Person' : undefined,
          location: 'Main Entrance'
        };
        
        setEvents(prev => [newEvent, ...prev].slice(0, 50));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isSystemActive]);

  const maskCount = events.filter(e => e.type === 'MASK').length;
  const noMaskCount = events.filter(e => e.type === 'NO_MASK').length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur flex items-center px-4 justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center border border-primary/50">
            <div className="w-4 h-4 bg-primary rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider leading-none">SENTINEL <span className="text-primary">AI</span></h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em]">FACE MASK DETECTION SYSTEM</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4 hidden md:flex">
            <span className="text-xs font-mono text-muted-foreground">SYSTEM STATUS</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isSystemActive ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
              <span className={`text-sm font-bold ${isSystemActive ? 'text-success' : 'text-destructive'}`}>
                {isSystemActive ? 'OPERATIONAL' : 'PAUSED'}
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`border-primary/50 ${isSystemActive ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setIsSystemActive(!isSystemActive)}
          >
            {isSystemActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isSystemActive ? 'PAUSE SYSTEM' : 'RESUME'}
          </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-8 flex flex-col p-4 overflow-y-auto gap-4">
          
          {/* Video Section */}
          <div className="aspect-video w-full relative rounded-lg border border-border bg-black shadow-2xl shrink-0">
             <VideoFeed />
          </div>

          {/* Stats Section */}
          <div className="flex-1">
            <StatsPanel 
              data={MOCK_CHART_DATA} 
              totalDetections={events.length}
              maskCount={maskCount}
              noMaskCount={noMaskCount}
            />
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-4 border-l border-border bg-sidebar flex flex-col overflow-hidden">
          
          {/* Settings Panel */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Settings className="w-4 h-4" />
              <h2 className="font-mono font-bold text-sm tracking-wider">CONFIGURATION</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono">DETECTION THRESHOLD</Label>
                <span className="text-xs font-mono text-primary">85%</span>
              </div>
              <Slider defaultValue={[85]} max={100} step={1} className="w-full" />
              
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-xs font-mono">IDENTITY RECOGNITION</Label>
                  <p className="text-[10px] text-muted-foreground">Identify known personnel</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-xs font-mono">AUDIO ALERTS</Label>
                  <p className="text-[10px] text-muted-foreground">Beep on violation</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Recent Alerts - Takes up remaining space */}
          <div className="flex-1 overflow-hidden p-4 bg-card/20">
            <EventLog events={events} />
          </div>
          
          {/* Alert Banner */}
          {noMaskCount > 0 && (
            <div className="p-3 bg-destructive/10 border-t border-destructive/50 flex items-center gap-3 shrink-0 animate-in slide-in-from-bottom duration-500">
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
              <div>
                <div className="text-xs font-bold text-destructive uppercase tracking-wide">Active Violations</div>
                <div className="text-[10px] text-destructive-foreground/80">Requires immediate attention</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
