
import * as React from 'react';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {
  Row,
  Col,
  Input,
  Label,
  Alert,
  FormFeedback,
  Spinner,
  Button ,
  ModalBody,
  Modal
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import allPorts from '../../output.json'
import countires from '../../output-country.json'
import { unstable_batchedUpdates } from "react-dom";






const steps = ['Choose Services', 'Add Ship Details', 'Review'];

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


export default function Services() {

  const clonePortsIntial = [...allPorts];
  let filteredPortsIntial = clonePortsIntial.filter(port => port.country === 'India');
const [modal, setModal] =useState(false)
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [services, setServices] = useState([])
  const [subServices, setSubservicesArr] = useState([])
  const [serviceLocationCountry, setServiceLocationCountry] = useState('India');
  // const [selectedCountry, setSelectedCountry] = useState('');
  const [ports, setPorts] = useState(filteredPortsIntial);
  const [selectedPort, setSelectedPort] = useState('agra');
  const [addedServiceLocation, setAddedServiceLocation] = useState([]);
  const [alreadyServiceLocationAdded, setAlreadyServiceLocationAdded] = useState(false)
  const [selectedServiceName, setSelectedServiceName] =useState('')
  const [serviceName, setServiceName] =useState('')
  const [selectedServiceId,setSelectedServiceId] =useState(0)
  


  const [shipData, setShipData] = useState({
    height: '',
    width: '',
  });

  // Handler for updating ship data state
  const handleInputChange = (e, field) => {
    const value = e.target.value;

    // Ensure that the value is a valid number (you can customize this validation)
    if (!isNaN(value)) {
      setShipData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
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

  const fetchServices = async () => {
    await axios.get('/vendor-services').then(res => {
      for (const each of serviceList) {
        for (const service of res?.data?.services) {
          if (each.id === service.serviceType) {
            console.log("service", service)
            console.log("each", each)
            each.services.push(service)
          }
        }
      }
      setServices(serviceList)

    }).catch(err => {

      console.log(err)
    })
  }

  useEffect(() => {
    console.log("useeffectttttttttttt")
    fetchServices()
  }, [])

  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const submitServiceReq = async() => {
    const submitObject =  {
      serviceId: selectedServiceId,
      country: serviceLocationCountry,
      port: selectedPort,
      shipDetails: shipData
    }

    await axios.post('/service-request', submitObject)
    .then(res => {
      setModal(true)
      setTimeout(() => {
        setModal(false)
      }, 1000);
    })
    .catch(err => {
      console.log(err)
      alert('error while submitting service request')
    })
  }

  const handleNext = (action) => {
    console.log('submitsubmitsubmitsubmitsubmit', action)
    if(action === 'submit') {
      return submitServiceReq()
    }

    // let newSkipped = skipped;
    // if (isStepSkipped(activeStep)) {
    //   newSkipped = new Set(newSkipped.values());
    //   newSkipped.delete(activeStep);
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleInput = (event, serviceList) => {
    const selectedServiceId = event.target.value;

    const selectedService = serviceList.find((service) => service.id === parseInt(selectedServiceId, 10));
    const selectedServiceHeading = event.target.options[event.target.selectedIndex].getAttribute('data-heading');
    console.log("selectedServiceHeading", selectedServiceHeading)
    unstable_batchedUpdates(() => {
      setSubservicesArr(selectedService.services)
      setSelectedServiceName(selectedServiceHeading)
    })
  };

  const handleSubServiceInput = (event, serviceList) => {
    console.log("serviceName serviceName serviceName serviceName serviceName serviceName serviceName",  serviceName)
    const selectedServiceId = event.target.value;

    const selectedService = serviceList.find((service) => service.id === parseInt(selectedServiceId, 10));
    const selectedServiceHeading = event.target.options[event.target.selectedIndex].getAttribute('data-heading');
    console.log("selectedServiceHeading", selectedServiceHeading)
    
    
    unstable_batchedUpdates(() => {
      setServiceName(selectedServiceHeading)
     setSelectedServiceId(selectedServiceId) 
    })
  }

  const handleServiceLocationCountry = (value) => {
    const clonePorts = [...allPorts];
    let filteredPorts = clonePorts.filter(port => port.country === value);
    setPorts(filteredPorts)
    setSelectedPort(filteredPorts[0].name)
    setServiceLocationCountry(value)
  }

  const chooseServices = () => {
    return (
      <>
      <h4>Service Details</h4>
        <Row>

          <Col>
            <Label>Select Service Type</Label>
            <Input
              type="select"
              name="serviceDropdown"
              id="serviceDropdown"
              onChange={(event) => handleInput(event, serviceList)}
            >
              {/* <option value="" disabled>Select a service</option> */}
              {/* [{ heading: 'Select Service' }, ...serviceList] */}
              {serviceList.map((service) => (
    <option key={service.id} value={service.id} data-heading={service.heading}>
      {service.heading}
    </option>
  ))}
            </Input>
          </Col>
          <Col>
            {console.log("subServices", subServices)}
            <Label>Select Service</Label>

            <Input type="select" name="subServiceDropdown" id="subServiceDropdown" onChange={(event) => handleSubServiceInput(event, serviceList)} >
              {/* [{ serviceName: 'Select Sub service' }, ...subServices] */}
              {subServices.length > 0 && subServices.map((subService) => (
                <option key={subService.id} value={subService.id} data-heading={subService.serviceName}>
                  {subService.serviceName} {/* Assuming subService has a 'name' property */}
                </option>
              ))}
            </Input>

          </Col>

        </Row>

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
              {console.log("addedServiceLocation", addedServiceLocation)}
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
      </>

    )
  }

  const addShipDetails = () => {
    return (
      <Row>
        <h4>Ship Details</h4>
        <Row>
          <Col>
            <Label>Ship Height (meters)</Label>
            <Input
              type="number"
              step="any" // Allows entering decimal numbers
              value={shipData.height}
              onChange={(e) => handleInputChange(e, 'height')}
            />
          </Col>
          <Col>
            <Label>Ship Width (meters)</Label>
            <Input
              type="number"
              step="any"
              value={shipData.width}
              onChange={(e) => handleInputChange(e, 'width')}
            />
          </Col>
        </Row>
      </Row>
    )
  }

  const reviewDetails = () => {
    return (
      <div>
        <h3>
          Summary
        </h3>
        <Row style={{marginTop: '20px'}}>
          <Col>
          
          <Row>
          <h5 style={{color: 'gray'}}>Service Details</h5>
          <Col sm='10px'>
            <p>Service Type </p>
            <p style={{fontSize: '18px', marginLeft: '8px'}}>{selectedServiceName}</p>
            </Col>
            <Col>
            <p>Service Name </p>
            <p style={{fontSize: '18px', marginLeft: '8px'}}>{serviceName}</p>
            </Col>

            <Col sm='10px'>
            <p>Country </p>
            <p style={{fontSize: '18px', marginLeft: '8px'}}>{serviceLocationCountry}</p>
            </Col>

            <Col>
            <p>Port </p>
            <p style={{fontSize: '18px', marginLeft: '8px'}}>{selectedPort}</p>
            </Col>
          </Row>
          </Col>
          <Col>

          <Row>
          <h5 style={{color: 'gray'}}>Ship Details</h5>
            <Col sm='10px'>
            <p>Height </p>
            <p style={{fontSize: '18px', marginLeft: '8px'}}>{shipData.height}</p>
            </Col>
            <Col>
            <p>Width </p>
            <p style={{fontSize: '18px', marginLeft: '8px'}}>{shipData.width}</p>
            </Col>
          </Row>
          </Col>
        </Row>
        
      </div>
    )
  }


  return (
    <div className="tab-pane-container-wrapper">
      <Modal isOpen={modal}>
    <ModalBody>
    Service Request Submitted Successfully
    </ModalBody>
  </Modal>
      <div className="tab-pane-container">
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <div className='req-service-container'>
              {
                activeStep === 0 &&
                chooseServices()
              }
              {
                activeStep === 1 &&
                addShipDetails()
              }
              {
                activeStep === 2 &&
                reviewDetails()
              }
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button 
                // onClick={handleNext} 
                onClick={() => handleNext(activeStep === steps.length - 1 ? 'submit' : 'next')}

                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
}