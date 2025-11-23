import { DetectionEvent } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface EventLogProps {
  events: DetectionEvent[];
}

export function EventLog({ events }: EventLogProps) {
  return (
    <div className="h-full flex flex-col border border-border bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="p-3 border-b border-border bg-card/80 flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-primary tracking-wider">EVENT LOG</h3>
        <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary">LIVE</Badge>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-0 divide-y divide-border/50">
          {events.map((event) => (
            <div key={event.id} className="p-3 flex items-center gap-3 hover:bg-primary/5 transition-colors group">
              <Avatar className={`h-10 w-10 rounded-md border ${event.type === 'MASK' ? 'border-success/50' : 'border-destructive/50'}`}>
                <AvatarImage src={event.imageUrl} className="object-cover" />
                <AvatarFallback className="rounded-md bg-secondary font-mono text-xs">IMG</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold tracking-wide ${event.type === 'MASK' ? 'text-success' : 'text-destructive'}`}>
                    {event.type === 'MASK' ? 'MASK DETECTED' : 'NO MASK ALERT'}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium truncate text-foreground">
                      {event.identity || 'Unknown Subject'}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {event.location}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">
                    {(event.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
