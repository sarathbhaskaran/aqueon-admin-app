import { Route, Navigate,Routes as BaseRoutes } from "react-router-dom";
import Signup from "./pages/signup";
import ApprovalPending from "./pages/approval-pending";
import Dashboard from "./pages/dashboard";
import VendorApprovalPending from "./pages/vendor-approval-pending";
import AdminLogin from "./pages/admin-login";
import VendorLogIn from "./pages/vendor-login";

const isAuthenticated = () => { 
  const authObj = JSON.parse(localStorage.getItem('authInfo'))
  if (authObj !== null) return authObj.data.token ? true : false;
}


const PrivateRoute = ({ path, element }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/app/login" state={{ from: path }} />
  );
};

export default function Routes() {
  return (
    <BaseRoutes>
      {/* <Route path="/app" element={<Dashboard />} /> */}
      {/* <Route path="/admin" element={<Signup />} /> */}
      <Route path="/admin" element={<VendorLogIn />} />      
      <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />}/>} />
      <Route path="/app/vendor-approval-pending" element={<PrivateRoute element={<VendorApprovalPending/> }/>} />
      <Route path="/app/approval-pending" element={ <ApprovalPending />} />
      <Route path="/app/admin-login" element={<PrivateRoute element={<AdminLogin />}/>} />
      {/* <Route path="/app/vendor-add-details" element={<VendorAddDetails /> } /> */}
    </BaseRoutes>
  );
}