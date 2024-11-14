import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth, setupRecaptcha } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';  

const Login = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        const recaptchaVerifier = setupRecaptcha('recaptcha-container');
        if (recaptchaVerifier) {
          window.recaptchaVerifier = recaptchaVerifier;
        }
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const requestOtp = async (values) => {
    setPhoneNumber(values.phoneNumber);
    try {
      
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error("reCAPTCHA not initialized");
      }
    
      const result = await signInWithPhoneNumber(auth, `+1${values.phoneNumber}`, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP', error);
      toast.error('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      toast.error('Please request an OTP first.');
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      toast.success('Phone verification successful!');
      navigate('/dash');
    } catch (error) {
      console.error('Incorrect OTP', error);
      toast.error('Incorrect OTP. Please try again.');
    }
  };

  const phoneSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  });

  return (
    <div className="w-100 d-flex justify-content-center align-items-center p-4" style={{ height: '100vh' }}>
      <div className="w-75">
        <Row className="align-items-center">
          <Col xs={12} sm={6}>
            {!isOtpSent ? (
              <>
                <h2 className="p-3 text-center">Login</h2>
                <p className="text-center">Please enter your details to access your account</p>
                <Formik
                  initialValues={{ phoneNumber: '' }}
                  validationSchema={phoneSchema}
                  onSubmit={requestOtp}
                >
                  <Form>
                    <Field 
                      name="phoneNumber" 
                      placeholder="Phone Number" 
                      className="form-control mb-3" 
                      maxLength="10" 
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                    <button type="submit" className="btn btn-primary w-100">Request OTP</button>
                  </Form>
                </Formik>
                <div className="text-center mt-3">
                  <p>Don't have an account? <Link to="/reg" className="text-danger">Sign Up</Link></p>
                </div>
              </>
            ) : (
              <>
                <h2 className="p-3">Verify OTP</h2>
                <p className="text-center">
                  An authentication code has been sent to +1 {phoneNumber}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="form-control mb-3"
                />
                <button onClick={verifyOtp} className="btn btn-primary w-100">Verify OTP</button>
              </>
            )}
          </Col>
          <Col xs={12} sm={6}>
            <img src="src/assets/log1.jpg" alt="Login Illustration" className="img-fluid" style={{ maxWidth: '100%' }} />
          </Col>
        </Row>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
