import { combineReducers } from 'redux';
import sideBarReducer from './sideBarReducer'; 
import authReducer from './authReducer'; 

const rootReducer = combineReducers({
  sideBar: sideBarReducer,
  auth: authReducer
  // Add more reducers as needed
});

export default rootReducer;
