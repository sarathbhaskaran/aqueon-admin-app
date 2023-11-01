import React, { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import AspectRatioTwoToneIcon from '@mui/icons-material/AspectRatioTwoTone';
import FlagTwoToneIcon from '@mui/icons-material/FlagTwoTone';
import AnchorTwoToneIcon from '@mui/icons-material/AnchorTwoTone';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import ConstructionTwoToneIcon from '@mui/icons-material/ConstructionTwoTone';

import {
    Row,
    Col,
    Button
  } from "reactstrap";



export default function LargeModal({
        handleViewModal, 
        openViewModal, 
        data,
        openQuationModal
    }) {

    const ServiceTypeList = [
        {
          heading: "Technical Services",
          id: 1
        },
        {
          heading: "Ship Design Services",
          id: 2
      
        },
        {
          heading: 'Spare Parts Supply',
          id: 3
      
      
        },
        {
          heading: 'Provision Supply',
          id: 4
      
      
        },
        {
          heading: "Servicing & Refilling",
          id: 5
      
        }
      ]
    console.log('openModal', handleViewModal)
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const [openconfirmationModal, setOpenConfirmationModal] = useState(null)
  const [requestId, setReqId] = useState(0)



  const handleClose = () => {
    setOpen(false);
    handleViewModal(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  const findServiceType = (serviceType) => {
    for (const type of ServiceTypeList) {
      if (type.id === serviceType) {
        return type.heading
      }
    }
  }

  const openconfirmModal = (action, reqId) => {
    unstable_batchedUpdates(() => {
      setOpenConfirmationModal(action)
      setReqId(reqId)

    }, [])
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={openViewModal}
        onClose={handleClose}
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          
          <Row>
                  <Col sm='3'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>

                      <FlagTwoToneIcon />
                      <p className="requestServiceDataKeys">Country:<span className="requestServiceDataValues">{data.country ? data.country : 'nill'}</span></p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col sm='3'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>

                      <AnchorTwoToneIcon />
                      <p className="requestServiceDataKeys">Port: <span className="requestServiceDataValues">{data.port ? data.port : 'nill'}</span></p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <div style={{ display: 'flex', alignItems: 'center' }}>

                    <WorkTwoToneIcon />
                    <p className="requestServiceDataKeys">Service Type: <span className="requestServiceDataValues">{findServiceType(data.serviceType)}</span></p>
                  </div>
                </Row>

                <Row>
                  <div style={{ display: 'flex', alignItems: 'center' }}>

                    <ConstructionTwoToneIcon />
                    <p className="requestServiceDataKeys">Service Name: <span className="requestServiceDataValues">{data.serviceName ? data.serviceName : 'nill'}</span></p>
                  </div>
                </Row>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                  <div>
                    {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                      <AspectRatioTwoToneIcon />
                      <p className="requestServiceDataKeys">Ship Dimensions:</p>
                    </div> */}
                    {/* <Col style={{ display: 'flex', alignSelf: 'flex-end' }}>
                      {console.log("JSON.parse(data.ship_details).height", JSON.parse(data.ship_details))}
                      <p>Ship Height: <span className="requestServiceDataValues">{JSON.parse(data.ship_details).height ? JSON.parse(data.ship_details).height : 'nill'}</span></p>
                      <p>Ship width: <span className="requestServiceDataValues">{JSON.parse(data.ship_details).width ? JSON.parse(data.ship_details).width : 'nill'}</span></p>
                    </Col> */}
                  </div>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    <Button color="primary" onClick={() => openQuationModal('accept', data.id)}>
                      Create Quotation
                    </Button>

          <Button onClick={handleClose} color="danger" outline>Close</Button>

                    {/* <Button color="danger" outline onClick={() => openconfirmModal('reject', data.id)}>
                      Reject
                    </Button> */}
                  </div>

                </div>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
}
