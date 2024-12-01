import { Maybe } from '@hospital/shared';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../utils/classNames';
import { useTimer } from '../utils/use-timer';

interface TooltipProps {
  text: ReactNode;
  children: ReactNode;
  bgColor?: string;
  fix?: boolean;
  stopAfter?: number;
  id?: string;
}

const checkAnyParentIsToolTip = (target: Maybe<HTMLElement>) => {
  if (target?.parentElement == null) {
    return false;
  }
  if (target.parentElement.id === 'tooltip') {
    return true;
  }
  return checkAnyParentIsToolTip(target.parentElement);
};

export type TooltipRef =
  | {
      stop: () => void;
    }
  | undefined;

const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  ({ text, children, bgColor, fix, stopAfter, id }, ref) => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipPlacement, setTooltipPlacement] = useState<
      'top' | 'bottom' | 'left' | 'right'
    >('top');
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [stop, setStop] = useState(false);
    const [positionCalculated, setPositionCalculated] = useState(false);
    const [startTimer, stopTimer] = useTimer(stopAfter || 0);

    const handleMouseEnter = (e: React.MouseEvent) => {
      updateTooltipPosition(e);
      setIsTooltipVisible(true);
      stopTimer();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      updateTooltipPosition(e);
      stopTimer();
    };

    const handleMouseLeave = () => {
      startTimer(() => {
        setStop(true);
        setIsTooltipVisible(false);
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        stop: () => {
          setTimeout(() => {
            // parent action like on click should register
            setIsTooltipVisible(false);
          }, 5);
        },
      }),
      [],
    );

    const updateTooltipPosition = (e: React.MouseEvent) => {
      const { clientX: mouseX, clientY: mouseY } = e;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      if (stop) return;
      if (fix && positionCalculated) return;

      let placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

      // Dynamically adjust placement based on viewport space
      if (mouseX < 50)
        placement = 'right'; // If close to the left, place to the right
      else if (viewportWidth - mouseX < 50)
        placement = 'left'; // If close to the right, place to the left
      else if (mouseY < 50)
        placement = 'bottom'; // If close to the top, place below
      else if (viewportHeight - mouseY < 50) placement = 'top'; // If close to the bottom, place above

      setTooltipPlacement(placement);
      setTooltipPosition({ x: mouseX, y: mouseY });
      setPositionCalculated(true);
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
        className={classNames(
          bgColor ? bgColor : 'bg-black',
          'fixed z-50 whitespace-nowrap rounded  px-2 py-1 text-sm text-white',
        )}
        id="tooltip"
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
        tabIndex={-1}
        onTouchStart={() => {
          setStop(false);
        }}
        onBlur={(event) => {
          const anyParent = checkAnyParentIsToolTip(
            event.nativeEvent.target as Maybe<HTMLElement>,
          );
          if (anyParent) {
            return;
          }
          if (
            event.relatedTarget &&
            event.currentTarget.contains(event.relatedTarget)
          ) {
            return; // Do nothing if the new focus is inside the parent
          }
          setStop(false);
          setIsTooltipVisible(false);
        }}
        onClick={() => {
          setStop(true);
        }}
      >
        {children}
        {isTooltipVisible && createPortal(renderTooltip(), document.body)}
      </div>
    );
  },
);

export default Tooltip;
