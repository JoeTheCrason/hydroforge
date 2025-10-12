import { useState, useEffect } from "react";
import { Moon, Sun, ExternalLink, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SettingsProps {
  children: React.ReactNode;
}

export const Settings = ({ children }: SettingsProps) => {
  const [customTitle, setCustomTitle] = useState(() => 
    localStorage.getItem("customTitle") || "HydroForge"
  );
  const [customIcon, setCustomIcon] = useState(() => 
    localStorage.getItem("customIcon") || "/favicon.ico"
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === null;
  });

  useEffect(() => {
    document.title = customTitle;
    localStorage.setItem("customTitle", customTitle);
    
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = customIcon;
    }
    localStorage.setItem("customIcon", customIcon);
  }, [customTitle, customIcon]);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  const handleOpenInBlank = () => {
    const win = window.open("about:blank", "_blank");
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${customTitle}</title>
            <link rel="icon" href="${customIcon}" />
          </head>
          <body style="margin:0;padding:0;overflow:hidden;">
            <iframe src="${window.location.href}" style="width:100%;height:100vh;border:none;"></iframe>
          </body>
        </html>
      `);
      win.document.close();
      toast("Opened in about:blank");
    }
  };

  const handleReset = () => {
    setCustomTitle("HydroForge");
    setCustomIcon("/favicon.ico");
    setIsDarkMode(true);
    toast("Settings reset to default");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Custom Title</Label>
              <Input
                id="title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter custom title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Custom Icon URL</Label>
              <Input
                id="icon"
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
                placeholder="Enter icon URL"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                {isDarkMode ? "Dark" : "Light"} mode
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleOpenInBlank}
              className="w-full justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in about:blank
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
