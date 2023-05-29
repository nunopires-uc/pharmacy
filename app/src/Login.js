import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './Authentication/AuthContext';
import { useContext } from 'react';

import "./Login.css";
import "./Fonts.css";

/*
let navigate = useNavigate(); 

    const {loginUser} = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        if (username.length > 0) {
            const isLoggedIn = await loginUser(username, password);
            if (isLoggedIn) {
                navigate("/Dashboard");
            }
        }
    };
*/

const Login = () => {

    let navigate = useNavigate(); 
    const {loginUser} = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        if (username.length > 0) {
            console.log('Attempting login with username:', username, 'and password:', password);
            await loginUser(username, password, navigate);
        }
    };
    

    return (
            <section class="vh-100 container-login" >
                <div class="container py-5 h-100">
                    <div class="row justify-content-center align-items-center">
                        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div class="card-login shadow-2-strong">
                                <div class="card-body p-5 text-center">
                                    <div class="d-flex justify-content-center align-items-center">
                                    <img src={require('./img/logo.png')} className="rounded-circle" width="200" height="200" loading="lazy" />
                                    </div>
                                    <h3 class="mb-5 login-title">Autenticação</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div class="form-outline mb-4">
                                            <label class="form-label"  placeholder='Nome de utilizador'>Nome de utilizador</label>
                                            <input name="username" type="username" id="typeEmailX-2" className="form-control form-control-lg"/>
                                        </div>
                                        <div class="form-outline mb-4">
                                            <label class="form-label" for="typePasswordX-2">Palavra-passe</label>
                                            <input name="password" type="password" id="typePasswordX-2" className="form-control form-control-lg"/>
                                        </div>
                                        <button className="login-button" type="submit">Entrar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default Login;