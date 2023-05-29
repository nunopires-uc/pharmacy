import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './Authentication/AuthContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './QRScanner.css';
import './Fonts.css';
import { url } from './index';

import qrFrame from './img/qr_frame.png';
import qrFrameSuccess from './img/qr_frame_success.png';


const sendDataToDjango = async (data) => {
  try {
    //const json = JSON.stringify(data);
    const result = await axios.post(url + "api/receita-qrcode/", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("here1");
    //console.log(result);

    //console.log("Type of result:", typeof result);
    console.log("Response data:", result.data);

    const bodyArray = result.data.result.body;
    
    if (!Array.isArray(bodyArray)) {
      console.error('bodyArray is not an array');
      return;
    }

    const medicamentos = bodyArray.map(item => {
      return new Medicamento(
        item.nome,
        item.nomeGenerico,
        item.imagem,
        item.dosagens,
        item.formato,
        item.administracao,
        item.marca,
        item.id,
        item.preco,
        item.generico,
        item.genericopreco,
      );
    });

  // Now you have an array of Medicamento objects
  console.log("-------------------");
  console.log(medicamentos);
  console.log("yX");
  console.log(typeof(medicamentos));
  return medicamentos;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      console.log('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message:', error.message);
    }
    console.log('Error config:', error.config);
  }
};




// Assume you have a function to read QR code data dynamically
const readQRCode = async (data) => {
  // Code to read QR code and extract data
  //const qrCodeData = JSON.parse('{"idReceita":1,"medList":[{"id":1,"quantidade":3},{"id":2,"quantidade":1},{"id":3,"quantidade":2}],"userName":"Manuel Fernandes","userID":123456789}');
  const qrCodeData = JSON.parse(data);
  const medicamentos = await sendDataToDjango(qrCodeData);
  return medicamentos;
};

//readQRCode();


const sendQRCodeData = async (data) => {
  try {
    const response = await axios.post(url + '/api/receita-qrcode/', data);
    console.log("here");
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};



//----------------------------------------------------------------------------------//

class Medicamento {
  constructor(nome, nomeGenerico, imagem, dosagens, formato, administracao, marca, id, preco, generico, genericopreco) {
      this.nome = nome;
      this.nomeGenerico = nomeGenerico;
      this.imagem = imagem;
      this.dosagens = dosagens;
      this.formato = formato;
      this.administracao = administracao;
      this.marca = marca;
      this.id = id;
      this.preco = preco;
      this.generico = generico;
      this.genericopreco = genericopreco;
  }
}

/*const medicamento1 = new Medicamento("Paracetamol", "Tylenol", "https://www.tylenol.com/sites/tylenol_us/files/styles/product_image/public/product-images/microsoftteams-image_1.png", [100, 200, 500], "Comprimido", "Via oral", "Marca1", 1, 6.5);
const medicamento2 = new Medicamento("Ibuprofeno", "Advil", "https://cdn-cosmos.bluesoft.com.br/products/7891045164184", [200, 400, 600], "Comprimido", "oral", "Marca2", 2, 4);
const medicamento3 = new Medicamento("Amoxicilina", "Amoxil", "https://s3.amazonaws.com/bsalemarket/65988/product/MEDGLA15137medgla15137.png", [100, 200, 500], "Cápsula", "oral", "Marca3", 3, 5.5);
const medicamento4 = new Medicamento("Losartana", "Cozaar", "https://santaluciadrogaria.vtexassets.com/arquivos/ids/156627/7897337706384.png?v=637637969114470000", [100, 200, 500], "Comprimido", "oral", "Marca4", 4, 2.50);
const medicamento5 = new Medicamento("Metformina", "Glucophage", "https://medvacc.com/wp-content/uploads/2021/03/1_1520742233.png", [100, 200, 500], "Comprimido", "oral", "Marca5", 5, 10.50);
const medicamento6 = new Medicamento("Atorvastatina", "Lipitor", "https://products.dawaai.pk/2014/05/489/zoom/pfilip489_201613477106.png", [100, 200, 500], "Comprimido", "oral", "Marca6", 6, 24.5);

const medicamentos = [medicamento1, medicamento2, medicamento3, medicamento4, medicamento5, medicamento6]
*/
/*class Prescription {
  constructor(medList, userName, userID) {
    this.medList = medList;
    this.userName = userName;
    this.userID = userID
  }
}*/

//const prescription = new Prescription(medicamentos, "João Pork", 123456789);


//const obj = JSON.stringify(prescription);

//console.log(obj)

//----------------------------------------------------------------------------------//



function QRScanner() {

    //const {user, logoutUser} = useContext(AuthContext);

    const [result, setResult] = useState('No result');
    const [mediaStreamObj, setMediaStreamObj] = useState(null);
    const [imgSrc, setImgSrc] = useState(qrFrame);

    const navigate = useNavigate();




    //nem sei bem oq isto faz mas deixou de dar erro
    useEffect(() => {
        
        return () => {
            if (mediaStreamObj) {
                mediaStreamObj.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStreamObj]);


    /*
    const funfex = async () => {
      const data = {"idReceita":1,"medList":[{"id":1,"quantidade":3},{"id":2,"quantidade":1},{"id":3,"quantidade":2}],"userName":"Manuel Fernandes","userID":123456789}
      data.text = JSON.stringify(data);
      setResult(data.text);
      setImgSrc(qrFrameSuccess);
      const medicamentos = await readQRCode(data.text);
      console.log(medicamentos);
    }

    funfex();*/
    
    
    
    const handleScan = async (data) => {

        //data = {"idReceita":1,"medList":[{"id":1,"quantidade":3},{"id":2,"quantidade":1},{"id":3,"quantidade":2}],"userName":"Manuel Fernandes","userID":123456789}
        if (data) {
          console.log(data);
          console.log(typeof(data));
          console.log(data.text);
          console.log(typeof(data.text));
  
          setResult(data.text);
  
          setImgSrc(qrFrameSuccess);
          const medicamentos = await sendDataToDjango(data.text);
          console.log(medicamentos);
          console.log("´RX");
          console.log(Array.isArray(medicamentos));

            //data.text = {"idReceita":1,"medList":[{"id":1,"quantidade":3},{"id":2,"quantidade":1},{"id":3,"quantidade":2}],"userName":"Manuel Fernandes","userID":123456789}
          navigate("/Prescription", { state: { prescriptionData: medicamentos, pdata: data.text }});

        } else {
            console.log("Error reading data!");
        }
    };

    const handleError = err => {
        console.error(err);
    };


  

  return (
    <div className="main col-lg-8 col-md-12 col-sm-12 col-xl-8 col-xxl-5">
      <h1 className="title">
        <i className="bi bi-qr-code"></i> Faça o scan do seu código QR!<i className="bi bi-qr-code"></i>
      </h1>
      <h3 className="subtitle">Utilize o seu telemóvel para fazer scan do código QR com a sua receita médica!</h3>
      <div className="video-container">
        <div className="videosource">
          {<QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />}
          <p>{result}</p>
        </div>
        <img src={imgSrc} className="frame-overlay" />
      </div>
    </div>
  );
}

export default QRScanner;













//-------------------------------------------------------------------------------------------------------//

