import { SET_VENDORS, SET_SHIP_MANAGERS, SET_LOGOUT, SERVICE_REQUESTS, APPROVE_VENDOR_REQUESTS, SET_SERVICE_REQUEST_ID } from '../actionTypes';

const initialState = {
  navBarSelection: 'vendors',
  serviceRequestId: '',
};

const sideBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VENDORS:
      return {
        ...state,
        navBarSelection: 'vendors',
      };
    case SET_SHIP_MANAGERS:
      return {
        ...state,
        navBarSelection: 'shipManager',
      };
    case SERVICE_REQUESTS:
      return {
        ...state,
        navBarSelection: 'service-requests',
      };
    case APPROVE_VENDOR_REQUESTS:
      return {
        ...state,
        navBarSelection: 'approve-vendor-requests',
      };
    case SET_LOGOUT:
      return {
        ...state,
        navBarSelection: 'logout',
      };
    case SET_SERVICE_REQUEST_ID: 
      return {
        ...state,
        serviceRequestId: action.payload,
      }
    default:
      return state;
  }
};

export default sideBarReducer;