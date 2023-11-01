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
  ListGroupItem, ListGroup, Spinner
} from "reactstrap";
import { config } from "../../config";
import { Button } from "@mui/material";

const ServiceRequests = () => {

  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true);
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

  useEffect(() => {
    axios.get(`${config.api_base_url}/admin/service-requests`)
      .then((res) => {
        console.log("resefews", res);
        setIsLoading(false);
        setVendorList(res.data.message);
      })
      .catch(err => {
        alert("Errorsvs");
        console.log("Error")
      })
  }, []);

  // const showServiceLocation = (id) => {
  //   handleClickOpenServiceLocation()
  //   axios.get(`${config.api_base_url}/vendor/service-location`, { params: { vendorId: id } })
  //     .then(res => {
  //       setServiceLocations(res.data.message)
  //       console.log("res", res);
  //     })
  // }
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
  if (isLoading) {
    return (
        <div className="tab-pane-container-wrapper" style={{  }}>
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
              { Array.isArray(serviceLocations) ? 
              <ListGroup>
              {serviceLocations.map(location => {
                return (
                    <ListGroupItem style={{dispaly: "flex", justifyContent: 'space-between' }}>
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: '200px' }}><strong>Company Name</strong></TableCell>
                  {/* <TableCell> <strong>Company Email</strong> </TableCell> */}
                  <TableCell> <strong>Service Name</strong> </TableCell>
                  
                  <TableCell> <strong>Contact Number</strong></TableCell>
                  <TableCell> <strong>Country</strong></TableCell>
                  <TableCell> <strong>Ship length</strong></TableCell>
                  <TableCell> <strong>Ship Width</strong></TableCell>
                  <TableCell> <strong>Status</strong></TableCell>
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
                        {/* <TableCell >{row.company_email}</TableCell> */}
                        <TableCell >{row.serviceName}</TableCell>
                        <TableCell>{row.contact_number}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{JSON.parse(row.ship_details).length}</TableCell>
                        <TableCell>{JSON.parse(row.ship_details).width}</TableCell>
                        <TableCell>{row.status}</TableCell>
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