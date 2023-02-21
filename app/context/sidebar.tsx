import React from "react";

interface SidebarState {
  visible: boolean;
}

interface SidebarActions {
  open: () => void;
  close: () => void;
}

interface ISidebarContext {
  state: SidebarState;
  actions: SidebarActions;
}

const SidebarContext = React.createContext<ISidebarContext | undefined>(
  undefined
);

type SidebarAction = { type: "OPEN" } | { type: "CLOSE" };

function sidebarReducer(
  state: SidebarState,
  action: SidebarAction
): SidebarState {
  switch (action.type) {
    case "OPEN":
      return { ...state, visible: true };

    case "CLOSE": {
      return { ...state, visible: false };
    }

    default:
      throw new Error(
        `sidebarReducer called with unknown action ${JSON.stringify(action)}`
      );
  }
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

function SidebarProvider({ children }: SidebarProviderProps) {
  const [state, dispatch] = React.useReducer(sidebarReducer, {
    visible: true,
  });

  const open = React.useCallback(() => {
    dispatch({ type: "OPEN" });
  }, []);

  const close = React.useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  const value = { state, actions: { open, close } };
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within an SidebarProvider");
  }
  return context;
}

export { SidebarProvider, useSidebar };
