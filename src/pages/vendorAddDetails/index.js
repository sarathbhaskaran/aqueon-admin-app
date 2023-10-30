import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import InfoTab from "./InfoTab";
import CertifictesTab from "./CertifictesTab"
import BillingTab from "./BillingTab"
import ServiceTab from "./ServiceTab";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Summary from "../Summary";


const VendorAddDetails = () => {
  const authObj = JSON.parse(localStorage.getItem('authInfo'))
  console.log("authObj", authObj);
  const isShipManger = authObj?.data?.userType === 'shipManager'
  const isServiceSupplier = authObj?.data?.userType === 'serviceSupplier'
  console.log("isServiceSupplier", isServiceSupplier)
  const [activeTab, setActiveTab] = useState(0);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <div className="tab-pane-container-wrapper">
        <div className="tab-pane-container">

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant="fullWidth"
            >
              <Tab label="Info" />
              {isServiceSupplier && <Tab label="Services" />}
              {isServiceSupplier && <Tab label="Certificates" />}
              {isServiceSupplier && <Tab label="Billing" />}
            </Tabs>
          </Box>
          <TabContent activeTab={activeTab} className="tab-content">

            <TabPane tabId={0} className="tabpane-one">
              <InfoTab setActiveTab={(tab) => setActiveTab(tab)} />
            </TabPane>

            {isServiceSupplier && <TabPane tabId={1}>
              <ServiceTab />
            </TabPane>}

            {isServiceSupplier && <TabPane tabId={2} className="tabpane-three">
              <CertifictesTab />
            </TabPane>}

            {isServiceSupplier && <TabPane tabId={3} className="tabpane-four">
              <BillingTab />
            </TabPane> }           

          </TabContent>

        </div>
      </div>
    </>
  );
};

export default VendorAddDetails;
