
import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Input,
  Label,
  FormFeedback,
  Modal,
  ModalBody,
  Spinner,
  Badge
} from "reactstrap";
import axios from "axios";
import { unstable_batchedUpdates } from "react-dom";

const CertifictesTab = () => {

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

  const [certificateFiles, setCertificateFiles] = useState({});
  const [theInputKey, setTheInputKey] = useState("");
  const [certificateData, setCertificateData] = useState(CertificateData);
  const [isSumbitLoading, setIsSumbitLoading] = useState(false);
  const [provideAllDetailsAlert, setProvideAllDetailsAlert] = useState(false);
  const [certificationDetails, setCertificationDetails] = useState({});
  const [uploadedCertificates, setUploadedCertificates] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCertificates()
  }, [])

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };


  const fetchCertificates = async () => {
    await axios.get('/fetch-vendor-certificates')
      .then(res => {
        setUploadedCertificates(res.data)
      })
      .catch(err => {
        console.log("err", err)
      })
  }

  const formData = new FormData();

  const handleCerticateUploads = (event) => {
    const { name } = event.target;
    setCertificateFiles({
      ...certificateFiles,
      [name]: event.target.files[0],
    });
  };

  const handleCerticateDetails = (event) => {
    const { name } = event.target;
    setCertificationDetails({
      ...certificationDetails,
      [name]: event.target.value,
    });
  };

  const addCertificates = (id) => {
    if (!certificationDetails[`${id}Name`] || !certificateFiles[id] || !certificationDetails[`${id}Validity`]) {
      setProvideAllDetailsAlert(id)
      return
    }

    const cloneCertificate = [...certificateData];
    for (let each of cloneCertificate) {
      if (each.id === id) {
        each.certificates.push({
          "certificateName": certificationDetails[`${id}Name`],
          "file": certificateFiles[id],
          "validity": certificationDetails[`${id}Validity`]
        })
      }
    }
    let cloneCertificationDetails = {...certificationDetails}
    cloneCertificationDetails[`${id}Name`] = ""
    cloneCertificationDetails[`${id}Validity`] = ""

    // to reset file input
    let randomString = Math.random().toString(36);
    setTheInputKey(randomString)

    setCertificationDetails(cloneCertificationDetails);
    setCertificateData(cloneCertificate);
    setProvideAllDetailsAlert(false)
  }

  const submitCertificates = async () => {

    try {
      setIsSumbitLoading(true);
      for (const data of certificateData) {
        for (const certificate of data.certificates) {
          formData.append(`${data.id}|${certificate.certificateName}|${certificate.validity}`, certificate.file)
        }
      }

      await axios.post('/vendors/profile/certificates', formData)
        .then(res => {
          fetchCertificates()
          toggleModal()
          unstable_batchedUpdates(() => {
            setCertificateData(CertificateData)
          })
          setIsSumbitLoading(false);
        }
        )
        .catch(err => {
          setIsSumbitLoading(false);
          console.log(err)
        })

    } catch {
      console.log('error')
    }
  }

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

  return (
    <div>
      <div className="all-tabpane-container">
        <div>
          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <ModalBody>
              Certificate Added Succesfully!!
            </ModalBody>
          </Modal>
        </div>
        {
          certificateData.map(each => {
            return (
              <div key={each.id}>
                <h5 style={{ marginTop: "2rem" }}>{each.title}</h5>
                <Row>
                  <Col sm="3">
                    <Label>Certificate Name</Label>
                    <Input
                      type="text"
                      bsSize="sm"
                      value={certificationDetails[`${each.id}Name`]}
                      id={each.id}
                      invalid={provideAllDetailsAlert === each.id}
                      name={`${each.id}Name`}
                      onChange={handleCerticateDetails}
                    />
                    <FormFeedback>Provide all the required details !!</FormFeedback>
                  </Col>
                  <Col sm="5">
                    <Label>Choose File</Label>
                    <Input
                      type="file"
                      bsSize="sm"
                      id={each.id}
                      key={theInputKey || ""}
                      invalid={provideAllDetailsAlert === each.id}
                      name={each.id}
                      onChange={handleCerticateUploads}
                    />
                    <FormFeedback>Provide all the required details !!</FormFeedback>
                  </Col>
                  <Col sm="2">
                    <Label>Validity</Label>
                    <Input
                      type="date"
                      bsSize="sm"
                      value={certificationDetails[`${each.id}Validity`]}
                      invalid={provideAllDetailsAlert === each.id}
                      id={each.id}
                      name={`${each.id}Validity`}
                      onChange={handleCerticateDetails}
                    />
                    <FormFeedback>Provide all the required details !!</FormFeedback>
                  </Col>
                  <Col sm="1" style={{ display: "flex", alignItems: (provideAllDetailsAlert === each.id) ? "center" : "flex-end", marginTop: (provideAllDetailsAlert === each.id) ? '10px' : '0px' }}>
                    <Button onClick={() => addCertificates(each.id)} size="sm" color="success">
                      Add
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <ul style={{ paddingLeft: '1rem', marginTop: '12px' }}>
                    {
                      each.certificates.map((certificate, index) => {
                        return (
                          <li key={certificate.name + index} style={{ display: "flex" }}>
                            <p style={{ marginRight: '5px', marginTop: '3px' }}>{index + 1}.</p>
                            <Col sm="3">
                              <Input
                                style={{ marginRight: '10px', marginBottom: '2px', fontSize: "13px" }}
                                size="sm"
                                disabled
                                value={`${certificate.certificateName}   ${certificate?.file?.name}  ${certificate.validity}   `}
                              />
                            </Col>
                          </li>
                        )
                      })
                    }
                    {uploadedCertificates
                      .slice() // Create a copy of the array to avoid mutating the original
                      .reverse() // Reverse the array
                      .filter((certificate) => certificate.type === each.id)
                      .map((certificate, index) => (
                        <div key={certificate.filename + index} style={{ display: "flex", flexDirection: "row", marginBottom: '10px' }}>

                          <Col sm="4">
                            <Input
                              style={{ marginRight: '10px', marginBottom: '2px', fontSize: "13px" }}
                              size="sm"
                              disabled
                              value={`name: ${certificate.name}                 validity: ${certificate.validity}`}
                            />
                          </Col>
                          <Col sm="3" style={{ marginLeft: '8px' }}>
                            <Button
                              onClick={() => downloadCertificate(certificate.filename)}
                              size="sm"
                              outline
                              color="success"
                            >
                              View
                            </Button>
                            {certificate.expired &&
                              <Badge
                                disabled
                                style={{ marginLeft: '5px', padding: '5px'}}
                                color="danger"
                              >
                                Expired
                              </Badge>
                            }
                          </Col>
                        </div>
                      ))
                    }
                  </ul>
                </Row>
              </div>
            )
          })
        }
      </div>
      <Row className="info-submit">
        <Button color="primary" onClick={submitCertificates}>
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

export default CertifictesTab;
