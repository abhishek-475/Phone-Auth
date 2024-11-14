import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth, setupRecaptcha } from '../firebase/firebaseConfig';
import { signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = setupRecaptcha('recaptcha-container');
      try {
        window.recaptchaVerifier.render().catch((error) => {
          console.error('reCAPTCHA render error:', error);
        });
      } catch (error) {
        console.error('Error setting up reCAPTCHA:', error);
      }
    }
  }, []);

  const sendOtp = async (values) => {
    setPhoneNumber(values.phone);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, `+1${values.phone}`, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast.success('OTP sent to your phone');
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
      const result = await confirmationResult.confirm(otp);
      console.log('OTP verified:', result);
      toast.success('Phone verification successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Incorrect OTP', error);
      toast.error('Incorrect OTP. Please try again.');
    }
  };

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
  });

  return (
    <div className="w-100 d-flex justify-content-center align-items-center p-4" style={{ height: '100vh' }}>
      <div className="w-75">
        <Row className="align-items-center">
          <Col xs={12} sm={6}>
            <img
              src="src/assets/reg1.jpg"
              alt="registration"
              className="img-fluid"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <div className="d-flex align-items-end">
              <img src="src/assets/logo.png" alt="logo" className="img-fluid" style={{ height: '50px' }} />
            </div>
            <h2 className="p-3 text-center">Sign Up</h2>
            <p className="text-center">Let's get you all set up so you can access your personal account</p>

            {!isOtpSent ? (
              <Formik
                initialValues={{ firstName: '', lastName: '', phone: '', terms: false }}
                validationSchema={registerSchema}
                onSubmit={sendOtp}
              >
                {({ values, handleChange, handleSubmit, errors, touched, handleBlur }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="d-flex p-4">
                      <Form.Group className="me-3 w-100">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="John"
                          isInvalid={touched.firstName && !!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="w-100">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Doe"
                          isInvalid={touched.lastName && !!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <div className="p-3">
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.phone && !!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mt-3">
                        <Form.Check
                          type="checkbox"
                          name="terms"
                          label={
                            <>
                              I agree to all the <span className="text-danger">Terms</span> and <span className="text-danger">Privacy Policies</span>
                            </>
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.terms && !!errors.terms}
                        />
                        <Form.Control.Feedback type="invalid">{errors.terms}</Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="primary" type="submit" className="w-100 mb-3">
                          Create Account
                        </Button>
                      </div>

                      <div className="text-center">
                        <p>Already have an account? <a href="/login" className="text-danger">Sign In</a></p>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="p-4">
                <h2 className="p-3 text-center">Verify OTP</h2>
                <p className="text-center">An authentication code has been sent to +1 {phoneNumber}</p>
                <Form.Group>
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                  <Button variant="primary" className="w-100 mt-3" onClick={verifyOtp}>
                    Verify OTP
                  </Button>
                </Form.Group>
              </div>
            )}
          </Col>
        </Row>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Register;
