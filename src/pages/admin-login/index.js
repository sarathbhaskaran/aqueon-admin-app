"use client"
import styles from "../styles/signupWrapper.module.css";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom"
import { Form, Input, Button } from "reactstrap"
import axios from 'axios';
import { useState } from 'react';
import { config } from "../../config";


const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
   
    email: '',
    password: '',
 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${config.api_base_url}/admin-login`, {formData}, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you may need, e.g., authentication tokens.
        },
      });
      // Handle the response data as needed.
      navigate('/approval-pending')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  return (
    <>
      <Navbar />
      <div className={styles.signupWrapper}>
        <div className={styles.title}>
        <h1>Login As <span>Admin</span></h1>
        </div>
        <Form className={styles.registrationForm}>
          <div className={styles.formSectionOne}>
         
            <div className={styles.formGroup}>
              <label>Company Email</label>

              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>

              <Input
                type="email"
                id="password"
                name="password"
                placeholder="Personal email"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

        
        </Form>
        <div className={styles.submitButtonWrapper}>
          <Button type="submit" className={styles.registerButton} onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
