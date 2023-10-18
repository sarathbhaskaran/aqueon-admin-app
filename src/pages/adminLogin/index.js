import './login.css';
import logo from '../../assets/logo.png'
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, FormGroup, Label, Alert } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { config } from "../../config";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const showAlert = (message) => {
    setErrorMessage(message);
  };

  const hideAlert = () => {
    setErrorMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
          formData.email
        )
      ) {
        alert("Invalid email format.");
        return; // Prevent form submission
      }
      await axios.post('/admin/login', formData).then(res => {

        const authObj = res.data;

        const jsonString = JSON.stringify(authObj);

        localStorage.setItem('authInfo', jsonString);

      })
      navigate("/app/dashboard");
    } catch (error) {
      console.error("User not found:", error.response.data.message);
      if(error.response.data.message) {
        showAlert(error.response.data.message)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2000);
      }
    }
  };

  return (
    <>
      <div className='log-in-wrapper'> 
      <div 
        className="login-box"
      >
      <img src={logo} alt="log" className='logo-image'/>   
      <h2 className="login-head" style={{ fontSize: "50px", fontWeight: "bolder", color: "#2E2E2E" }}>Welcome to Aqueon</h2>     
      <h2 className="login-head" style={{ fontWeight: "normal", fontSize: "30px", color: "#5C5C5C", marginBottom: "4rem" }}>Log in to continue</h2>  
      <Alert color="danger" isOpen={errorMessage !== null} toggle={hideAlert}>
        {errorMessage}
      </Alert>   
        <Form style={{ width: "100%"}}>
          <div className="">
            <div className='login-email'>
              <label>Company Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Type Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='login-pasword'>
              <label>Password</label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Type Your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              className="registerButton"
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <p style={{ marginTop: "10px"}}>
              Don't have account?
              <Link to="/app/signup">
                Sign up
              </Link>
            </p>
          </div>
        </Form>
      </div>
      </div>      
    </>
  );
};

export default AdminLogin;
