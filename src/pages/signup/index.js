"use client";
import styles from "../styles/signupWrapper.module.css";
import Navbar from "../../components/Navbar";
import cover from '../../assests/img/ship-cover-5.jpg'
import logo from '../../assests/img/logo.png'
import Radio from '@mui/material/Radio';
import { Link, useNavigate } from "react-router-dom";
import countires from '../../output-country.json'
import countryCode from '../../countrycode.json'
import { Form, Input, Button, FormGroup, Alert, Row, Col, Spinner, Label } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { config } from "../../config";
import HomeOutlinedIcon  from '@mui/icons-material/HomeOutlined';

const Signup = () => {
  const navigate = useNavigate();
  const [isSumbitLoading, setIsSumbitLoading] = useState(false);
  const [selectUserType, setSelectUserType] = useState('shipManager');
  const [formData, setFormData] = useState({
    companyName: "",
    countryCode: "+91",
    contactNumber: "",
    companyEmail: "",
    Country: "India",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const showAlert = (message) => {
    setErrorMessage(message);
  };

  const hideAlert = () => {
    setErrorMessage(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeRadio = (event) => {
    setSelectUserType(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
            alert(`Please provide all the required fields`);
            return; // Found a key with no value
          }
        }
      }

      if (!/^[0-9]+$/.test(formData.contactNumber)) {
        alert("Contact number must be an integer.");
        return; // Prevent form submission
      }

      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
          formData.companyEmail
        )
      ) {
        alert("Invalid email format.");
        return; // Prevent form submission
      }
      setIsSumbitLoading(true);
      formData.contactNumber = formData.countryCode + formData.contactNumber
      formData.userType = selectUserType
      await axios.post(`${config.api_base_url}/signup`, { formData })
        .then(res => {
          setIsSumbitLoading(false);
          navigate("/app/approval-pending");
        }).catch(err => {
          showAlert(err.response.data.message)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
          setIsSumbitLoading(false);
        })
    } catch (error) {
      setIsSumbitLoading(false);
      console.error("Error:", error);
      if (error.response.data.message) {
        showAlert(error.response.data.message)
      }
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className={styles.signupWrapper}>
        <div className={styles.title}>
          <img src={cover} alt="log" className='signup-cover' />
        </div>
        <div className={styles.signupRight}>
          <div style={{padding: '6px'}}>
          <a href="https://www.aqueongroup.com/" target="_blank" rel="noopener noreferrer">
            <HomeOutlinedIcon  style={{color: '#4ab9cf'}} />
          </a>

          </div>
          <Form className={styles.registrationForm}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={logo} alt="log" className='logo-image' />
              <span className='signup-register' style={{ fontWeight: "bolder", fontSize: "35px" }}>Welcome to Aqueon</span>
              <span className='signup-register' style={{ color: "gray", fontSize: "18px" }}>Register to create a account in aqueon</span>
            </div>

            <div className={styles.formSectionOne}>
              <div className={styles.formGroup}>
                <Alert color="danger" isOpen={errorMessage !== null} toggle={hideAlert}>
                  {errorMessage}
                </Alert>
                <Row style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                    <label>How do you want to use Aqueon?</label>
                    <Col sm="6">
                      <div
                        onClick={() => setSelectUserType('shipManager')}
                        style={{ cursor: "pointer" }}
                        className="signup-type-box"
                      >
                        <Radio
                          checked={selectUserType === 'shipManager'}
                          onChange={handleChangeRadio}
                          value="shipManager"
                          name="radio-buttons"
                        />
                        <label>Ship Manager</label>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div
                        onClick={() => setSelectUserType('serviceSupplier')}
                        className="signup-type-box"
                        style={{ cursor: "pointer" }}
                      >
                        <Radio
                          checked={selectUserType === 'serviceSupplier'}
                          onChange={handleChangeRadio}
                          value="serviceSupplier"
                          name="radio-buttons"
                        />
                        <label>Service Supplier</label>
                      </div>
                    </Col>
                </Row>
                <Row style={{ marginTop: '1rem' }}>
                  <Col>
                    <label>Company Name</label>
                    <Input
                      type="text"
                      id="companyName"
                      name="companyName"
                      placeholder="Company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: '1rem' }}>
                  <Col>
                    <label>Company Email</label>
                    <Input
                      type="email"
                      id="companyEmail"
                      name="companyEmail"
                      placeholder="Company email"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col>
                    <label>Country</label>
                    <Input
                      id="exampleSelect"
                      value={formData.Country}
                      type="select"
                      name="Country"
                      onChange={handleChange}
                    >
                      {countires.map((each, index) => <option key={index}>{each}</option>)}
                    </Input>
                  </Col>
                </Row>
                <Row style={{ marginTop: '1rem' }}>
                  <Col sm="2">
                    <label>Code</label>
                    <Input
                      id="exampleSelect"
                      value={formData.countryCode}
                      type="select"
                      name="countryCode"
                      onChange={handleChange}
                    >
                      {countryCode.map((each, index) => <option key={index}>{each.dial_code}</option>)}
                    </Input>
                  </Col>
                  <Col>
                    <label>Contact Number</label>
                    <Input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="Contact number"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      pattern="[0-9]+"
                      required
                    />
                  </Col>
                 
                </Row>
              </div>
              <Button
                className={styles.registerButton}
                size="lg"
                onClick={handleSubmit}
              >
                {
                  isSumbitLoading &&
                  <Spinner size="sm">
                  </Spinner>
                }
                <span>
                  {' '}Register
                </span>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Signup;
