import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AuthContext from './Authentication/AuthContext';
import axios from 'axios';
import { url } from './index';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import "./Prescription.css";
import "./Fonts.css"
import './material-icons.css';

//{"idReceita":1,"medList":[{"id":1,"quantidade":3},{"id":2,"quantidade":1},{"id":3,"quantidade":2}],"userName":"Manuel Fernandes","userID":123456789}


function renderIconFromFormat(format){
    if(format === "Comprimido"){
        return <i class="bi bi-capsule"></i>; //Comprimido
    } 
    else if(format === "Injeção") {
        return <span class="material-icons">vaccines</span>; //Injeção
    } 
    else if(format === "Cápsula") {
        return <i class="bi bi-capsule"></i>; //Cápsula
    }
    else if(format === "Líquido") {
        return <span class="material-icons">medication_liquid</span>; //Cápsula
    }
    else {
        return;
    }
}



function renderMedicamentoCard(medicamento, handleGenericoChange, genericoStates) {

    const genericoState = genericoStates.find((item) => item.id === medicamento.id);
    //console.log('Medicamento:', medicamento);
    //console.log('Dosagens:', medicamento.dosagens);
    return (
        <div class="col-md-4 col-lg-4 col-sm-6 col-xl-2 mt-2" key={medicamento.id}>
            <div class="card">
                <div class="card-body">
                <div class="card-img-wrapper">
                    <img src={medicamento.imagem.S} class="card-img img-fluid" alt={medicamento.nome.S} />
                </div>

                </div>

                <div class="card-body text-center">
                    <div class="mb-2">
                        <h6 class="font-weight-semibold mb-2">
                            <a href="#" class="text-default mb-2" data-abc="true">{genericoState.nome}</a>
                        </h6>
                        {
                        medicamento.dosagens.NS.map((dosagem, index) => {
                        return (
                            <span key={index} className="badge bg-info me-1">
                            {dosagem}mg
                            </span>
                        );
                        })
                        }

                        <br />
                        <h6 className='text-format'>{renderIconFromFormat(medicamento.formato.S)} {medicamento.formato.S}</h6>
                        <h6 className='text-admin'><i class="bi bi-cup"></i> {medicamento.administracao.S}</h6>
                        <h6 className='text-admin'> Quantidade: {medicamento.quantidade}</h6>
                        {
                        medicamento.generico === 'se' && (
                            <div className="mb-2">
                                <input type="checkbox"
                                    id={`generico-${medicamento.id}`}
                                    onChange={(event) => handleGenericoChange(event, medicamento.id)}/>
                                <label htmlFor={`generico-${medicamento.id}`}>&nbsp;Genérico</label>
                            </div>)
                        }
                    </div>
                    <h3 class="text-price">{parseFloat(genericoState.preco).toFixed(2)}€</h3>
                </div>
            </div>
        </div>
    );
}



