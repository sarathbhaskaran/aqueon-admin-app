import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import App from "./App";
import { Provider } from 'react-redux';
import store from './store';
import axios from 'axios'
import { config } from "../src/config";


const getAuthToken = () => { 
  const authObj = JSON.parse(localStorage.getItem('authInfo'))
  // console.log("authObj", authObj.data.token)
  if(authObj !== null) return authObj.data.token
  
}
axios.defaults.baseURL = config.api_base_url

axios.interceptors.request.use(
 async (config) => {
    // Get the JWT token
    const authToken = await getAuthToken();

    // If the token is available, add it to the Authorization header
    if (authToken) {

      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with the request error
    return Promise.reject(error);
  }
);


ReactDOM.render(
  <Provider store={store}>

  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </Provider>,

  document.getElementById("root")
);