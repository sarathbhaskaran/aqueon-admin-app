import React, { useState, useEffect } from "react";
import {
    Button,
    Row,
    Col,
    Input,
    Label,
    Spinner,
} from "reactstrap";
// import CountryDropdown from "../../components/CountryDropdown";
import countires from '../../output-country.json'

import axios from "axios";

const BillingTab = () => {

    const [inputData, setInputData] = useState({
        companyName: '',
        emailId: '',
        country: 'India',
        contactNumber: '',
        taxVat: '',
        address: '',
        accountNumber: '',
        bankName: '',
        postalCode: '',
        branchName: '',
        ifscCode: ''
    });
    const [isSumbitLoading, setIsSumbitLoading] = useState(false);

    useEffect(() => {
        axios.get('/vendors/billing-addres')
            .then(res => {
                const { companyName, emailId, ifscCode, country, branchName, contactNumber, bankName, address, postalCode, taxVat, accountNumber } = res.data.data[0];
                setInputData({
                    companyName, emailId, country, ifscCode, contactNumber, branchName, bankName, address, postalCode, taxVat, accountNumber
                })
            })
            .catch(err => {
                console.log(err)
                alert("Error")
            })
    }, []);


    const uploadBillingDetails = async () => {
        if(!inputData.accountNumber) return alert('Please fill bank account number')
        if(!inputData.bankName) return alert('Please fill bank bank name')
        if(!inputData.address) return alert('Please fill address')

        setIsSumbitLoading(true);
        await axios.post('/upload-billing-details', { inputData })
            .then(res => {
                setIsSumbitLoading(false);
            })
            .catch(err => {
                console.log(err)
                setIsSumbitLoading(false);
            })
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInputData({
            ...inputData,
            [name]: value,
        });
    };


    return (
        <div>
            <div className="all-tabpane-container">
                <div style={{ padding: "10px" }}>
                    <h5>Billing Address</h5>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col sm="5">
                            <Label>Company Name</Label>
                            <Input
                                onChange={handleInput}
                                name="companyName"
                                size="sm"
                                value={inputData.companyName}
                            ></Input>
                        </Col>
                        <Col sm="5">
                            <Label>Country</Label>
                            <Input
                                id="exampleSelect"
                                value={inputData.country}
                                type="select"
                                name="country"
                                size={'sm'}
                                onChange={handleInput}
                            >
                                {countires.map((each, index) => <option key={index}>{each}</option>)}
                            </Input>                    </Col>
                    </Row>

                    <Row style={{ marginBottom: "10px" }}>
                        <Col sm="5">
                            <Label>Email Id</Label>
                            <Input
                                onChange={handleInput}
                                name="emailId"
                                size="sm"
                                value={inputData.emailId}
                            ></Input>
                        </Col>
                        <Col sm="5">
                            <Label>Contact Number</Label>
                            <Input
                                type="number"
                                onChange={handleInput}
                                size="sm"
                                name="contactNumber"
                                value={inputData.contactNumber}

                            ></Input>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: "10px" }}>
                        <Col sm="10">
                            <Label>Address</Label>
                            <Input
                                type="textarea"
                                onChange={handleInput}
                                placeholder={'address line 1.. \naddress line 2.. '}
                                name="address"
                                size="sm"
                                value={inputData.address}
                                style={{ paddingBottom: '40px'}}

                            ></Input>
                        </Col>
                        <Col sm="5">
                            <Label>Post code/zip code</Label>
                            <Input
                                onChange={handleInput}
                                name="postalCode"
                                size="sm"
                                value={inputData.postalCode}
                            ></Input>
                        </Col>
                    </Row>


                </div>
                <div style={{ padding: "10px", marginTop: "1rem" }}>
                    <h5>Bank Account </h5>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col sm="5">
                            <Label>Account number</Label>
                            <Input
                                type="number"
                                onChange={handleInput}
                                name="accountNumber"
                                size="sm"
                                value={inputData.accountNumber}

                            ></Input>
                        </Col>
                        <Col sm='5'>
                            <Label>Bank name</Label>
                            <Input
                                type="text"
                                onChange={handleInput}
                                name="bankName"
                                value={inputData.bankName}
                                size="sm"
                            ></Input>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col sm="5">
                            <Label>Branch name</Label>
                            <Input
                                type="text"
                                onChange={handleInput}
                                name="branchName"
                                value={inputData.branchName}
                                size="sm"
                            ></Input>
                        </Col>
                        <Col sm='5'>
                            <Label>IFSC/Iban/swift code</Label>
                            <Input
                                type="number"
                                onChange={handleInput}
                                name="ifscCode"
                                value={inputData.ifscCode}
                                size="sm"
                            ></Input>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col sm="5">
                            <Label>Tax/VAT (%)</Label>
                            <Input
                                type="number"
                                onChange={handleInput}
                                name="taxVat"
                                value={inputData.taxVat}
                                size="sm"
                            ></Input>
                        </Col>
                        <Col sm='5'></Col>
                    </Row>
                </div>
            </div>
            <Row className="info-submit">
                <Button color="primary" onClick={uploadBillingDetails}>
                    {
                        isSumbitLoading &&
                        <Spinner size="sm">
                        </Spinner>
                    }
                    <span>
                        Submit
                    </span>
                </Button>
            </Row>
        </div>
    )
}
export default BillingTab;