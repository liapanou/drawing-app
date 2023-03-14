import { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  tool: number;
  selectedColor: string;
  text: string;
  setMode: (n: number) => void;
  setSelectedColor: (c: string) => void;
  setText: (t: string) => void;
};

const defaultValue: ContextType = {
  tool: 4,
  selectedColor: "#000000",
  text: "",
  setMode: (n: number) => {},
  setSelectedColor: (c: string) => {},
  setText: (t: string) => {},
};

const Context = createContext<ContextType>(defaultValue);

export function useSettings() {
  return useContext(Context);
}

export function SettingsProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<ContextType>(defaultValue);

  function setSelectedColor(c: string) {
    setState({ ...state, selectedColor: c });
  }

  function setMode(n: number) {
    setState({
      ...state,
      tool: n,
    });
  }

  function setText(t: string) {
    setState({ ...state, text: t });
  }
  return (
    <Context.Provider
      value={{
        ...state,
        setMode,
        setSelectedColor,
        setText,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
