import styles from "../styles/signupWrapper.module.css";
import logo from '../../assests/img/logo.png'
import Navbar from "../../components/Navbar";
import Radio from '@mui/material/Radio';
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, FormGroup, Label, Alert, Row, Col } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { config } from "../../config";
import { useDispatch, connect } from "react-redux";

const AdminLogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [selectUserType, setSelectUserType] = useState('shipManager');
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
      // if (
      //   !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
      //     formData.email
      //   )
      // ) {
      //   alert("Invalid email format.");
      //   return; // Prevent form submission
      // }
      // formData.userType = selectUserType
      await axios.post(`${config.api_base_url}/admin/login`, formData).then(res => {
        
        const authObj = res.data;
        // dispatch({type: 'USER_TYPE', payload: authObj.data.userType })

        const jsonString = JSON.stringify(authObj);
        localStorage.setItem('authInfo', jsonString);

      })
      navigate("/admin/dashboard");
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
      {/* <Navbar /> */}
      <div className='log-in-wrapper'>
        <div
          className="login-box"
        >
          <img src={logo} alt="log" className='logo-image' />
          <h2 className="login-head" style={{ fontWeight: "normal", fontSize: "25px", color: "#5C5C5C", marginBottom: "4rem" }}>Log in to continue</h2>
          <Alert color="danger" isOpen={errorMessage !== null} toggle={hideAlert}>
            {errorMessage}
          </Alert>
          <Form style={{ width: "100%" }}>
            <div className="">
              <div className='login-email'>
                <label>User Name</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Type Your User Name"
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
                className={styles.registerButton}
                onClick={handleSubmit}
              >
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AdminLogIn;