function Prescription() {
    const location = useLocation();
    const addQuantidadeToMedicamento = (medicamento, quantidade) => {
        return {
          ...medicamento,
          quantidade: quantidade,
        };
      };
    const medicamentos = location.state?.prescriptionData || "No data";
    console.log("Medicamentos:", medicamentos);
    const receita = JSON.parse(location.state?.pdata) || "No data";
    const medicamentosWithQuantidade = medicamentos.map((medicamento, i) => {
    const quantidade = receita.medList[i].quantidade;
    console.log(JSON.stringify(receita, null, 2));
    return {
        ...medicamento,
        quantidade: quantidade,
    };
    });

    //console.log("Medicamentos_ATU:", medicamentosWithQuantidade);

    const [checkedState, setCheckedState] = useState(
        new Array(medicamentos.length).fill(false)
    );


    const [genericoStates, setGenericoStates] = useState(
        medicamentosWithQuantidade.map((medicamento) => ({
            ...medicamento,
            isChecked: false,
            preco: medicamento.preco.N,
            originalPreco: medicamento.preco.N,
            nome: medicamento.nome.S,
            nomeOriginal: medicamento.nome.S
        }))
    );
    
    
      
    const handleGenericoChange = (event, medicamentoId) => {
        const isChecked = event.target.checked;
        setGenericoStates(
            genericoStates.map((medicamento) => {
                if (medicamento.id === medicamentoId) {
                    return {
                        ...medicamento,
                        isChecked,
                        preco: isChecked ? medicamento.genericopreco : medicamento.originalPreco,
                        nome: isChecked ? medicamento.nomeGenerico.S : medicamento.nomeOriginal, 
                    };
                }
                return medicamento;
            })
        );
    };

    var prescTotal = 0
    for (let i = 0; i < receita.medList.length; i++) {
        const medicamento = medicamentosWithQuantidade[i];
        const quantidade = receita.medList[i].quantidade;
        const preco = medicamento.preco.N;
        const genericopreco = medicamento.genericopreco;
        
        // Find the corresponding generico state for the medicamento
        const genericoState = genericoStates.find((item) => item.id === medicamento.id);
        
        // Determine the price to use based on the isChecked property
        const priceToUse = genericoState.isChecked ? genericopreco : preco;
        
        prescTotal += priceToUse * quantidade;
    }
    
    //console.log("~~~Total", );

    const navigate = useNavigate();

    function handleQRButtonClick() {
        navigate("/QRScanner");
    }

    function handleHistorico(){
        navigate("/Historico");
    }

    function handleDashboardClick(){
        navigate("/Dashboard");
    }

    function filterGenericoStates(genericoStates, prescTotal, receita) {
        const medListWithPrecoAndNome = receita.medList.map((item) => {
            const medicamento = genericoStates.find((med) => med.id === item.id);
            return {
                ...item,
                preco: medicamento.preco, // assuming medicamento has a preco field
                nome: medicamento.nome, // assuming medicamento has a nome field
            };
        });
    
        receita.medList = medListWithPrecoAndNome;
    
        return genericoStates.map((medicamento) => {
            const filteredMedicamento = { ...medicamento };
            delete filteredMedicamento.nomeGenerico;
            delete filteredMedicamento.imagem;
            delete filteredMedicamento.dosagens;
            delete filteredMedicamento.formato;
            delete filteredMedicamento.administracao;
            delete filteredMedicamento.generico;
            filteredMedicamento.prescTotal = prescTotal;
            filteredMedicamento.idReceita = receita.idReceita;
            filteredMedicamento.userID = receita.userID;
            filteredMedicamento.userName = receita.userName;
            filteredMedicamento.pago = 0;
    
            return filteredMedicamento;
        });
    }
    
    
    

    function genericoStatesToJSON(prescTotal, receita) {
        const filteredGenericoStates = filterGenericoStates(genericoStates, prescTotal, receita);
        receita.prescTotal = prescTotal;
        receita.pago = 0;
        navigate("/FaceRecognition", { state: { receita: receita }});

        //sendDataToDjango(receita);
        //console.log(JSON.stringify(receita));
        //console.log(receita);
        //return JSON.stringify(receita, null, 2);
    }


    const sendDataToDjango = async (data) => {
        try {
          const result = await axios.post(url + "api/inserir-receita-pago/", data, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Success:', result);
        } catch (error) {
          // Handle error cases
        }
      };
      
        

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
                                <a class="nav-link" href="#" onClick={handleHistorico}><i class="bi bi-credit-card"></i> HISTÓRICO DE COMPRAS</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#"><i class="bi bi-people-fill"></i> SOBRE NÓS</a>
                            </li>
                        </ul>

                    </div>

                    <div class="d-flex align-items-center">
                        
                        <div class="userdiv">
                            <h1 class="username">John Pork</h1>
                            <h1 class="userrole">Funcionário</h1>
                        </div>

                        <img src={require('./img/user.png')} class="rounded-circle" height="55" loading="lazy" />
                    </div>
                </div>
            </nav>
            
            <h1 class="presc-title">Prescrição médica de <span class="presc-user">{receita["userName"]}</span> <span class="presc-number">({receita["userID"]})</span></h1>
            <h1 class="presc-subtitle">{receita.length} produtos - <span>{prescTotal.toFixed(2)}€</span></h1>
            <div class="container-fluid card-container d-flex justify-content-center mt-50 mb-50">
                
                <div class="row">
                    {/*medicamentosWithQuantidade.map(renderMedicamentoCard, handleGenericoChange)*/}
                    {medicamentosWithQuantidade.map((medicamento) =>
                        renderMedicamentoCard(medicamento, handleGenericoChange, genericoStates)
                    )}
                </div>
            </div>

            <button class="btn finalize-button" onClick={() => console.log(genericoStatesToJSON(prescTotal, receita))}>
                Finalizar <i class="bi bi-bag-check-fill"></i>
            </button>
        </div>
    );
}

//<button class="btn finalize-button" onClick={handleFinalize}>Finalizar <i class="bi bi-bag-check-fill"></i></button>

export default Prescription;
