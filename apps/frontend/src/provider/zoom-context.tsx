import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

type ContextProps = {
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  resetZoom: () => void;
};

const ZoomContext = createContext<ContextProps | undefined>(undefined);

export const ZoomProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const zoomRef = useRef(1);

  const handleZoomIn = useCallback(() => {
    zoomRef.current = Math.min(zoomRef.current + 0.1, 3);
    document.body.style.zoom = zoomRef.current.toString();
  }, []); // Max zoom level: 3
  const handleZoomOut = useCallback(() => {
    zoomRef.current = Math.max(zoomRef.current - 0.1, 0.5);
    document.body.style.zoom = zoomRef.current.toString();
  }, []);
  const resetZoom = useCallback(() => {
    zoomRef.current = 1;
    document.body.style.zoom = zoomRef.current.toString();
  }, []);

  return (
    <ZoomContext.Provider
      value={useMemo(
        () => ({
          zoomLevel: zoomRef.current,
          handleZoomIn,
          handleZoomOut,
          resetZoom,
        }),
        [handleZoomIn, handleZoomOut, resetZoom],
      )}
    >
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => useContext(ZoomContext)!;
