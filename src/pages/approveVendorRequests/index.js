import React, { useState, useEffect } from "react";
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
import { Input, Row, Col, Badge } from "reactstrap";
import { config } from "../../config";
import { Button } from "@mui/material";
import { useDispatch, connect } from "react-redux";
import ApproveModal from '../../components/ApproveModal'
import { unstable_batchedUpdates } from "react-dom";

const ApproveVendorRequests = ({ serviceRequestId }) => {

  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openServiceLocation, setOpenServiceLocation] = React.useState(false);
  // const [serviceLocations, setServiceLocations] = React.useState([]);
  const [vendorDetails, setVendorDetails] = useState([])
  const [addedCost, setAddedCost] = useState(0)
  const [addCostPopup, setAddCostPopup] = useState(false)

  const handleClickOpenServiceLocation = () => {
    setOpenServiceLocation(true);
  };

  const handleCloseServiceLocation = () => {
    unstable_batchedUpdates(() => {
      setOpenServiceLocation(false);
      setVendorDetails([])
    })
  };

  const handleAddCostPopUpClose = () => {
    unstable_batchedUpdates(() => {
      setAddCostPopup(false);
    })
  }

  const approveQuotation = async (id, requestId) => {
    if (addedCost === 0) {
      return alert('Please added cost')
    }
    await axios.put('/approve-vendor-quote', { id, addedCost, requestId })
      .then(res => {
        console.log("res", res.data)
        setAddedCost(0)
        getAcceptedVendorsData()

      })
      .catch(err => {
        setAddedCost(0)
        alert('Error while approve')
        console.log("err", err)

      })
    unstable_batchedUpdates(() => {
      setOpenServiceLocation(false);
      setVendorDetails([])
    })
  }

  const addExtraAmount = async () => {
    await axios.post('/add-extra-cost', { addedCost, serviceRequestId })
      .then(res => {
        console.log("res", res.data)
        setAddedCost(0)
        setAddCostPopup(false)
      })
      .catch(err => {
        setAddedCost(0)
        alert('Error while approve')
        console.log("err", err)
      })
  }

  const showServiceLocation = (data) => {
    console.log("data", data)
    setVendorDetails(data)
    setOpenServiceLocation(true);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAcceptedVendorsData = async () => {
    console.log("serviceRequestId", serviceRequestId)
    await axios.get(`${config.api_base_url}/vendors-accepted`, { params: { serviceRequestId } })
      .then((res) => {
        console.log("res", res);
        setVendorList(res.data.message);
      })
      .catch(err => {
        alert("Error");
        console.log("Error")
      })
  }

  useEffect(() => {
    getAcceptedVendorsData()
  }, []);

  const handleAddedCost = (e) => {
    setAddedCost(e.target.value)
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
  const currencyLogo = vendorDetails.currency === 'USD' ? "$" : "₹"
  return (
    <div className="tab-pane-container-wrapper">
      <div className="tab-pane-container">
        <Dialog
          fullWidth={true}
          maxWidth={'sm'}
          open={openServiceLocation}
          onClose={handleCloseServiceLocation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Offer Details"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h6 style={{ color: 'black' }}>Service Cost: </h6>
                <strong>{vendorDetails.serviceCost ? currencyLogo + vendorDetails.serviceCost : currencyLogo + '0'}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h6 style={{ color: 'black' }}>Mobilization/Demobilization Cost: </h6>
                <strong>{vendorDetails.mobilizationCost ? currencyLogo + vendorDetails.mobilizationCost : currencyLogo + '0'}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h6 style={{ color: 'black' }}>Extra Charges: </h6>
                <strong>{vendorDetails.extraCharges ? currencyLogo + vendorDetails.extraCharges : currencyLogo + '0'}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: '1rem' }}>
                <h6 style={{ color: 'black' }}>Total Cost: </h6>
                <strong style={{ fontSize: "20px" }} >{vendorDetails.totalCost ? currencyLogo + vendorDetails.totalCost : currencyLogo + '0'}</strong>
              </div>
              <Row style={{ marginTop: '2rem' }}>
                <Col sm='12'>
                  <h6 style={{ color: 'black', fontSize: '15px' }}>Terms And Condition*</h6>
                  <div style={{ borderRadius: '5px', minHeight: '70px', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px' }}>{vendorDetails.termsAndCondition ? vendorDetails.termsAndCondition : '---'}</p>
                  </div>
                </Col>
              </Row>
              {/* <Row style={{ marginBottom: '6px' }}>
                <Col sm='8'>
                </Col>
                <Col sm='2'>
                  <h6 style={{ color: 'black' }}>Cost to Add</h6>
                  <Input
                    value={addedCost}
                    onChange={handleAddedCost}
                  >
                  </Input>
                </Col>

              </Row> */}

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ color: 'grey' }}
              onClick={() => handleCloseServiceLocation()}
            >
              OKay
            </Button>
            {/* <Button onClick={() => approveQuotation(vendorDetails.id, vendorDetails.requestId)} autoFocus>
              Approve
            </Button> */}
          </DialogActions>
        </Dialog>


        <Dialog
          fullWidth={true}
          maxWidth={'sm'}
          open={addCostPopup}
          onClose={handleAddCostPopUpClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Add Extra Cost"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Row style={{ marginBottom: '6px' }}>
                <Col sm='6'>
                  <h6 style={{ color: 'black' }}>Cost to Add (₹)</h6>
                  <Input
                    value={addedCost}
                    onChange={handleAddedCost}
                  >
                  </Input>
                </Col>
              </Row>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ color: 'grey' }}
              onClick={() => handleCloseServiceLocation()}
            >
              Cancel
            </Button>
            <Button onClick={() => addExtraAmount()} autoFocus>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h6>
            Request Id: {serviceRequestId}
          </h6>
          <Button variant="contained" onClick={() => setAddCostPopup(true)} >
            + Add Cost
          </Button>
        </div>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: '200px' }}><strong>Company Name</strong></TableCell>
                  <TableCell> <strong>Company Email</strong> </TableCell>
                  {/* <TableCell> <strong>Contact Number</strong></TableCell> */}
                  {/* <TableCell> <strong>Price</strong></TableCell> */}
                  {/* <TableCell> <strong>Remark</strong></TableCell> */}
                  {/* <TableCell> <strong>Accounting Email</strong> </TableCell> */}
                  <TableCell> <strong>Status</strong></TableCell>
                  <TableCell> <strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorList
                  .map((row) => {
                    const d = new Date(row.creation_time);
                    let text = d.toLocaleString();
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell>
                          {row.company_name}
                        </TableCell>
                        <TableCell >{row.company_email}</TableCell>
                        <TableCell >{
                          row.status === "pending" ?
                            <Badge color="danger" >
                              Supplier Not Accept
                            </Badge> :
                            <Badge color="success">
                              Supplier Accepted
                            </Badge>
                          // <Badge color="error" badgeContent={"Not accepted"}/> : null
                        }</TableCell>
                        {/* <TableCell>{row.contact_number}</TableCell> */}
                        {/* <TableCell>{row.totalCost} INR</TableCell> */}
                        {/* <TableCell>{text.split(',')[0]}</TableCell> */}
                        {/* <TableCell>{row.personal_email}</TableCell> */}
                        {/* <TableCell>{row.remark}</TableCell> */}
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => showServiceLocation(row)}
                          >
                            View Offer
                          </Button>
                          {/* {
                            row.addedCost ?
                              <Button color="success">
                                Approved
                              </Button>
                              :
                              <Button
                                variant="outlined"
                                onClick={() => showServiceLocation(row)}
                              >
                                Approve
                              </Button>
                          } */}
                        </TableCell>
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


const mapStateToProps = state => ({
  navBarSelection: state.sideBar.navBarSelection,
  serviceRequestId: state.sideBar.serviceRequestId,
});

export default connect(mapStateToProps)(ApproveVendorRequests);