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
import { Input, Row, Col, Badge, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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
  const [checkSwitch, setCheckSwitch] = useState(false)
  const [openAddCostModal, setOpenAddCostModal] = useState(false)
  const [showAddedPrice, setShowAddedPrice] = useState(false)
  


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

  const applyAddedCost = async (id, requestId) => {
    // if (addedCost === 0) {
      // return alert('Please added cost')
    // }
    await axios.put('/approve-vendor-quote', { id: vendorDetails.id, addedCost: vendorDetails.serviceCost })
      .then(res => {
        // console.log("res", res.data)
        setOpenAddCostModal(false)
        // setAddedCost(0)
        // getAcceptedVendorsData()

      })
      .catch(err => {
        // setAddedCost(0)
        alert('Error while approve')
        console.log("err", err)

      })
    // unstable_batchedUpdates(() => {
    //   setOpenServiceLocation(false);
    //   setVendorDetails([])
    // })
  }

  const addExtraAmount = async () => {
    await axios.post('/add-extra-cost', { addedCost, serviceRequestId })
      .then(res => {
        console.log("res", res.data)
        // setAddedCost(0)
        setAddCostPopup(false)
      })
      .catch(err => {
        // setAddedCost(0)
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
        setVendorList(res.data.message.vendorsAccepted);
        setAddedCost(res.data.message.addedCost.addedCost ? res.data.message.addedCost.addedCost : 0)
        setCheckSwitch(res.data.message.vendorsAccepted[0].addedCostMethod === 'auto' ? true : false)
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

  const handleAddedCostforEach = (e, data) => {
    let cloneVendorDetails = { ...vendorDetails };
    cloneVendorDetails.serviceCost = cloneVendorDetails.serviceCost.map(each => {
      if (each.id === data.id) {
        each.addedCost = e.target.value
        return each
      }
      return each
    })
    console.log("cloneVendorDetails", cloneVendorDetails)
    setVendorDetails(cloneVendorDetails)
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
  const renderAddCostModal = () => {
    const currencyLogo = vendorDetails.currencyType === 'USD' ? "$" : "₹"
    let totalServiceCost = 0;
    vendorDetails.serviceCost.forEach(each => {
      totalServiceCost = parseFloat(totalServiceCost) + parseFloat(each.cost);
    })
    console.log("totalServiceCost", totalServiceCost)
    // const totalCost = parseFloat(totalServiceCost) + parseFloat(vendorDetails.mobilizationCost) + parseFloat(vendorDetails.extraCharges);
    return (
      <Modal size="lg" isOpen={openAddCostModal} >
        <ModalHeader>
          Add Cost
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6 style={{ color: 'black' }}>total: </h6>
            <strong>{totalServiceCost ? currencyLogo + totalServiceCost : currencyLogo + '0'}</strong>
          </div>
        </ModalHeader>
        <ModalBody>
          {
            <div>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>No.</strong></TableCell>
                    <TableCell><strong>Service</strong></TableCell>
                    <TableCell> <strong>Real cost</strong></TableCell>
                    {/* <TableCell> <strong>Offer Price</strong></TableCell> */}
                    <TableCell> <strong>Add cost</strong></TableCell>
                    <TableCell> <strong>Total</strong></TableCell>
                  </TableRow>
                </TableHead>
                {console.log("vendorDetails", vendorDetails)}
                {vendorDetails.serviceCost.length > 0 ? vendorDetails.serviceCost.map((each, index) => {
                  return (
                    <TableRow style={{ backgroundColor: each.offerAwareded === 'true' ? "#ADD8E6" : null }} hover role="checkbox" tabIndex={-1} key={each.id}>
                      <TableCell>
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        {each.serviceName}
                      </TableCell>
                      <TableCell>
                        {currencyLogo + each.cost}
                      </TableCell>
                      <TableCell>
                        <Input
                          style={{ width: '80px' }}
                          type="number"
                          // value={each.addedCost}
                          onChange={(e) => handleAddedCostforEach(e, each)}
                        />
                      </TableCell>
                      <TableCell>
                        {currencyLogo} {parseFloat(each.cost) + parseFloat(each.addedCost ? each.addedCost : 0)}
                      </TableCell>
                    </TableRow>
                  )
                }) :
                  <div style={{ color: 'red', textAlign: "center", margin: '5px', width: '100%' }}>No service supplier found.</div>
                }
              </Table>
            </div>

          }
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => setOpenAddCostModal(false)}
          >
            Cancel
          </Button>
          <Button
            color='success'
            onClick={() => applyAddedCost()}
            autoFocus
          >
            {/* {
              isLoadingOffer &&
              <Spinner size="sm">
              </Spinner>
            } */}
            <span>
              {' '}Add Cost
            </span>

          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  const renderOfferModal = () => {
    const currencyLogo = vendorDetails.currencyType === 'USD' ? "$" : "₹"
    let totalServiceCost = 0;
    let costKeyName = !showAddedPrice ? 'serviceCost' : 'addedCost'
    vendorDetails[`${costKeyName}`].forEach(each => {
      totalServiceCost = parseFloat(totalServiceCost) + parseFloat(each.cost);
    })
    const totalCost = parseFloat(totalServiceCost) + parseFloat(vendorDetails.mobilizationCost) + parseFloat(vendorDetails.extraCharges);
    return (
      <Modal isOpen={openServiceLocation}>
        <ModalHeader>
           {showAddedPrice ? 'Added Price' : 'Review Offer' }
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6 style={{ color: 'black' }}>Service Cost (total): </h6>
            <strong>{totalServiceCost ? currencyLogo + totalServiceCost : currencyLogo + '0'}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginLeft: '20px', width: '100%' }}>
            <Row style={{ width: '80%' }}>
              {vendorDetails[`${costKeyName}`].map((each, index) => {
                let serviceCostData =  vendorDetails.serviceCost.find(eachCost => eachCost.id === each.id)
                return (
                  <div key={each.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 style={{ color: 'black', fontSize: '14px' }}>{index + 1}. {each.serviceName}</h6>
                    <strong style={{ color: 'green', fontSize: '13px' }}> <strong style={{ color: 'black', fontSize: '13px' }}>{each.cost ? currencyLogo + each.cost : currencyLogo + '0'} </strong>{ showAddedPrice ? `(+ ${each.cost - serviceCostData.cost})` : null}</strong>
                  </div>
                )
              })}
            </Row>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: '0.5rem' }}>
            <h6 style={{ color: 'black' }}>Mobilization/Demobilization Cost: </h6>
            <strong>{vendorDetails.mobilizationCost ? currencyLogo + vendorDetails.mobilizationCost : currencyLogo + '0'}</strong>
          </div>
          <div style={{}}>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: '0.5em' }}>
              <h6 style={{ color: 'black', marginBottom: '1px' }}>Extra Charges: </h6>
              <strong>{vendorDetails.extraCharges ? currencyLogo + vendorDetails.extraCharges : currencyLogo + '0'}</strong>
            </div>
            <p style={{ margin: '2px' }}>({vendorDetails.extraChargeRemark})</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: '1rem' }}>
            <h6 style={{ color: 'black' }}>Total Cost: </h6>
            <strong style={{ fontSize: "24px", color: "green" }} >{currencyLogo + totalCost}</strong>
          </div>
          <Row style={{ marginTop: '2rem' }}>
            <Col sm='12'>
              <h6 style={{ color: 'black', fontSize: '15px' }}>Terms And Condition*</h6>
              <div style={{ borderRadius: '5px', minHeight: '70px', marginBottom: '6px' }}>
                <p style={{ fontSize: '13px' }}>{vendorDetails.termsAndCondition ? vendorDetails.termsAndCondition : '---'}</p>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => {
              setOpenServiceLocation(false)
              setShowAddedPrice(false)
            }}
          >
            Cancel
          </Button>
          {/* <Button
            color='success'
            onClick={sendQuotationData}
            autoFocus
          >
            {
              isLoadingOffer &&
              <Spinner size="sm">
              </Spinner>
            }
            <span>
              {' '}Submit Quotation
            </span>

          </Button> */}
        </ModalFooter>
      </Modal>
    )
  }

  // const currencyLogo = vendorDetails.currency === 'USD' ? "$" : "₹"
  return (
    <div className="tab-pane-container-wrapper">
      <div className="tab-pane-container">

        {openServiceLocation && renderOfferModal()}
        {openAddCostModal && renderAddCostModal()}

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
              onClick={() => handleAddCostPopUpClose()}
            >
              Cancel
            </Button>
            <Button onClick={() => addExtraAmount()} autoFocus>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h6 style={{ flex: '1' }}>
            Request Id: {serviceRequestId}
          </h6>
          {/* <h6>
            Added Cost: <strong style={{ fontSize: '25px' }} >₹{addedCost}</strong>
          </h6> */}
          <FormGroup style={{ flex: '1' }} switch>
            <Input
              type="switch"
              style={{ height: '20px', width: "45px", marginRight: '10px' }}
              checked={checkSwitch}
              onClick={() => {
                setAddCostPopup(true)
                setCheckSwitch(true)
              }}
            />
            <Label check>Turn on switch to automate add cost</Label>
          </FormGroup>
          {/* <Button variant="contained" onClick={() => setAddCostPopup(true)} >
            Choose add method
          </Button> */}
        </div>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: '200px' }}><strong>Company Name</strong></TableCell>
                  <TableCell> <strong>Company Email</strong> </TableCell>
                  <TableCell> <strong>Status</strong></TableCell>
                  <TableCell> <strong>Actions</strong></TableCell>
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
                              Offer Not Submitted
                            </Badge> :
                            <Badge color="success">
                              Offer Submited
                            </Badge>
                        }</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            disabled={row.status === 'pending'}
                            onClick={() => showServiceLocation(row)}
                          >
                            View Offer
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ marginLeft: '5px' }}
                            disabled={row.adminApprovedStatus === 'approved'}
                            onClick={() => {
                              setOpenAddCostModal(true)
                              setVendorDetails(row)
                            }}
                          >
                            Add Cost
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ marginLeft: '5px'}}
                            disabled={row.adminApprovedStatus !== 'approved'}
                            onClick={() => {
                              setShowAddedPrice(true)
                              showServiceLocation(row)
                            }}
                          >
                            View Added Price
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

