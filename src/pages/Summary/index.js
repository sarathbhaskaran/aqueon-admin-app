import React, { useState, useEffect } from "react";
import {
    Button,
    Row,
    Col,
    Input,
    Badge,
    h6,
    Spinner,
} from "reactstrap";
import { unstable_batchedUpdates } from "react-dom";

// import CountryDropdown from "../../components/CountryDropdown";
import countires from '../../output-country.json'

import axios from "axios";

const Summary = ({activeTab}) => {

    const CertificateData = [
        {
            id: 'classCertification',
            title: "Class Certification",
            certificates: []
        },
        {
            id: 'makersCertification',
            title: "Makers Certification",
            certificates: []
        },
        {
            id: 'isoCertification',
            title: "ISO Certification",
            certificates: []
        }
    ]

    const serviceList = [
        {
            heading: "Technical Services",
            services: [],
            id: 1
        },
        {
            heading: "Ship Design Services",
            services: [],
            id: 2

        },
        {
            heading: 'Spare Parts Supply',
            services: [],
            id: 3


        },
        {
            heading: 'Provision Supply',
            services: [],
            id: 4


        },
        {
            heading: "Servicing & Refilling",
            services: [],
            id: 5

        }
    ]

    const [subServices, setSubServices] = useState([])
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

    const [infoInputData, setInfoInputData] = useState({});
    const [isInfoLoading, setIsInfoLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedCertificates, setUploadedCertificates] = useState([])
    const [certificateData, setCertificateData] = useState(CertificateData)
    const [checkedServices, setCheckedServices] = useState([])
    const [addedServiceLocation, setAddedServiceLocation] = useState([]);





    const downloadBrochure = async () => {
        const filename = inputData.companyBrochures;
        // // Create a URL for the download endpoint on your Node.js API
        const downloadURL = '/vendor/download-brochure/${filename}';
        try {
            // Use Axios to send a GET request to the download URL
            const response = await axios.get(downloadURL, {
                responseType: 'blob', // Specify response type as 'blob' for binary data
            });
            // Create a temporary URL for the blob response
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            // Create an invisible link element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up the temporary URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }


    const fetchSummary = async () => {

        await axios.get('/vendor-services').then(res => {
            unstable_batchedUpdates(() => {
                setCheckedServices(res.data.vendorServices)
                setSubServices(res?.data?.services)
            })
        }).catch(err => {
            console.log(err)
        })

        await axios.get('/fetch-vendor-certificates')
            .then(res => {
                if (Array.isArray(res.data)) {
                    const clonedCertificateData = [...certificateData]
                    clonedCertificateData.map(each => {
                        res.data
                            .slice()
                            .reverse()
                            .filter((certificate) => {
                                if (certificate.type === each.id) each.certificates.push(certificate)
                            })
                    })

                    setCertificateData(clonedCertificateData)
                }

                setUploadedCertificates(res.data)
            })
            .catch(err => {
                console.log("err", err)
                alert("Error fetching certificates")

            })

        await axios.get('/vendors/billing-addres')
            .then(res => {
                const { companyName, emailId, ifscCode, country, branchName, contactNumber, bankName, address, postalCode, taxVat, accountNumber } = res.data.data[0];
                setInputData({
                    companyName, emailId, country, ifscCode, contactNumber, branchName, bankName, address, postalCode, taxVat, accountNumber
                })
            })
            .catch(err => {
                console.log(err)
                alert("Error fetching billing address")
            })

        await axios.get('/vendors/profile/info')
            .then(res => {
                const { company_name, company_email, country, contact_number, personal_email, website, staff, companyDescriptions, companyBrochures, serviceLocation } = res.data.message;
                setInfoInputData({
                    companyName: company_name,
                    staff,
                    country,
                    contactNumber: contact_number,
                    primaryMailId: company_email,
                    accountingMailId: personal_email,
                    websites: website,
                    companyDescription: companyDescriptions,
                    companyBrochures
                })
                setAddedServiceLocation(serviceLocation ? serviceLocation : [])
                // setIsInfoLoading(false);
            })
            .catch(err => {
                alert("Error fetching profile info")
                // setIsInfoLoading(false);
            })
            setIsInfoLoading(false);
    }

    useEffect(() => {
        fetchSummary()
    }, []);

    const downloadCertificate = async (fileName) => {
        const filename = fileName;
        // // Create a URL for the download endpoint on your Node.js API
        const downloadURL = `/vendor/download-certificate/${filename}`;
        try {
            // Use Axios to send a GET request to the download URL
            const response = await axios.get(downloadURL, {
                responseType: 'blob', // Specify response type as 'blob' for binary data
            });
            // Create a temporary URL for the blob response
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            // Create an invisible link element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up the temporary URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }


    // const uploadBillingDetails = async () => {
    //     if(!inputData.accountNumber) return alert('Please fill bank account number')
    //     if(!inputData.bankName) return alert('Please fill bank bank name')
    //     if(!inputData.address) return alert('Please fill address')

    //     setIsSumbitLoading(true);
    //     await axios.post('/upload-billing-details', { inputData })
    //         .then(res => {
    //             console.log(res)
    //             setIsSumbitLoading(false);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             setIsSumbitLoading(false);
    //         })
    // }

    // const handleInput = (e) => {
    //     const { name, value } = e.target;
    //     setInputData({
    //         ...inputData,
    //         [name]: value,
    //     });
    // };

    if (isInfoLoading) {
        return (
            <div className="all-tabpane-container summary-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spinner
                    color="primary"
                    style={{
                        height: '3rem',
                        width: '3rem'
                    }}
                >
                    Loading...
                </Spinner>
            </div>
        )
    }

    return (
        <div className="all-tabpane-container summary-container">
            <div className="summary-division-one">
                <h4 style={{ marginBottom: '2rem' }}>1. Info</h4>
                <h5>Basic Details</h5>
                <Row>
                    <Row>
                        <Col>
                            <h6 size="sm">Company Name</h6>
                            {
                                infoInputData.companyName ?
                                    <p>{infoInputData.companyName}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col>
                            <h6 size="sm">Nationality</h6>
                            {
                                infoInputData.country ?
                                    <p>{infoInputData.country}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col>
                            <h6 size="sm">Staff Count</h6>
                            {
                                infoInputData.staff ?
                                    <p>{infoInputData.staff}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <h6 size="sm">Contact Number</h6>
                            {
                                infoInputData.contactNumber ?
                                    <p>{infoInputData.contactNumber}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col>
                            <h6 size="sm">Primary Mail Id</h6>
                            {
                                infoInputData.primaryMailId ?
                                    <p>{infoInputData.primaryMailId}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col>
                            <h6 size="sm">Accounting Mail Id</h6>
                            {
                                infoInputData.accountingMailId ?
                                    <p>{infoInputData.accountingMailId}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="4">
                            <h6 size="sm">Websites</h6>
                            {
                                infoInputData.websites ?
                                    <p>{infoInputData.websites}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                    </Row>
                </Row>

                <h5 style={{ marginTop: '10px' }}>Company details</h5>
                <Row>
                    <Col sm='4'>
                        <h6 size="sm">Company Description</h6>
                        {
                            infoInputData.companyDescription ?
                                <p>{infoInputData.companyDescription}</p>
                                :
                                <p style={{ color: 'gray' }}>---------</p>
                        }
                    </Col>
                    <Col sm='4'>
                        <h6 size="sm">Company Brochure</h6>
                        {
                            infoInputData.companyBrochures ?
                                <p>{infoInputData.companyBrochures}</p>
                                :
                                <p style={{ color: 'gray' }}>---------</p>
                        }

                        {/* {inputData.companyBrochures &&
                            <Row>
                                <Col sm="9">
                                    <Input
                                        type="text"
                                        id="fileInput"
                                        size="sm"
                                        disabled
                                        value={inputData.companyBrochures}
                                    />
                                </Col>
                                <Col sm="3">
                                    <Button
                                        onClick={downloadBrochure}
                                        size="sm"
                                        outline
                                        color="success"
                                    >
                                        View
                                    </Button>
                                </Col>
                            </Row>


                        }                        */}

                    </Col>

                </Row>
                <Row>
                    <Col>
                        <h5>Service Location</h5>

                        <div style={{ display: 'flex' }}>

                            {
                                (addedServiceLocation.length > 0) ? addedServiceLocation.map((location, index) => {
                                    return (
                                        <div style={{ display: 'flex' }}>
                                            <span>{`${location.country}/${location.port}`}</span>

                                            {
                                                (index < addedServiceLocation.length - 1) &&
                                                <span>,</span>
                                            }
                                        </div>
                                    )
                                })
                                    :

                                    <p style={{ color: 'gray' }}>---------</p>

                            }
                        </div>
                    </Col>
                </Row>
            </div> 

            <h4 style={{ marginBottom: '2rem', marginTop: '2rem', marginLeft: '1rem' }}>2. Services</h4>
            <div className="summary-division-two summary-services">
                {
                    serviceList.map((each, index) => {
                        return (

                            <Col sm='4'>
                                <h6>{each.heading}</h6>
                                {

                                    subServices.map(service => {

                                        if (each.id === service.serviceType) {
                                            if (checkedServices.includes(service.id)) {

                                                return (

                                                    <p>{service.serviceName}</p>
                                                )
                                            }
                                        }
                                    })
                                }

                            </Col >
                        )
                    })

                }

            </div>

            <h4 style={{ marginBottom: '2rem', marginTop: '2rem', marginLeft: '1rem' }}>3. Certificates</h4>
            <div className="summary-division-one certification-summary">
                {
                    certificateData.length > 0 ? certificateData.map((category) => {
                        return (
                            <Col sm='4'>
                                <h6>
                                    {category.title}
                                </h6>
                                <div>

                                    {
                                        category.certificates.map(file => {
                                            return (
                                                <div>{`name: ${file.name}  validity: ${file.validity}`}</div>
                                            )
                                        })
                                    }
                                </div>
                            </Col>
                        )
                    }) :

                        <p style={{ color: 'gray' }}>---------</p>

                }
            </div>

            <div className="summary-division-two">
                <div>
                    <h4 style={{ marginBottom: '2rem' }}>4. Billing</h4>
                    <h5>Billing Address</h5>
                    <Row>
                        <Col sm="4">
                            <h6>Company Name</h6>
                            {
                                inputData.companyName ?
                                    <p>{inputData.companyName}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }

                        </Col>
                        <Col sm="4">
                            <h6>Country</h6>
                            {
                                inputData.country ?
                                    <p>{inputData.country}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col sm="4">
                            <h6>Email Id</h6>
                            {
                                inputData.emailId ?
                                    <p>{inputData.emailId}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }

                        </Col>
                    </Row>

                    <Row>

                        <Col sm="4">
                            <h6>Contact Number</h6>
                            {
                                inputData.contactNumber ?
                                    <p>{inputData.contactNumber}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>

                        <Col sm="4">
                            <h6>Address</h6>
                            {
                                inputData.address ?
                                    <p>{inputData.address}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col sm="4">
                            <h6>Post code/zip code</h6>
                            {
                                inputData.postalCode ?
                                    <p>{inputData.postalCode}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }

                        </Col>
                    </Row>


                </div>
                <div>
                    <h5>Bank Account </h5>
                    <Row>
                        <Col sm="4">
                            <h6>Account number</h6>
                            {
                                inputData.accountNumber ?
                                    <p>{inputData.accountNumber}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }

                        </Col>
                        <Col sm="4">
                            <h6>Bank name</h6>
                            {
                                inputData.bankName ?
                                    <p>{inputData.bankName}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }

                        </Col>
                        <Col sm="4">
                            <h6>Branch name</h6>
                            {
                                inputData.branchName ?
                                    <p>{inputData.branchName}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }

                        </Col>
                    </Row>
                    <Row>
                        <Col sm="4">
                            <h6>IFSC/Iban/swift code</h6>
                            {
                                inputData.ifscCode ?
                                    <p>{inputData.ifscCode}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col sm="4">
                            <h6>Tax/VAT</h6>
                            {
                                inputData.taxVat ?
                                    <p>{inputData.taxVat}</p>
                                    :
                                    <p style={{ color: 'gray' }}>---------</p>
                            }
                        </Col>
                        <Col sm="4"></Col>
                    </Row>
                </div>
            </div>


        </div>
    )
}
export default Summary;