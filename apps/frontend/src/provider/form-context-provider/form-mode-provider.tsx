import { Maybe } from '@hospital/shared';
import { createContext, FC, ReactNode, useContext } from 'react';

export enum FormMode {
  ReadOnly = 'ReadOnly',
  Editable = 'Editable',
}

// Create Context
const FormModeContext = createContext<{
  mode: FormMode;
  oldId: Maybe<string>;
}>({
  mode: FormMode.Editable,
  oldId: undefined,
});

// Create a provider component
export const FormModeProvider: FC<{
  children: ReactNode;
  mode: FormMode;
  oldId?: string;
}> = ({ children, mode, oldId }) => {
  return (
    <FormModeContext.Provider value={{ mode, oldId }}>
      {children}
    </FormModeContext.Provider>
  );
};

export const useFormMode = () => useContext(FormModeContext).mode;

export const useFormOldId = () => useContext(FormModeContext).oldId;
