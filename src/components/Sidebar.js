import React from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { useDispatch, connect } from "react-redux";
import { Badge } from "reactstrap";
import { isServiceSupplier, isShipManger } from "../utility";
// import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const SideNavbar = ({ navBarSelection, serviceRequestsData }) => {
  const dispatch = useDispatch()

  return (
    <div className="side-bar">
      <Sidebar>
        <Menu>
            {console.log("navBarSelection",navBarSelection)}
            <SubMenu
              style={{ backgroundColor: navBarSelection === 'vendors' ? '#4ab9cf' : '', color: navBarSelection === 'vendors' ? 'white' : '' }}
              onClick={() => dispatch({ type: 'SET_VENDORS' })}
              label="Vendors"
              icon={<HomeRepairServiceIcon color="action" />}
            ></SubMenu> 

          {/* <SubMenu
            style={{ backgroundColor: navBarSelection === 'shipManager' ? '#4ab9cf' : '', color: navBarSelection === 'shipManager' ? 'white' : '' }}
            onClick={() => dispatch({ type: 'SET_SHIP_MANAGERS' })}
            label="Ship Managers"
            icon={<PersonIcon color="action" />}
          ></SubMenu> */}

          {/* {isServiceSupplier() &&
            <SubMenu
              style={{ backgroundColor: navBarSelection === 'summary' ? '#4ab9cf' : '', color: navBarSelection === 'summary' ? 'white' : '' }}
              onClick={() => dispatch({ type: 'SET_SUMMARY' })}
              label="Summary"
              icon={<TextSnippetIcon color="action" />}
            ></SubMenu>} */}
{/* 
          <SubMenu
            style={{ backgroundColor: navBarSelection === 'update-password' ? '#4ab9cf' : '', color: navBarSelection === 'update-password' ? 'white' : '' }}
            onClick={() => dispatch({ type: 'SET_PASSWORD' })}
            label="Change Password"
            icon={<KeyIcon color="action" />}
          ></SubMenu> */}

            <SubMenu
              style={{ backgroundColor: navBarSelection === 'service-requests' ? '#4ab9cf' : '', color: navBarSelection === 'service-requests' ? 'white' : '' }}
              onClick={() => dispatch({ type: 'SERVICE_REQUESTS' })}
              label={"Service Request"}
              icon={<MailIcon color="action" />}
              // suffix={serviceRequestsData.length ? <Badge color="danger">{serviceRequestsData.length}</Badge> : null}
            ></SubMenu>

            <SubMenu
              style={{ backgroundColor: navBarSelection === 'approve-vendor-requests' ? '#4ab9cf' : '', color: navBarSelection === 'approve-vendor-requests' ? 'white' : '' }}
              onClick={() => dispatch({ type: 'APPROVE_VENDOR_REQUESTS' })}
              label={"Approve Requests"}
              icon={<AssignmentTurnedInIcon color="action" />}
            ></SubMenu>

          <SubMenu
            style={{ backgroundColor: navBarSelection === 'logout' ? '#4ab9cf' : '', color: navBarSelection === 'logout' ? 'white' : '' }}
            onClick={() => dispatch({ type: 'SET_LOGOUT' })}
            label="Logout"
            icon={<LogoutIcon color="action" />}
          ></SubMenu>

        </Menu>
      </Sidebar>
    </div>
  )
}

const mapStateToProps = state => ({
  navBarSelection: state.sideBar.navBarSelection,
  // serviceRequestsData: state.auth.serviceRequests
});

export default connect(mapStateToProps)(SideNavbar);
