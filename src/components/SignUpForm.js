// SignupForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignupForm = ({ formType, onToggle }) => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const loginInitialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required'),
  });

  const loginValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const navigate = useNavigate(); // Use useNavigate hook

  const onSubmit = async (values) => {
    try {
      let url = '';
  
      if (formType === 'signup') {
        url = 'http://localhost:5000/api/register';
      } else {
        url = 'http://localhost:5000/api/login';
      }

      const response = await axios.post(url, values);

      if (response.status === 200) {
        const token = response?.data?.token;
        localStorage.setItem('jwtToken', token);

        // Use navigate to redirect after successful signup/login
        navigate('/task-listing');

        toast.success(`${formType === 'signup' ? 'User registered' : 'User logged in'} successfully!`);
      }
    } catch (error) {
      console.error('An error occurred during the API request:', error);

      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error?.response?.data?.error;
          toast.error(errorMessage);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      } else if (error.request) {
        console.error('No response received from the server:', error.request);
        toast.error('An error occurred. Please try again.');
      } else {
        console.error('Error during request setup:', error.message);
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <h1>{formType === 'signup' ? 'Signup Form' : 'Login Form'}</h1>
      <Formik
        initialValues={formType === 'signup' ? initialValues : loginInitialValues}
        validationSchema={formType === 'signup' ? validationSchema : loginValidationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          {formType === 'signup' && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <Field type="text" id="name" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <Field type="email" id="email" name="email" className="form-control" />
            <ErrorMessage name="email" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <Field type="password" id="password" name="password" className="form-control" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          {formType === 'signup' && (
            <div className="mb-3">
              <label htmlFor="passwordConfirmation" className="form-label">
                Confirm Password:
              </label>
              <Field type="password" id="passwordConfirmation" name="passwordConfirmation" className="form-control" />
              <ErrorMessage name="passwordConfirmation" component="div" className="text-danger" />
            </div>
          )}

          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              {formType === 'signup' ? 'Register' : 'Login'}
            </button>
            <p onClick={onToggle} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {formType === 'signup' ? 'Already registered? Click here to login!' : 'New user? Click here to register!'}
            </p>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default SignupForm;
