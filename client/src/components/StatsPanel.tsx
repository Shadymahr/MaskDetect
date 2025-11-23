import { DailyStats } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

interface StatsPanelProps {
  data: DailyStats[];
  totalDetections: number;
  maskCount: number;
  noMaskCount: number;
}

export function StatsPanel({ data, totalDetections, maskCount, noMaskCount }: StatsPanelProps) {
  const complianceRate = totalDetections > 0 ? (maskCount / totalDetections) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* KPI Cards */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Compliance Rate</p>
            <div className="text-2xl font-bold font-mono text-primary">{complianceRate.toFixed(1)}%</div>
          </div>
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Masks Detected</p>
            <div className="text-2xl font-bold font-mono text-success">{maskCount}</div>
          </div>
          <div className="h-8 w-8 rounded bg-success/10 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-success" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Violations</p>
            <div className="text-2xl font-bold font-mono text-destructive">{noMaskCount}</div>
          </div>
          <div className="h-8 w-8 rounded bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </div>
        </CardContent>
      </Card>

      {/* Chart - Spans full width on mobile, dedicated row */}
      <Card className="col-span-1 md:col-span-3 bg-card/50 border-border backdrop-blur-sm h-[200px]">
        <CardHeader className="py-3 px-4 border-b border-border/50">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Detection Trends (Last 12 Hours)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMask" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(140, 100%, 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(140, 100%, 60%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNoMask" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 100%, 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(0, 100%, 60%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{fontSize: 10, fill: 'hsl(215, 20%, 60%)'}} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{fontSize: 10, fill: 'hsl(215, 20%, 60%)'}} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(220, 15%, 10%)', borderColor: 'hsl(215, 20%, 25%)' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ fontSize: '10px', color: 'hsl(215, 20%, 60%)', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="mask" 
                stroke="hsl(140, 100%, 60%)" 
                fillOpacity={1} 
                fill="url(#colorMask)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="noMask" 
                stroke="hsl(0, 100%, 60%)" 
                fillOpacity={1} 
                fill="url(#colorNoMask)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
