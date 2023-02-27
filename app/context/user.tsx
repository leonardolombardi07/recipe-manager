import type { User } from "firebase/auth";
import React from "react";

interface UserState {
  user: User | null;
}

interface UserActions {
  setUser: (user: User | null) => void;
}

interface IUserContext {
  state: UserState;
  actions: UserActions;
}

const UserContext = React.createContext<IUserContext | undefined>(undefined);

type UserAction = { type: "SET_USER"; payload: UserState["user"] };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_USER": {
      return { ...state, user: action.payload };
    }
    default:
      return state;
  }
}

interface UserProviderProps {
  children: React.ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = React.useReducer(userReducer, { user: null });

  const setUser = React.useCallback((user: UserState["user"]) => {
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const value = { state, actions: { setUser } };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
}

export { UserProvider, useUser };
