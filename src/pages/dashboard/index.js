import { useEffect } from 'react';
import { useDispatch, connect } from "react-redux";
import axios from 'axios';
import Navbar from '../../components/Navbar'
import SideNavbar from '../../components/Sidebar';
import VendorDetails from '../vendorDetails';
import VendorAddDetails from '../vendorAddDetails';
import Services from '../Services';
import LogoutPage from '../Logout';
import Summary from '../Summary';
import ServiceRequests from '../serviceRequests';
import ApproveVendorRequests from '../approveVendorRequests';

const Dashboard = ({navBarSelection}) => {
    const dispatch = useDispatch()
    useEffect(() => {
        axios.get('/vendor/get-service-requests')
            .then(res => {
                dispatch({ type: 'SERVICE_REQUESTS_DATA', payload: res.data.message })
            })    
            .catch(err => {
                alert("Error !!")
            })
    }, []);

    return(
        <>
            <Navbar/>
            {console.log("navBarSelection", navBarSelection)}
            <div className="main-container">
                <SideNavbar/>
                {
                    navBarSelection === 'vendors' ? 
                    <VendorDetails/>
                    : (navBarSelection === 'shipManager') ?
                    <VendorAddDetails/>
                    : (navBarSelection === 'logout') ? 
                    <LogoutPage/>
                    : (navBarSelection === 'approve-vendor-requests') ? 
                    <ApproveVendorRequests/>
                    // :  (navBarSelection === 'summary') ? 
                    // <Summary/>
                    :  (navBarSelection === 'service-requests') ? 
                    <ServiceRequests/>
                    : null

                }
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        navBarSelection: state.sideBar.navBarSelection,
    }
}

export default connect(mapStateToProps)(Dashboard);