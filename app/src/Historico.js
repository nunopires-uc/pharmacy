import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from './Authentication/useAxios';
import { useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from './Authentication/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Dashboard.css";
import "./Fonts.css"
import axios from 'axios';
import useFetchData from './Authentication/fetchMedicamentos';
import { url } from './index';
class Receita {
    constructor(data) {
      this.idReceita = data.idReceita;
      this.userName = data.userName;
      this.userID = data.userID;
      this.prescTotal = data.prescTotal;
      this.medList = data.medList;
    }
}
function renderMedicamentoCard(receita) {
    return (
        <div class="col-md-6 col-lg-6 col-sm-12 col-xl-4 mt-2" key={receita.idReceita}>
            <div class="card">
                <div class="card-body">
                <div class="card-img-wrapper">
                    <img src={require('./img/user.png')} class="card-img img-fluid" />
                </div>

                </div>

                <div class="card-body text-center">
                    <div class="mb-2">
                        <h6 class="font-weight-semibold mb-2">
                            <a href="#" class="text-default mb-2" data-abc="true">{receita.userName}</a>
                        </h6>
                        {receita.medList.map(({nome, preco, quantidade}, index) => (
                            <div key={index}>
                                <span class="badge bg-info me-1">{nome}</span>
                                <span class="badge bg-warning me-1">{preco}€</span>
                                <span class="badge bg-success me-1">Qtd: {quantidade}</span>
                            </div>
                        ))}
                        <br />
                    </div>

                    <h3 class="text-price">{parseFloat(receita.prescTotal).toFixed(2)}€</h3>
                </div>
            </div>
        </div>
    );
}
function Historico() {
    const [receitaList, setReceitaList] = useState([]);
    console.log(url);
    const navigate = useNavigate();
    function handleQRButtonClick() {
        navigate("/QRScanner");
    }
    function handleDashboardClick() {
        navigate("/Dashboard");
    }
    const getData = async () => {
        try {
          const response = await axios.get(url + '/api/my_get_from_historico/');
          const receitaData = response.data;
          const newReceitaList = receitaData.map(data => new Receita(data));
          setReceitaList([...receitaList, ...newReceitaList]);
          console.log(newReceitaList);
          return newReceitaList;
        } catch (error) {
          console.error(error);
        }
      };
    
    //getData();
    useEffect(() => {
        getData();
    }, []);    
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <img src={require('./img/logo.png')} class="rounded-circle" height="55" loading="lazy" />
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="bi bi-list"></i>
                    </button>
                    <div class="collapse navbar-collapse navbar-items" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto m-20 mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={handleDashboardClick}><i class="bi bi-house-door-fill"></i> DASHBOARD</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={handleQRButtonClick}><i className="bi bi-qr-code"></i> LER RECEITA</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class="bi bi-credit-card"></i> HISTÓRICO DE COMPRAS</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class="bi bi-people-fill"></i> SOBRE NÓS</a>
                            </li>
                        </ul>

                    </div>
                    <div class="d-flex align-items-center">
                        
                        {/*<div class="userdiv">
                            <h1 class="username">{user.username}</h1>
                            <h1 class="userrole">Funcionário</h1>
                        </div>*/}
                        <img src={require('./img/user.png')} class="rounded-circle" height="55" loading="lazy" />
                    </div>
                </div>
            </nav>
            <div class="container-fluid card-container d-flex justify-content-center mt-50 mb-50">

                <div class="row">
                    {receitaList.map(renderMedicamentoCard)}
                </div>
            </div>
        </div>
    );
}
export default Historico;
