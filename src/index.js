import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios'
import { config } from "../src/config";

// const getAuthToken = () => { 
//   const authObj = JSON.parse(localStorage.getItem('authInfo'))
//   // console.log("authObj", authObj.data.token)
//   if(authObj !== null) return authObj.data.token
  
// }

axios.defaults.baseURL = config.api_base_url

// axios.interceptors.request.use(
//  async (config) => {
//     // Get the JWT token
//     const authToken = await getAuthToken();

//     // If the token is available, add it to the Authorization header
//     if (authToken) {

//       config.headers.Authorization = `Bearer ${authToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with the request error
//     return Promise.reject(error);
//   }
// );


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
