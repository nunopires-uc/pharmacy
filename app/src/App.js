import React from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import QRScanner from './QRScanner';
import Prescription from './Prescription';
import QRCodeGenerator from './QRCodeGenerator';
import FaceRecognition from './FaceRecognition';
import { AuthProvider } from './Authentication/AuthContext';
import PrivateRoute from './Authentication/PrivateRoute';
import Historico from './Historico';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            path="/Dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route path="/QRScanner" element={<QRScanner />} />
          <Route path="/Prescription" element={<Prescription />} />
          <Route path="/QRCodeGenerator" element={<QRCodeGenerator />} />
          <Route path="/FaceRecognition" element={<FaceRecognition />} />
          <Route path="/Historico" element={<Historico />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;