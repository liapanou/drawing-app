import { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  tool: number;
  selectedColor: string;
  setMode: (n: number) => void;
  setSelectedColor: (c: string) => void;
};

const defaultValue: ContextType = {
  tool: 4,
  selectedColor: "#000000",
  setMode: (n: number) => {},
  setSelectedColor: (c: string) => {},
};

const Context = createContext<ContextType>(defaultValue);

export function useSettings() {
  return useContext(Context);
}

export function SettingsProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<ContextType>(defaultValue);

  function setMode(n: number) {
    setState({ ...state, tool: n });
  }

  function setSelectedColor(c: string) {
    setState({ ...state, selectedColor: c });
  }
  return (
    <Context.Provider
      value={{
        ...state,
        setMode,
        setSelectedColor,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
