interface CrosshairProps {
  visible: boolean;
  position: { x: number; y: number };
  type: string;
  rotation: number;
}

export const Crosshair = ({ visible, position, type, rotation }: CrosshairProps) => {
  if (!visible) return null;

  const renderCrosshair = () => {
    const baseClasses = "bg-primary";
    const transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    switch (type) {
      case "dot":
        return (
          <div className="relative w-2 h-2">
            <div className={`absolute left-1/2 top-1/2 w-2 h-2 ${baseClasses} rounded-full -translate-x-1/2 -translate-y-1/2`} />
          </div>
        );
      
      case "cross":
        return (
          <div className="relative w-8 h-8" style={{ transform }}>
            <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 ${baseClasses} -translate-x-1/2`} />
            <div className={`absolute top-1/2 left-0 right-0 h-0.5 ${baseClasses} -translate-y-1/2`} />
          </div>
        );
      
      case "circle":
        return (
          <div className="relative w-8 h-8">
            <div className={`absolute inset-0 border-2 border-primary rounded-full`} />
            <div className={`absolute left-1/2 top-1/2 w-1 h-1 ${baseClasses} rounded-full -translate-x-1/2 -translate-y-1/2`} />
          </div>
        );
      
      case "square":
        return (
          <div className="relative w-8 h-8" style={{ transform }}>
            <div className={`absolute inset-0 border-2 border-primary`} />
            <div className={`absolute left-1/2 top-1/2 w-1 h-1 ${baseClasses} rounded-full -translate-x-1/2 -translate-y-1/2`} />
          </div>
        );
      
      case "default":
      default:
        return (
          <div className="relative w-6 h-6" style={{ transform }}>
            <div className={`absolute left-1/2 top-0 w-0.5 h-2 ${baseClasses} -translate-x-1/2`} />
            <div className={`absolute left-1/2 bottom-0 w-0.5 h-2 ${baseClasses} -translate-x-1/2`} />
            <div className={`absolute top-1/2 left-0 h-0.5 w-2 ${baseClasses} -translate-y-1/2`} />
            <div className={`absolute top-1/2 right-0 h-0.5 w-2 ${baseClasses} -translate-y-1/2`} />
            <div className={`absolute left-1/2 top-1/2 w-1 h-1 ${baseClasses} rounded-full -translate-x-1/2 -translate-y-1/2`} />
          </div>
        );
    }
  };

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {renderCrosshair()}
    </div>
  );
};