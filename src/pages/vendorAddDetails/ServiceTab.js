import { useState, useEffect } from "react";
import {
    Row,
    Input,
    Button,
    ListGroup,
    ModalBody,
    ModalFooter,
    Spinner
} from "reactstrap";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { config } from "../../config";
import { unstable_batchedUpdates } from "react-dom";


const ServiceTab = () => {
    const [serviceIndex, setServiceIndex] = useState(1);
    const [newService, setNewService] = useState('');
    const [checkedServices, setCheckedServices] = useState({})
    const [subServices, setSubServices] = useState([])
    const [isSumbitLoading, setIsSumbitLoading] = useState(false);
    const [servicesExist, setServicesExist] = useState([])
    const [checkedItems, setCheckedItems] = useState({
        item1: false,
        item2: false,
        item3: false,
        item4: false,
    });

    const getservicesList = async () => {
        
        await axios.get('/vendor-services').then(res => {

            const newObj = res.data.vendorServices
                .filter(id => res.data.services.some(service => service.id === id))
                .reduce((obj, id) => {
                    obj[id] = true;
                    return obj;
                }, {});

            unstable_batchedUpdates(() => {
                setCheckedServices(newObj)
                setSubServices(res?.data?.services)
            })

            // setSubServices(res?.data?.services)
            // setServicesExist(res?.data?.vendorServices)

        }).catch(err => {

            console.log(err)
        })

    }

    useEffect(() => {
        getservicesList()
    }, [])

    const handleServicesCheckboxChange = (seviceId) => {
        unstable_batchedUpdates(() => {

            if (servicesExist.includes(seviceId)) {
                console.log()
                setServicesExist((prevServices) => prevServices.filter(service => service !== seviceId));
            }
            setCheckedServices({
                ...checkedServices,
                [seviceId]: !checkedServices[seviceId]
            })


        })

    }

    const handleCheckboxChange = (itemName) => {
        setCheckedItems({
            ...checkedItems,
            [itemName]: !checkedItems[itemName],
        });
    };

    const serviceList = {
        1: {
            heading: "⚙️ Technical Services"
        },
        2: {
            heading: "🛳️ Ship Design Services"
        },
        3: {
            heading: '🔩 Spare Parts Supply'
        },
        4: {
            heading: '🛠️ Provision Supply'
        },
        5: {
            heading: "⛽ Servicing & Refilling"
        }
    }

    const addNewSubService = async () => {
        const serviceObject = {
            serviceName: newService,
            serviceType: serviceIndex,
        }
        await axios.post(`${config.api_base_url}/create-new-vendor-service`, { serviceObject }).then((res) => {
            <ModalBody>
                Service added Succesfully
                <ModalFooter><Button>Ok</Button></ModalFooter>
            </ModalBody>

        }).catch((err) => console.log(err));

    }

    const addServices = () => {
        if (newService === '') return alert('Please Type Service Name')
        addNewSubService()
        const newSubServices = [...subServices]
        newSubServices.push({ name: newService })
        setSubServices(newSubServices);
        setNewService('');
        getservicesList()
    }

    const submitServices = async () => {
        setIsSumbitLoading(true)
        const vendorData = JSON.parse(localStorage.getItem('authInfo'));

        const data = {
            vendorId: vendorData.id,
            serviceIds: checkedServices,
        }

        await axios.post('/add-vendor-service', { data })
            .then(res => {
                setIsSumbitLoading(false)
            })
            .catch(err => alert('Error'))
    }

    return (
        <div>
            <div className="all-tabpane-container" style={{ marginTop: '40px' }}>

                <div style={{ display: "flex" }} >
                    <div>
                        <ListGroup>
                            <Button style={{ marginTop: '1rem', display: "flex", alignItems: 'center', justifyContent: 'space-between' }} outline={serviceIndex === 1 ? false : true} color="dark" onClick={() => setServiceIndex(1)}>
                                ⚙️ Technical Services <FontAwesomeIcon style={{ marginLeft: '1.5rem' }} icon={faAngleRight} />
                            </Button>
                            <Button style={{ marginTop: '1rem', display: "flex", alignItems: 'center', justifyContent: 'space-between' }} outline={serviceIndex === 2 ? false : true} color="dark" onClick={() => setServiceIndex(2)}>
                                🛳️ Ship Design Services <FontAwesomeIcon style={{ marginLeft: '1.5rem' }} icon={faAngleRight} />
                            </Button>
                            <Button style={{ marginTop: '1rem', display: "flex", alignItems: 'center', justifyContent: 'space-between' }} outline={serviceIndex === 3 ? false : true} color="dark" onClick={() => setServiceIndex(3)}>
                                🔩 Spare Parts Supply <FontAwesomeIcon style={{ marginLeft: '1.5rem' }} icon={faAngleRight} />
                            </Button>
                            <Button style={{ marginTop: '1rem', display: "flex", alignItems: 'center', justifyContent: 'space-between' }} outline={serviceIndex === 4 ? false : true} color="dark" onClick={() => setServiceIndex(4)}>
                                🛠️ Provision Supply <FontAwesomeIcon style={{ marginLeft: '1.5rem' }} icon={faAngleRight} />
                            </Button>
                            <Button style={{ marginTop: '1rem', display: "flex", alignItems: 'center', justifyContent: 'space-between' }} outline={serviceIndex === 5 ? false : true} color="dark" onClick={() => setServiceIndex(5)}>
                                ⛽ Servicing & Refilling <FontAwesomeIcon style={{ marginLeft: '1.5rem' }} icon={faAngleRight} />
                            </Button>
                        </ListGroup>
                    </div>
                    <div style={{ marginLeft: '3rem', marginTop: '10px', padding: '5px' }}>
                        <h3 style={{ fontWeight: "bold" }}>
                            {serviceList[serviceIndex].heading}
                        </h3>

                        <ul style={{ paddingLeft: '0px' }}>
                            {
                                subServices.map((service, index) => {
                                    if (serviceIndex === service.serviceType) {
                                        return (
                                            <li style={{ display: "flex" }} key={index}>
                                                <Input
                                                    style={{ marginRight: '10px', marginBottom: '2px', fontSize: "20px" }}
                                                    type="checkbox"
                                                    // checked={checkedItems[`item'+${index}+1`]}
                                                    // onChange={() => handleCheckboxChange('item' + index + 1)}
                                                    checked={checkedServices[service.id] || servicesExist.includes(service.id)}
                                                    onChange={() => handleServicesCheckboxChange(service.id)}
                                                />
                                                <p style={{ fontSize: "17px", marginBottom: '3px' }}>{service.serviceName}</p>
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                        <div style={{ display: "flex" }}>
                            <Input
                                style={{ fontSize: '13px', marginRight: '8px' }}
                                placeholder={"Add new service .."}
                                value={newService}
                                onChange={(e) => setNewService(e.target.value)}
                            />
                            <Button
                                outline size="sm"
                                color="success"
                                onClick={() => addServices()}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Row className="info-submit">
                <Button color="primary" onClick={submitServices}>
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

export default ServiceTab;