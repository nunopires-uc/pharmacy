import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';



function QRCodeGenerator() {
    
    //const jsonObject = {"medList":[{"nome":"Paracetamol","nomeGenerico":"Tylenolaaaaaaaaaaa","imagem":"https://www.tylenol.com/sites/tylenol_us/files/styles/product_image/public/product-images/microsoftteams-image_1.png","dosagens":[100,200,500],"formato":"Comprimido","administracao":"Via oral","marca":"Marca1","id":1,"preco":600.5},{"nome":"Ibuprofeno","nomeGenerico":"Advil","imagem":"https://cdn-cosmos.bluesoft.com.br/products/7891045164184","dosagens":[200,400,600],"formato":"Comprimido","administracao":"oral","marca":"Marca2","id":2,"preco":4},{"nome":"Amoxicilina","nomeGenerico":"Amoxil","imagem":"https://s3.amazonaws.com/bsalemarket/65988/product/MEDGLA15137medgla15137.png","dosagens":[100,200,500],"formato":"Cápsula","administracao":"oral","marca":"Marca3","id":3,"preco":5.5},{"nome":"Losartana","nomeGenerico":"Cozaar","imagem":"https://santaluciadrogaria.vtexassets.com/arquivos/ids/156627/7897337706384.png?v=637637969114470000","dosagens":[100,200,500],"formato":"Comprimido","administracao":"oral","marca":"Marca4","id":4,"preco":2.5},{"nome":"Metformina","nomeGenerico":"Glucophage","imagem":"https://medvacc.com/wp-content/uploads/2021/03/1_1520742233.png","dosagens":[100,200,500],"formato":"Comprimido","administracao":"oral","marca":"Marca5","id":5,"preco":10.5},{"nome":"Atorvastatina","nomeGenerico":"Lipitor","imagem":"https://products.dawaai.pk/2014/05/489/zoom/pfilip489_201613477106.png","dosagens":[100,200,500],"formato":"Comprimido","administracao":"oral","marca":"Marca6","id":6,"preco":24.5}],"userName":"João Pork","userID":123456789}


    const jsonObject = {"idReceita":1, "medList":[{"id":1,"quantidade": 3},{"id":2,"quantidade": 1},{"id":3,"quantidade": 2},],"userName":"Manuel Fernandes","userID":123456789}
    const canvasRef = useRef();

    useEffect(() => {
        const generateQR = async () => {
            const jsonString = JSON.stringify(jsonObject);
            await QRCode.toCanvas(canvasRef.current, jsonString);
        };

        generateQR();
    }, [jsonObject]);
  
    return (
        <canvas ref={canvasRef}></canvas>
    );
  }
  

  export default QRCodeGenerator;