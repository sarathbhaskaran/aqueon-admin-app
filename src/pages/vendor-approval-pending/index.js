"use client";
import "../styles/vendorApprovalPending.css";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { config } from "../../config";

const VendorApprovalPending = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.api_base_url}/vendors`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("error");
      });
  }, []);

  const approveOrReject = async (status, id) => {
    const data ={status, id} 
    await axios.put(`${config.api_base_url}/update-approval`, data , {
      headers: {
        'Content-Type': 'application/json',
      },
    })
     .then((res) => {
    })
    .catch((err) => {
      console.log("error");
    });
  };

  return (
    <>
      <Navbar />
      <div className="vendor-approval">
        <h2>Vendor Details</h2>
        <div className="vendor-details">
          <div className="vendor-details-wrapper">
            {data && Array.isArray(data) &&
              data.map((details , index) => {
                return (
                  <div className="vendor-detail-unit" key={details.id}>
                    <div className="info">
                      <p className="info-titles">Company Name</p>
                      <p className="info-values">{details.company_name}</p>
                    </div>

                    <div className="info">
                      <p className="info-titles">Contact No.</p>
                      <p className="info-values">{details.contact_number}</p>
                    </div>

                    <div className="info">
                      <p className="info-titles">Company Email</p>
                      <p className="info-values">{details.company_email}</p>
                    </div>

                    <div className="info">
                      <p className="info-titles">Personal Email</p>
                      <p className="info-values">{details.personal_email}</p>
                    </div>

                    <div className="info">
                      <p className="info-titles">Country</p>
                      <p className="info-values">{details.country}</p>
                    </div>

                    <div className="info">
                      <p className="info-titles">State</p>
                      <p className="info-values">{details.state}</p>
                    </div>

                    <div className="info">
                      <p className="info-titles">District</p>
                      <p className="info-values">{details.district}</p>
                    </div>

                    <div className="actions">
                      <Button
                        className="vendor-action approve-button"
                        color="success"
                        onClick={() => approveOrReject('approved', details.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        className="vendor-action delete-button"
                        color="danger"
                        onClick={() => approveOrReject('reject', details.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        className="vendor-action suspend-button"
                        color="warning"
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorApprovalPending;
