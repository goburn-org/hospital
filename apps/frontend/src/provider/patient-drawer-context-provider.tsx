import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ShownProps = {
  show: true;
  visitId: string;
  patientId: string;
};

type HiddenProps = {
  show: false;
};

type Props = {
  value: ShownProps | HiddenProps;
  setValue: Dispatch<SetStateAction<ShownProps | HiddenProps>>;
};
// Create Context
const PatientVisitDrawerContext = createContext<Props | undefined>(undefined);

// Create a provider component
export const PatientVisitDrawerProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [value, setValue] = useState<Props['value']>({
    show: false,
  });
  return (
    <PatientVisitDrawerContext.Provider
      value={useMemo(() => ({ value, setValue }), [value])}
    >
      {children}
    </PatientVisitDrawerContext.Provider>
  );
};

export const usePatientVisitDrawerState = () => {
  const props = useContext(PatientVisitDrawerContext);
  return props?.value;
};

export const useVisitDrawer = () => {
  const props = useContext(PatientVisitDrawerContext);
  const { setValue } = props || {};
  const show = useCallback(
    (visitId: string, patientId: string) => {
      setValue?.({ show: true, visitId, patientId });
    },
    [setValue],
  );
  const hide = useCallback(() => {
    setValue?.({ show: false });
  }, [setValue]);
  return { show, hide };
};
