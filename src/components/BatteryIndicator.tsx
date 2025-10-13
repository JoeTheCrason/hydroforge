import { useState, useEffect } from "react";
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from "lucide-react";

export const BatteryIndicator = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });

          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        } catch (error) {
          console.log("Battery API not supported");
        }
      }
    };

    updateBattery();
  }, []);

  if (batteryLevel === null) return null;

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="h-5 w-5" />;
    if (batteryLevel >= 90) return <BatteryFull className="h-5 w-5" />;
    if (batteryLevel >= 50) return <BatteryMedium className="h-5 w-5" />;
    if (batteryLevel >= 20) return <BatteryLow className="h-5 w-5" />;
    return <BatteryWarning className="h-5 w-5" />;
  };

  const getBatteryColor = () => {
    if (isCharging) return "text-primary";
    if (batteryLevel >= 50) return "text-foreground";
    if (batteryLevel >= 20) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <div className={`flex items-center gap-1 ${getBatteryColor()}`} title={`Battery: ${batteryLevel}%${isCharging ? ' (Charging)' : ''}`}>
      {getBatteryIcon()}
      <span className="text-sm font-medium">{batteryLevel}%</span>
    </div>
  );
};
