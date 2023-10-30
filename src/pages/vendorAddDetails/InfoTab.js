import { useState, useEffect } from "react";
import {
    Row,
    Col,
    Input,
    Label,
    Button,
    Alert,
    FormFeedback,
    Spinner
} from "reactstrap";
import axios from 'axios';
import { config } from "../../config";
import CountryDropdown from "../../components/CountryDropdown";
import countires from '../../output-country.json'
import allPorts from '../../output.json'
import { faRemove, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InfoTab = ({setActiveTab}) => {
    const clonePortsIntial = [...allPorts];
    let filteredPortsIntial = clonePortsIntial.filter(port => port.country === 'India');

    const [selectedFile, setSelectedFile] = useState(null);
    const [inputData, setInputData] = useState({});
    const [isInfoLoading, setIsInfoLoading] = useState(true);
    const [isSumbitLoading, setIsSumbitLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [serviceLocationCountry, setServiceLocationCountry] = useState('India');
    const [ports, setPorts] = useState(filteredPortsIntial);
    const [selectedPort, setSelectedPort] = useState('agra');
    const [addedServiceLocation, setAddedServiceLocation] = useState([]);
    const [alreadyServiceLocationAdded, setAlreadyServiceLocationAdded] = useState(false)

    const authObj = JSON.parse(localStorage.getItem('authInfo'))
    const isShipManger = authObj?.data?.userType === 'shipManager'
    const isServiceSupplier = authObj?.data?.userType === 'serviceSupplier'

    useEffect(() => {
        if (isServiceSupplier) {
            fetchVendorInfo()
        } else {
            fetchShipOwnerInfo()
        }
    }, []);

    const fetchShipOwnerInfo = () => {
        axios.get(`${config.api_base_url}/shipmanager/info`)
            .then(res => {
                const { company_name, company_email, country, contact_number } = res.data.data;
                console.log("res.data", res.data);
                setInputData({
                    companyName: company_name,
                    country,
                    contactNumber: contact_number,
                    primaryMailId: company_email,
                })
                setIsInfoLoading(false);
            })
            .catch(err => {
                alert("Error")
                setIsInfoLoading(false);
            })
    }

    const fetchVendorInfo = () => {
        axios.get(`${config.api_base_url}/vendors/profile/info`)
        .then(res => {
            const { company_name, company_email, country, contact_number, personal_email, website, staff, companyDescriptions, companyBrochures, serviceLocation } = res.data.message;
            setInputData({
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
            setIsInfoLoading(false);
        })
        .catch(err => {
            alert("Error")
            setIsInfoLoading(false);
        })
    }

    const formData = new FormData();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInputData({
            ...inputData,
            [name]: value,
        });
    };

    const handleFileUpload = async () => {
        setIsSumbitLoading(true)
        const filteredAddedServiceLocation = addedServiceLocation.filter(each => !each.saved);
        formData.append("file", selectedFile);
        formData.append("companyName", inputData.companyName);
        formData.append("staff", inputData.staff);
        formData.append("country", inputData.country);
        formData.append("contactNumber", inputData.contactNumber);
        formData.append("companyEmail", inputData.primaryMailId);
        formData.append("personalEmail", inputData.accountingMailId);
        formData.append("websites", inputData.websites);
        formData.append("serviceLocation", JSON.stringify(filteredAddedServiceLocation));
        formData.append("companyDescription", inputData.companyDescription);

        try {
            if (!/^[0-9]+$/.test(inputData.contactNumber)) {
                alert("Contact number must be an integer.");
                return; // Prevent form submission
            }

            if (!/^[0-9]+$/.test(inputData.staff)) {
                alert("staff must be an integer.");
                return; // Prevent form submission
            }

            if (
                !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
                    inputData.accountingMailId
                )
            ) {
                alert("Invalid accounting email.");
                return; // Prevent form submission
            }

            if (
                !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
                    inputData.primaryMailId
                )
            ) {
                alert("Invalid primary email.");
                return; // Prevent form submission
            }

            await axios.put(`${config.api_base_url}/vendors/profile/info`, formData);
            setIsSumbitLoading(false);
            setActiveTab(1);
        } catch (error) {
            setIsSumbitLoading(false);
            console.error("File upload failed", error);
        }
    };

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
    };

    const handleAddServiceLocation = () => {
        let checkIndex = addedServiceLocation.findIndex(each => each.port === selectedPort)
        if (checkIndex > -1) {
            setAlreadyServiceLocationAdded(true)
            return
        }
        let cloneServiceLocationList = [...addedServiceLocation];
        cloneServiceLocationList.push({ country: serviceLocationCountry, port: selectedPort })
        setAddedServiceLocation(cloneServiceLocationList)
        setAlreadyServiceLocationAdded(false)
    }

    const handleRemoveServiceLocation = (port) => {
        let cloneServiceLocationList = [...addedServiceLocation];
        cloneServiceLocationList = cloneServiceLocationList.filter(each => each.port !== port);
        setAddedServiceLocation(cloneServiceLocationList)
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleServiceLocationCountry = (value) => {
        const clonePorts = [...allPorts];
        let filteredPorts = clonePorts.filter(port => port.country === value);
        setPorts(filteredPorts)
        setSelectedPort(filteredPorts[0].name)
        setServiceLocationCountry(value)
    }

    const downloadBrochure = async () => {
        const filename = inputData.companyBrochures;
        // // Create a URL for the download endpoint on your Node.js API
        const downloadURL = `${config.api_base_url}/vendor/download-brochure/${filename}`;
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

    if (isInfoLoading) {
        return (
            <div className="all-tabpane-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        <div>
            <div className="all-tabpane-container">
                {console.log("inputData", inputData)}
                <h5>Basic Details</h5>
                <Row>
                    <Row>
                        <Col>
                            <Label size="sm" >Company Name</Label>
                            <Input size='sm' onChange={handleInput} name="companyName" value={inputData.companyName}></Input>
                        </Col>
                        <Col>
                            <Label size="sm">Nationality</Label>
                            <Input
                                id="exampleSelect"
                                value={inputData.country}
                                type="select"
                                name="country"
                                size={'sm'}
                                onChange={handleInput}
                            >
                                {countires.map((each, index) => <option key={index}>{each}</option>)}
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                    { isShipManger &&  <Col>
                            <Label size="sm">Primary Mail Id</Label>
                            <Input
                                size="sm"
                                onChange={handleInput}
                                name="primaryMailId"
                                value={inputData.primaryMailId}
                                type="email"
                            >
                            </Input>
                        </Col>}
                       { isServiceSupplier && <Col>
                            <Label size="sm">Staff Count</Label>
                            <Input
                                type="number"
                                size="sm"
                                value={inputData.staff}
                                onChange={handleInput}
                                name="staff"
                            ></Input>
                        </Col>}
                        <Col>
                            <Label size="sm">Contact Number</Label>
                            <Input size="sm" type="number" onChange={handleInput} name="contactNumber" value={parseInt(inputData.contactNumber)}></Input>
                        </Col>
                    </Row>
                    <Row>
                        { isServiceSupplier &&  <Col>
                            <Label size="sm">Primary Mail Id</Label>
                            <Input
                                size="sm"
                                onChange={handleInput}
                                name="primaryMailId"
                                value={inputData.primaryMailId}
                                type="email"
                            >
                            </Input>
                        </Col>}
                       { isServiceSupplier && <Col>
                            <Label size="sm">Accounting Mail Id</Label>
                            <Input
                                size="sm"
                                onChange={handleInput}
                                value={inputData.accountingMailId}
                                name="accountingMailId"
                            ></Input>
                        </Col>}
                    </Row>
           { isServiceSupplier && <Row>
                        <Col sm="6">
                            <Label size="sm" >Websites</Label>
                            <Input
                                size="sm"
                                onChange={handleInput}
                                value={inputData.websites}
                                name="websites"
                            ></Input>
                        </Col>
                    </Row>}
                </Row>
                {
                    isServiceSupplier &&
                <>
                <h5 style={{ marginTop: '2rem' }}>Service Location</h5>
                <Row>
                    <Col sm="6">
                        <Label size="sm">
                            Select Country
                        </Label>
                        <Input
                            id="exampleSelect"
                            value={serviceLocationCountry}
                            type="select"
                            size={'sm'}
                            onChange={(e) => handleServiceLocationCountry(e.target.value)}
                        >
                            {countires.map((each, index) => <option key={index}>{each}</option>)}
                        </Input>
                    </Col>
                    <Col sm="5">
                        <Label size="sm">
                            Select Service Location
                        </Label>
                        <Input
                            id="exampleSelect"
                            name="select"
                            type="select"
                            value={selectedPort}
                            size={'sm'}
                            invalid={alreadyServiceLocationAdded}
                            onChange={(e) => setSelectedPort(e.target.value)}
                        >
                            {ports.map((each, index) => <option key={index}>{each.name}</option>)}
                        </Input>
                        <FormFeedback>
                            Sorry, Port already added !!
                        </FormFeedback>
                    </Col>
                    <Col sm="1" style={{ display: "flex", alignItems: alreadyServiceLocationAdded ? "center" : "flex-end", marginTop: alreadyServiceLocationAdded ? '10px' : '0px' }}>
                        <Button size="sm" color="success" onClick={handleAddServiceLocation}>
                            +
                        </Button>
                    </Col>
                    <Row>
                        <ul style={{ paddingLeft: '1rem', marginTop: '12px' }}>
                            {
                                (addedServiceLocation.length > 0) && addedServiceLocation.map((location, index) => {
                                    return (
                                        <li key={location.port + index} id={selectedPort} style={{ display: "flex" }}>
                                            <Col sm="3">
                                                <Input
                                                    style={{ marginRight: '10px', marginBottom: '2px', fontSize: "13px" }}
                                                    size="sm"
                                                    disabled
                                                    value={`${location.country}/${location.port}`}
                                                />

                                            </Col>
                                            {!location.saved && <Button size="sm" style={{ marginLeft: '5px', marginBottom: '5px' }} color="danger" outline onClick={() => handleRemoveServiceLocation(location.port)}>
                                                <FontAwesomeIcon icon={faRemove} />
                                            </Button>}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Row>
                </Row>

                <h5 style={{ marginTop: '10px' }}>Company details</h5>
                <Row>
                    <Col>
                        <Label size="sm">Company Description</Label>
                        <Input
                            type="textarea"
                            size="sm"
                            style={{ paddingBottom: '30px' }}
                            onChange={handleInput}
                            value={inputData.companyDescription}
                            name="companyDescription"
                        ></Input>
                    </Col>
                    <Col>
                        <Label size="sm">Company Brochure (optional)</Label>
                        {
                            inputData.companyBrochures ?
                                <Row>
                                    <Col sm="9">
                                        <Input
                                            type="text"
                                            id="fileInput"
                                            size="sm"
                                            disabled
                                            value={inputData.companyBrochures}
                                            onChange={handleFileSelect}
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
                                :
                                <Input
                                    type="file"
                                    id="fileInput"
                                    size="sm"
                                    onChange={handleFileSelect}
                                />
                        }

                    </Col>


                </Row>
                </>
                }

            </div>

            <Row className="info-submit">
                <Button color="primary" onClick={handleFileUpload}>
                    {
                        isSumbitLoading &&
                        <Spinner size="sm">
                        </Spinner>
                    }
                    <span>
                        {' '}Submit
                    </span>
                </Button>
            </Row>
        </div>
    )
}

export default InfoTab;