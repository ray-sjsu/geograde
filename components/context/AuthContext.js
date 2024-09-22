import {useContext, createContext, useState, useEffect } from "react";
import {
    useSignInWithEmailAndPassword,
    useAuthState,
  } from "react-firebase-hooks/auth";
  import { auth } from "@/app/firebase/config";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, loading, error] = useAuthState(auth);


    return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
}

export const UserAuth = () => {
    return useContext(AuthContext)
}