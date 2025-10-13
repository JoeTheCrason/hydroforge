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
  
  const [tempTitle, setTempTitle] = useState(customTitle);
  const [tempIcon, setTempIcon] = useState(customIcon);
  const [tempDarkMode, setTempDarkMode] = useState(isDarkMode);

  const handleSaveChanges = () => {
    setCustomTitle(tempTitle);
    setCustomIcon(tempIcon);
    setIsDarkMode(tempDarkMode);
    
    document.title = tempTitle;
    localStorage.setItem("customTitle", tempTitle);
    
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = tempIcon;
    }
    localStorage.setItem("customIcon", tempIcon);
    
    const theme = tempDarkMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", tempDarkMode);
    localStorage.setItem("theme", theme);
    
    toast("Settings saved successfully");
  };

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
    setTempTitle("HydroForge");
    setTempIcon("/favicon.ico");
    setTempDarkMode(true);
    toast("Settings reset to default (click Save to apply)");
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
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Enter custom title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Custom Icon URL</Label>
              <Input
                id="icon"
                value={tempIcon}
                onChange={(e) => setTempIcon(e.target.value)}
                placeholder="Enter icon URL"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                {tempDarkMode ? "Dark" : "Light"} mode
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={tempDarkMode}
                onCheckedChange={setTempDarkMode}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSaveChanges}
              className="w-full"
            >
              Save Changes
            </Button>
            
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
