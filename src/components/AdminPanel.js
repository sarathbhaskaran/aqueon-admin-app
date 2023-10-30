import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import {useEffect, useState } from 'react';
import axios from "axios";
import { config } from "../config";
// import '../app/styles/dashboard.module.css'

const AdminPanel = () => {

    const [ data, setData ] = useState([])
    useEffect(() => {
       
            axios.get(`${config.api_base_url}/adminpanel`).then((res) => {
                setData(res)
                
            })
            .catch(err => {
                console.log("error")
            })          

    },[])
  return (
    <div style={{ paddingLeft: "3%" }}>
      <h2>
        Admin Panel
      </h2>
      <Table hover>
        <thead>
          <tr>
            <th>No.</th>
            <th>Registration type</th>
            <th>Pending</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Vendor</td>
            <td>
              <Link to="/signup/vendor-approval-pending" target="_blank">6</Link>
            </td>
            <td>
              <Link href="" target="_blank">2</Link>
            </td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>User</td>
            <td>
              <Link href="" target="_blank">0</Link>
            </td>
            <td>
              <Link href="" target="_blank">0</Link>
            </td>
          </tr>
          
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;
