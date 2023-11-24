import styles from "../styles/appovalPending.module.css";
import Navbar from "../../components/Navbar";
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const ApprovalPending = () => {
  return (
    <>
      <Navbar />
      <div className={styles.registrationSuccess}>
        <h2>Registration Successful</h2>
        <p>
          Thank you for registering with <strong>Aqueon</strong>!
        </p>
        <p>
          Your registration has been successfully completed. To get started, please check your registered email for your temporary password, which has been automatically generated for you.
        </p>
        <p>
          If you don't see the email in your inbox, please check your spam folder, and make sure to mark it as "Not Spam" to receive future notifications from us.
        </p>
        <p>
          Once you have your temporary password, you can use it to log in to your account. We recommend changing your password to something more secure once you've logged in.
        </p>
        <p>
          If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@email.com">info@aqueongroup.com</a>.
        </p>
        <p>
          Thank you for choosing <strong>Aqueon</strong>! We look forward to serving you.
        </p>
        <Link to="/admin/login">
          <Button color="primary">Go to Login</Button>
        </Link>
      </div>

    </>

  );
};

export default ApprovalPending;
