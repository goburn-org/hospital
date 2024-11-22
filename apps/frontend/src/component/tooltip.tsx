import { FC, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: FC<TooltipProps> = ({ text, children }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipPlacement, setTooltipPlacement] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('top');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent) => {
    updateTooltipPosition(e);
    setIsTooltipVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateTooltipPosition(e);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const updateTooltipPosition = (e: React.MouseEvent) => {
    const { clientX: mouseX, clientY: mouseY } = e;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

    // Dynamically adjust placement based on viewport space
    if (mouseY < 50)
      placement = 'bottom'; // If close to the top, place below
    else if (viewportHeight - mouseY < 50)
      placement = 'top'; // If close to the bottom, place above
    else if (mouseX < 50)
      placement = 'right'; // If close to the left, place to the right
    else if (viewportWidth - mouseX < 50) placement = 'left'; // If close to the right, place to the left

    setTooltipPlacement(placement);
    setTooltipPosition({ x: mouseX, y: mouseY });
  };

  const tooltipStyle = () => {
    switch (tooltipPlacement) {
      case 'top':
        return { top: tooltipPosition.y - 30, left: tooltipPosition.x }; // Above cursor
      case 'bottom':
        return { top: tooltipPosition.y + 20, left: tooltipPosition.x }; // Below cursor
      case 'left':
        return { top: tooltipPosition.y, left: tooltipPosition.x - 150 }; // Left of cursor
      case 'right':
        return { top: tooltipPosition.y, left: tooltipPosition.x + 20 }; // Right of cursor
    }
  };

  const renderTooltip = () => (
    <div
      className="fixed z-50 whitespace-nowrap rounded bg-black px-2 py-1 text-sm text-white"
      style={tooltipStyle()}
    >
      {text}
    </div>
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isTooltipVisible && createPortal(renderTooltip(), document.body)}
    </div>
  );
};

export default Tooltip;
