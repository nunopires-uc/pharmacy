import React from 'react';
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { url } from '../index';


const api_receita_qrcode = "http://localhost:8000/api/receita-qrcode/";
const api_receita_pago = "http://localhost:8000/api/inserir-receita-pago/";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem("authTokens") 
    ? JSON.parse(localStorage.getItem("authTokens")) 
    : null
    );

    const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
    ? jwt_decode(localStorage.getItem("authTokens"))
    : null);

    const [loading, setLoading] = useState(true);

    const loginUser = async (username, password, navigate) => {
        const response = await fetch(url + "api/token/", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        console.log(data);
        console.log("Status");
        console.log(response.status);

        if(response.status === 200){
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            console.log(JSON.stringify(data));
            navigate("/Dashboard");
        }else{
            alert("Login failed");
        }
    };

    const logoutUser = (navigate) => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if(authTokens){
            setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens]);
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};