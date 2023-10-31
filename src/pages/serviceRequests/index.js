import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState, useEffect } from "react";
import {
  ListGroupItem, ListGroup, Spinner, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col
} from "reactstrap";
import { config } from "../../config";
import { Button } from "@mui/material";

const ServiceRequests = () => {

  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedRequestId, setSelectedRequestId] = React.useState(0);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [shipDetails, setShipDetails] = useState([]);
  const [requestVendors, setRequestesVendors] = useState([]);
  const [openServiceLocation, setOpenServiceLocation] = React.useState(false);
  const [serviceLocations, setServiceLocations] = React.useState([]);

  const handleClickOpenServiceLocation = () => {
    setOpenServiceLocation(true);
  };

  const handleCloseServiceLocation = () => {
    setOpenServiceLocation(false);
    setServiceLocations([])
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggle = (id) => {
    setSelectedRequestId(id)
    axios.get(`/admin/service-requests-extra-details`, { params: { requestId: id } })
      .then((res) => {
        setShowFullDetails(!showFullDetails)
        setShipDetails(res.data.shipDetails)
        setRequestesVendors(res.data.requestedVendors)
      })
      .catch(err => {
        alert("Error");
        console.log("Error")
      })

  };

  useEffect(() => {
    axios.get(`${config.api_base_url}/admin/service-requests`)
      .then((res) => {
        setIsLoading(false);
        setVendorList(res.data.message);
      })
      .catch(err => {
        alert("Error");
        console.log("Error")
      })
  }, []);


  const renderModal = () => {
    const selectRequest = vendorList.find(each => each.id == selectedRequestId);
    return (
      <Modal isOpen={showFullDetails} size='lg' toggle={() => setShowFullDetails(!showFullDetails)}>
        <ModalHeader toggle={() => setShowFullDetails(!showFullDetails)}>Request Details</ModalHeader>
        <ModalBody>
          <Row>
            <h5>Ship Details</h5>
          </Row>
          <div>
            <Row>
              <Col sm='6'>
                <p>Ship Name: <strong>{shipDetails.shipName}</strong> </p>
              </Col>
              <Col sm='6'>
                <p>IMO number: <strong>{shipDetails.imoNumber}</strong> </p>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <p>In charge Name: <strong>{shipDetails.inChargeName}</strong> </p>
              </Col>
              <Col sm='6'>
                <p>Ship Classfication: <strong>{shipDetails.shipClassfication}</strong> </p>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <p>Ship Flag: <strong>{shipDetails.shipFlag}</strong> </p>
              </Col>
              <Col sm='6'>
                <p>Year of Build: <strong>{shipDetails.yearOfBuild}</strong> </p>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <p>Ship Length: <strong>{shipDetails.shipLength}</strong> </p>
              </Col>
              <Col sm='6'>
                <p>Ship Breadth: <strong>{shipDetails.shipBreadth}</strong> </p>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <p>Ship DeadWeight: <strong>{shipDetails.deadWeight}</strong> </p>
              </Col>
              <Col sm='6'>
                <p>Ship Type: <strong>{shipDetails.shipType}</strong> </p>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <p>No Of Ballast Tank: <strong>{shipDetails.noOfBallastTank}</strong> </p>
              </Col>
              <Col sm='6'>
                <p>No Of Cargo: <strong>{shipDetails.noOfCargo}</strong> </p>
              </Col>
            </Row>
          </div>
          <Row style={{ marginTop: "2rem" }}>
            <h5>Service Details</h5>
          </Row>
          <div>
            <Row>
              <Col>
                <p>Service Name: <strong>{selectRequest.serviceName ? selectRequest.serviceName : selectRequest.newServiceName + '(new)'}</strong> </p>
              </Col>

              <Col sm='10px'>
                <p>Country: <strong>{selectRequest.country}</strong> </p>
              </Col>

              <Col>
                <p>Port: <strong>{selectRequest.port}</strong> </p>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <p>Service Request Details: <strong>{shipDetails.serviceRequestDetails}</strong> </p>
              </Col>
            </Row>
          </div>
          <Row style={{ marginTop: "2rem" }}>
            <h5>Requested Vendors</h5>
          </Row>
          {
            
            <div>
              <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Company Name</strong></TableCell>
                  <TableCell><strong>Company Email</strong></TableCell>
                  <TableCell> <strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
            {requestVendors.length > 0 ? requestVendors.map(each => {
              return(
                <TableRow onClick={() => toggle(each.id)} hover role="checkbox" tabIndex={-1} key={each.id}>
                <TableCell>
                  {each.company_name}
                </TableCell>
                <TableCell>{each.company_email}</TableCell>
                <TableCell>{
                  each.status === 'pending' ?
                    <Badge color="warning">
                      Pending
                    </Badge> :
                    each.status === 'accepted' ?
                      <Badge color="success">
                        Accepted
                      </Badge> :
                      <Badge color="primary">
                        Closed
                      </Badge>
                }</TableCell>
              </TableRow>
              )
            }) : 
            <div style={{ color: 'red'}}>No service supplier found.</div>
          }
              </Table>
          </div>
          
          }
         
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowFullDetails(!showFullDetails)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  if (isLoading) {
    return (
      <div className="tab-pane-container-wrapper" style={{}}>
        <div className="tab-pane-container" style={{ height: "55vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
      </div>
    )
  }

  return (
    <div className="tab-pane-container-wrapper">
      <div className="tab-pane-container">
        <Dialog
          open={openServiceLocation}
          onClose={handleCloseServiceLocation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Service Locations"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {Array.isArray(serviceLocations) ?
                <ListGroup>
                  {serviceLocations.map(location => {
                    return (
                      <ListGroupItem style={{ dispaly: "flex", justifyContent: 'space-between' }}>
                        <div>
                          <strong>Country</strong>: {location.country}
                        </div>
                        <div>
                          <strong>Port</strong>: {location.port}
                        </div>
                      </ListGroupItem>
                    )
                  })}
                </ListGroup>
                : <div>
                  {serviceLocations}
                </div>
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseServiceLocation} autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        {showFullDetails && renderModal()}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Company Name</strong></TableCell>
                  <TableCell><strong>Company Email</strong></TableCell>
                  <TableCell><strong>Serivce</strong></TableCell>
                  <TableCell> <strong>Country</strong></TableCell>
                  <TableCell> <strong>Requested On</strong></TableCell>
                  <TableCell> <strong>Status</strong></TableCell>
                  {/* <TableCell> <strong>Action</strong></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorList
                  .map((row) => {
                    const d = new Date(row.create_time);
                    let text = d.toLocaleString();
                    return (
                      <TableRow onClick={() => toggle(row.id)} hover role="checkbox" tabIndex={-1} key={row.id} style={{ cursor: "pointer" }}>
                        <TableCell>
                          {row.company_name}
                        </TableCell>
                        <TableCell>{row.company_email}</TableCell>
                        <TableCell >{row.serviceName ? row.serviceName : <div style={{ display: 'flex'}}>{row.newServiceName }<div style={{ color: 'orange'}} >(new)</div> </div> }</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{text}</TableCell>
                        <TableCell>{
                          row.status === 'pending' ?
                            <Badge color="warning">
                              Pending
                            </Badge> :
                            row.status === 'notRequested' ?
                              <Badge color="danger">
                                Not Requested
                              </Badge> :
                              <Badge color="primary">
                                Closed
                              </Badge>
                        }</TableCell>
                        {/* <TableCell>
                          <Button>
                            View More
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={vendorList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Paper>

      </div>
    </div>

  )
}

export default ServiceRequests;