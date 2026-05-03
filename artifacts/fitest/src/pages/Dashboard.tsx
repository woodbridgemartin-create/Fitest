import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Calendar as CalendarIcon, 
  ArrowUpRight,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Check for auth/config
    const savedConfig = localStorage.getItem("fitest_config");
    const auth = localStorage.getItem("fitest_auth");

    if (!auth || !savedConfig) {
      navigate("/"); // Kick back to onboarding if not set up
    } else {
      setConfig(JSON.parse(savedConfig));
    }
  }, [navigate]);

  if (!config) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">F</div>
            <span className="font-black tracking-tight">FITEST</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Users className="w-4 h-4" /> {config.type === 'gym' ? 'Members' : 'Employees'}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" /> Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{config.name}</h1>
            <p className="text-muted-foreground capitalize">{config.type} Performance Hub</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            <CalendarIcon className="w-3 h-3" />
            Audit Live: {config.activeFrom}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Awaiting first submission</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Target: 85%</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Billing Status</CardTitle>
              <ArrowUpRight className="h-4 w-4 opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{config.billing}</div>
              <p className="text-xs opacity-70">Pro Plan Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Chart */}
        <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">Waiting for Data</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Once {config.type === 'gym' ? 'members' : 'staff'} start using your link, the real-time analytics will populate here.
          </p>
          <Button 
            className="mt-6" 
            variant="outline" 
            onClick={() => {
              const url = `https://fitest.co.uk/?client=${config.clientId}`;
              navigator.clipboard.writeText(url);
              alert("Link copied!");
            }}
          >
            Copy Audit Link
          </Button>
        </Card>
      </main>
    </div>
  );
}
