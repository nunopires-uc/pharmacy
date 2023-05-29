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
import { url } from './index';
import useFetchData from './Authentication/fetchMedicamentos';

class Medicamento {
    constructor(nome, nomeGenerico, imagem, dosagens, formato, administracao, marca, id, preco) {
        this.nome = nome;
        this.nomeGenerico = nomeGenerico;
        this.imagem = imagem;
        this.dosagens = dosagens;
        this.formato = formato;
        this.administracao = administracao;
        this.marca = marca;
        this.id = id;
        this.preco = preco;
    }
}

const medicamento1 = new Medicamento("Paracetamol", "Tylenol", "https://www.tylenol.com/sites/tylenol_us/files/styles/product_image/public/product-images/microsoftteams-image_1.png", [100, 200, 500], "Comprimido", "Via oral", "Marca1", 1, 6.5);

const medicamento2 = new Medicamento("Ibuprofeno", "Advil", "https://cdn-cosmos.bluesoft.com.br/products/7891045164184", [200, 400, 600], "Comprimido", "oral", "Marca2", 2, 4);

const medicamento3 = new Medicamento("Amoxicilina", "Amoxil", "https://s3.amazonaws.com/bsalemarket/65988/product/MEDGLA15137medgla15137.png", [100, 200, 500], "Cápsula", "oral", "Marca3", 3, 5.5);

const medicamento4 = new Medicamento("Losartana", "Cozaar", "https://santaluciadrogaria.vtexassets.com/arquivos/ids/156627/7897337706384.png?v=637637969114470000", [100, 200, 500], "Comprimido", "oral", "Marca4", 4, 2.50);

const medicamento5 = new Medicamento("Metformina", "Glucophage", "https://medvacc.com/wp-content/uploads/2021/03/1_1520742233.png", [100, 200, 500], "Comprimido", "oral", "Marca5", 5, 10.50);

const medicamento6 = new Medicamento("Atorvastatina", "Lipitor", "https://products.dawaai.pk/2014/05/489/zoom/pfilip489_201613477106.png", [100, 200, 500], "Comprimido", "oral", "Marca6", 6, 24.5);


function renderMedicamentoCard(medicamento) {
    return (
        <div class="col-md-4 col-lg-4 col-sm-6 col-xl-2 mt-2" key={medicamento.id}>
            <div class="card">
                <div class="card-body">
                <div class="card-img-wrapper">
                    <img src={medicamento.imagem} class="card-img img-fluid" alt={medicamento.nome} />
                </div>

                </div>

                <div class="card-body text-center">
                    <div class="mb-2">
                        <h6 class="font-weight-semibold mb-2">
                            <a href="#" class="text-default mb-2" data-abc="true">{medicamento.nomeGenerico}</a>
                        </h6>
                        {medicamento.dosagens.map((dose, index) => (
                            <span key={index} class="badge bg-info me-1">{dose}mg</span>
                        ))}
                        <br />
                        <h6 className='text-format'><i class="bi bi-capsule"></i> {medicamento.formato}</h6>
                        <h6 className='text-admin'><i class="bi bi-cup"></i> {medicamento.administracao}</h6>
                    </div>

                    <h3 class="text-price">{parseFloat(medicamento.preco).toFixed(2)}€</h3>

                    <div class="buy-favorite">
                        <button type="button" class="btn btn-primary btn-buy">Comprar</button>
                        <button type="button" class="btn btn-primary btn-favorite"><i class="bi bi-suit-heart-fill"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}



function Dashboard() {

    

    const navigate = useNavigate();

    function handleQRButtonClick() {
        navigate("/QRScanner");
    }

    function handleHistorico(){
        navigate("/Historico");
    }

    const [res, setRes] = useState("");
    const api = useAxios();


    console.log("here");
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await api.get("/test/");
                console.log(response.data.response);
                setRes(response.data.response);
            }catch{
                setRes("Error");
            }
        };
        fetchData();
    }, []);

    const {user, logoutUser} = useContext(AuthContext);

    const { data, loading, error } = useFetchData(url + '/api/dummy-data/');
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    //const medicamento1 = new Medicamento(data.Nome, data.Nome, "https://www.tylenol.com/sites/tylenol_us/files/styles/product_image/public/product-images/microsoftteams-image_1.png", [100, 200, 500], "Comprimido", "Via oral", "Marca1", 1, 6.5);

    const medicamentos = [medicamento1, medicamento2, medicamento3, medicamento4, medicamento5, medicamento6];


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
                                <a class="nav-link" href="#"><i class="bi bi-house-door-fill"></i> DASHBOARD</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={handleQRButtonClick}><i className="bi bi-qr-code"></i> LER RECEITA</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={handleHistorico}><i class="bi bi-credit-card"></i> HISTÓRICO DE COMPRAS</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class="bi bi-people-fill"></i> SOBRE NÓS</a>
                            </li>
                        </ul>

                    </div>

                    <div class="d-flex align-items-center">
                        
                        <div class="userdiv">
                            <h1 class="username">{user.username}</h1>
                            <h1 class="userrole">Funcionário</h1>
                        </div>

                        <img src={require('./img/user.png')} class="rounded-circle" height="55" loading="lazy" />
                    </div>

                </div>

            </nav>

            <div class="container-fluid card-container d-flex justify-content-center mt-50 mb-50">

                <div class="row">
                    {medicamentos.map(renderMedicamentoCard)}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
