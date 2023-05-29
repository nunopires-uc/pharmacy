import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from 'react-router-dom';
import AuthContext from './Authentication/AuthContext';
import axios from 'axios';
import { url } from './index';
import { useNavigate } from 'react-router-dom';

const pagarFace = "http://localhost:8000/api/inserir-receita-pago/";

const FaceRecognition = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const receita = location.state?.receita || "No data";
    console.log(receita);
    console.log(JSON.stringify(receita, null, 2));


    const videoRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
            await faceapi.loadFaceLandmarkModel(MODEL_URL);
            await faceapi.loadFaceExpressionModel(MODEL_URL);
        };

        const startVideo = async () => {
            const videoEl = videoRef.current;
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoEl.srcObject = stream;
                })
                .catch((err) => {
                    console.error(err);
                });
        };

        const captureImageAsBlob = (videoElement) => {
            return new Promise((resolve) => {
              const canvas = document.createElement('canvas');
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
          
              const ctx = canvas.getContext('2d');
              ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          
              canvas.toBlob((blob) => {
                resolve(blob);
              }, 'image/jpeg', 0.95); // Adjust the image format and quality as needed
            });
          };

        const sendDataToDjango = async (data) => {
        try {
            const result = await axios.post(url + "api/inserir-receita-pago/", data, {
            headers: {
                'Content-Type': 'application/json'
            }
            });
            alert('Pagamento feito com sucesso!');
            navigate('/Dashboard')
            //alert('Pagamento feito com sucesso!');
        } catch (error) {
            // Handle error cases
        }
        };
          

        const detectFaces = async () => {
            const videoEl = videoRef.current;
            const displaySize = { width: videoEl.width, height: videoEl.height };
            setInterval(async () => {
                const detections = await faceapi
                    .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                if (detections) {
                    const imageBlob = await captureImageAsBlob(videoEl);
                    console.log(imageBlob)
                    receita.pago = 1;
                    console.log(receita);
                    sendDataToDjango(receita);
                }
            }, 100);
        };

        loadModels()
            .then(startVideo)
            .then(detectFaces);
    }, []);

    return <video ref={videoRef} autoPlay muted />;
};

export default FaceRecognition;
