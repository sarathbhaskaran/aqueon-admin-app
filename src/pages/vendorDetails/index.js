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
  ListGroupItem, ListGroup, Row, Col, Spinner
} from "reactstrap";
import { config } from "../../config";
import { Button } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import VendorDetailsModal from '../../components/VendorDetailsModal'

const VendorDetails = () => {

  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openServiceLocation, setOpenServiceLocation] = useState(false);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [detailsModalData, setDetailsModalData] = useState([])
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false)
  const [isOpenSuspendModal, setIsOpenSuspendModal] = useState(false)
  const [vendorId, setVendorId] = useState(0)
  const [accountStatus, setAccountStatus] = useState('active')
  const [companyEmail, setCompanyEmail] = useState('')
  const [isLoading, setIsLoading] = React.useState(true);




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

  const getVendorDetails = () => {
    axios.get(`${config.api_base_url}/admin/vendors`)
    .then((res) => {
      console.log("res", res.data);
      unstable_batchedUpdates(() => {
        setVendorList(res.data);
        setIsLoading(false);
      })

    })
    .catch(err => {
      alert("Error");
      setIsLoading(false);
      console.log("Error")
    })
  }
  useEffect(() => {
    getVendorDetails()
  }, []);

  const showServiceLocation = (id) => {
    handleClickOpenServiceLocation()
    axios.get(`${config.api_base_url}/vendor/service-location`, { params: { vendorId: id } })
      .then(res => {
        setServiceLocations(res.data.message)
        console.log("res", res);
      })
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

  // const handleChangePassword = async () => {
  //   if (password.length < 8) {
  //     alert("Password must be more than 8 characters")
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setCheckSame(false);
  //     return;
  //   }

  //   await axios.post(`${config.api_base_url}/vendors/changepassword`, { password })
  //     .then(() => {
  //       setPasswordAlert(true)
  //       setTimeout(() => {
  //         setPasswordAlert(false);
  //       }, 5000);
  //       setCheckSame(true);
  //     })
  //     .catch(err => {
  //       setCheckSame(true);
  //       alert("Error");
  //       console.log("Error updating password")
  //     })
  // }

  const handleClose = () => {
    unstable_batchedUpdates(() => {
      setIsOpenDetailsModal(false)
      setDetailsModalData([])
    })
  }

  const openDetailsModal = (data, addedOn) => {
    const details = {
      ...data,
      addedOn
    }
    unstable_batchedUpdates(() => {
      setIsOpenDetailsModal(true)
      setDetailsModalData(details)
    })
  }

  const openSuspendModal = (vendorId, vendorAccountStatus, company_email) => {
    console.log("vendorId", vendorId)
    unstable_batchedUpdates(() => {
      setIsOpenSuspendModal(true)
      setVendorId(vendorId)
      setAccountStatus(vendorAccountStatus)
      setCompanyEmail(company_email)
    })
  }

  const handleCloseSuspendModal = () => {
    unstable_batchedUpdates(() => {
      setIsOpenSuspendModal(false)
      setDetailsModalData([])
    })
  }

  const suspendAccount = () => {
    axios.put('/suspend-vendor/', { params: { id: vendorId, accountStatus, companyEmail } })
      .then(res => {
        unstable_batchedUpdates(() => {
          setVendorId(0)
          setIsOpenSuspendModal(false)
          getVendorDetails()
        })
      })
      .catch(err => {
        console.log("error while updating active status of supplier account")
        unstable_batchedUpdates(() => {
          setVendorId(0)
          setIsOpenSuspendModal(false)
        })
      })
  }


  return (
    <div className="tab-pane-container-wrapper">
      <div className="tab-pane-container">
        <Dialog
          open={isOpenDetailsModal}
          maxWidth={'lg'}
          fullWidth={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            Company Details
          </DialogTitle>
          {/* <DialogContent >
            <Row style={{marginBottom: '30px', padding: '2px'}}>
              <Col >
                <h5>
                  Company Name
                </h5>
                <p>{detailsModalData.company_name}</p>
              </Col>
              <Col>
                <h5>
                  Contact Number
                </h5>
                <p>{detailsModalData.contact_number}</p>
              </Col>
              <Col >
                <h5>
                  Country
                </h5>
                <p>{detailsModalData.country}</p>
              </Col>
            </Row>

            <Row style={{marginBottom: '30px', padding: '2px'}}>
              <Col>
                <h5>
                  Added On
                </h5>
                <p>{detailsModalData.addedOn}</p>
              </Col>
              <Col>
                <h5>
                  Accounting Email
                </h5>
                <p>{detailsModalData.company_email}</p>

              </Col>

              <Col>
                <h5>
                  Staff Count
                </h5>
                <p>{detailsModalData.staff}</p>

              </Col>
            </Row>

            <Row style={{marginBottom: '30px', padding: '2px'}}>
              <Col>
                <h5>
                  Websites
                </h5>
                <p>{detailsModalData.website}</p>
              </Col>

              <Col>
                <h5>
                  Service Location
                </h5>
                <Button
                  variant="outlined"
                  style={{border: 'none', textDecoration: 'underline', cursor: 'pointer'}}
                  onClick={() => showServiceLocation(detailsModalData.id)}
                >
                  View
                </Button> 
                </Col>

              <Col>
                <h5>
                  Billing Address
                </h5>
                <Button
                  variant="outlined"
                  style={{border: 'none', textDecoration: 'underline', cursor: 'pointer'}}
                  onClick={() => showServiceLocation(detailsModalData.id)}
                >
                  View
                </Button>   
                </Col>
            </Row>

          </DialogContent> */}
          <DialogContent>
            <VendorDetailsModal vendorId={detailsModalData.id} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Okay
            </Button>          </DialogActions>
        </Dialog>

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

        <Dialog
          open={isOpenSuspendModal}
          onClose={handleCloseSuspendModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >

          <DialogTitle>
            <p>
              {accountStatus === 'active' ?
            'Suspend Account'  : 'Activate Account'}
              </p>
          </DialogTitle>
          <DialogContent>
          <p>
              {accountStatus === 'active' ?
            'Are you sure, you want to suspend the Supplier account ?'  : 'Are you sure, you want to activate the Supplier account ?'}
              </p>          
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseSuspendModal}>Cancel</Button>
            <Button onClick={() => suspendAccount()}>Yes</Button>
          </DialogActions>

        </Dialog>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: '200px' }}><strong>Company Name</strong></TableCell>
                  <TableCell> <strong>Company Email</strong> </TableCell>
                  <TableCell> <strong>Contact Number</strong></TableCell>
                  <TableCell> <strong>Country</strong></TableCell>
                  <TableCell> <strong>Added On</strong></TableCell>
                  <TableCell> <strong>Actions</strong></TableCell>
                  {/* <TableCell> <strong>Accounting Email</strong> </TableCell>
                  <TableCell> <strong>Staff Count</strong></TableCell>
                  <TableCell> <strong>Websites</strong></TableCell>
                  <TableCell> <strong>Service Location</strong></TableCell>
                  <TableCell> <strong>Billing Address</strong></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorList
                  .map((row) => {
                    const d = new Date(row.creation_time);
                    let text = d.toLocaleString();
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id} style={{background: row.active_status === 'suspended' ? 'rgb(245, 156, 156)' : '' }}>
                        <TableCell>
                          {row.company_name}
                        </TableCell>
                        <TableCell >{row.company_email}</TableCell>
                        <TableCell>{row.contact_number}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{text.split(',')[0]}</TableCell>
                        <TableCell>
                          <Button variant="outlined" onClick={() => openDetailsModal(row, text.split(',')[0])}>View</Button>
                          <Button variant= {row.active_status === 'suspended'? 'contained': 'outlined'}
                           color={row.active_status === 'suspended'? 'success': 'error'} 
                           style={{ marginLeft: '4px' }} 
                           onClick={() => openSuspendModal(row.id, row.active_status, row.company_email)} 
                          >{row.active_status === 'suspended'? 'Activate' : 'Suspend' }</Button>
                        </TableCell>
                        {/* <TableCell>{row.personal_email}</TableCell>
                        <TableCell>{row.staff}</TableCell>
                        <TableCell>{row.website}</TableCell> */}
                        {/* <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => showServiceLocation(row.id)}
                          >
                            Viewk
                          </Button> */}
                        {/* </TableCell> */}
                        {/* <TableCell>
                          <Button variant="outlined">View</Button>
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

export default VendorDetails;