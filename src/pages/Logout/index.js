import React from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, connect } from "react-redux";

import {

    Button,
    Row,
    Col,

} from "reactstrap";
const LogoutPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const logoutUser = async () => {
        localStorage.removeItem('authInfo');
        await navigate('/admin/login')
        window.location.reload();
    }

    const cancelLogout = () => {
        dispatch({type: 'SET_PROFILE'})
    }

    return (
        <div className="tab-pane-container-wrapper">
            <div className="tab-pane-container">
                <Row>
                    <Col sm="12">
                        <h4 style={{ display: 'flex', justifyContent: 'center' }}>Are you sure you want to log out?</h4>
                        <h4 style={{ display: 'flex', justifyContent: 'center' }}>If you proceed, you'll need to log in again by entering your username and password.</h4>
                    </Col>
                    <div style={{ marginTop: "10px", display: 'flex', justifyContent: 'center' }}>
                        <Button color="secondary" onClick={cancelLogout} style={{ marginRight: '4px' }}>Cancel</Button>
                        <Button color="primary" onClick={logoutUser} style={{ marginLeft: '4px' }}>Yes</Button>
                    </div>
                </Row>
            </div>
        </div>

    )
}

const mapStateToProps = state => ({
    navBarSelection: state.navBarSelection,
  });
export default connect(mapStateToProps)(LogoutPage);
