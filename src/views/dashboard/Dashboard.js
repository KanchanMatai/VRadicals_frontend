import React, { useState } from 'react';
import { CForm, CFormInput, CCol, CButton, CFormLabel, CInputGroup, CCard, CCardHeader } from '@coreui/react';
import { toast, Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    address: '',
    age: '',
    mobile: ''
  });

  const [validation, setValidation] = useState({
    email: false,
    username: false,
    address: false,
    age: false,
    mobile: false
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all fields are filled
    const isFormValid = Object.values(formData).every((field) => field.trim() !== '');
    if (!isFormValid) {
      setValidation({
        email: formData.email.trim() === '',
        username: formData.username.trim() === '',
        address: formData.address.trim() === '',
        age: formData.age.trim() === '',
        mobile: formData.mobile.trim() === '',
      });
      toast.error('Please fill in all required fields.');
      return;
    }
  
    const { email, username, address, age, mobile } = formData;
    const requestBody = {
      name: username,
      age: age,
      mobile: mobile,
      email: email,
      address: address,
    };
  
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/hr/add-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Employee added successfully');
        setFormData({
          email: '',
          username: '',
          address: '',
          age: '',
          mobile: '',
        });
        setValidation({
          email: false,
          username: false,
          address: false,
          age: false,
          mobile: false,
        });
      } else if (response.status === 403) {
        // Clear form fields if forbidden
        toast.error(data.message || 'Access forbidden. Please try again.');
        setFormData({
          email: '',
          username: '',
          address: '',
          age: '',
          mobile: '',
        });
        setValidation({
          email: false,
          username: false,
          address: false,
          age: false,
          mobile: false,
        });
      } else {
        toast.error(data.message || 'Failed to add employee');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };
  

 
  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-center">Add Employee</CCardHeader>
      </CCard>

      <CForm className="row g-3 mt-3" onSubmit={handleSubmit}>
        <CCol md={4}>
          <CFormInput
            type="text"
            id="email"
            label="Email"
            feedback="Looks good!"
            value={formData.email}
            onChange={handleChange}
            valid={validation.email && formData.email.trim() !== ''}
            invalid={validation.email && formData.email.trim() === ''}
            required
          />
        </CCol>

        <CCol md={4}>
          <CFormLabel htmlFor="username">Username</CFormLabel>
          <CInputGroup className="has-validation">
            <CFormInput
              type="text"
              id="username"
              feedback="Please choose a username."
              value={formData.username}
              onChange={handleChange}
              aria-describedby="inputGroupPrepend03"
              valid={validation.username && formData.username.trim() !== ''}
              invalid={validation.username && formData.username.trim() === ''}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="address">Address</CFormLabel>
          <CInputGroup className="has-validation">
            <CFormInput
              type="text"
              id="address"
              feedback="Please enter address."
              aria-describedby="inputGroupPrepend03"
              value={formData.address}
              onChange={handleChange}
              valid={validation.address && formData.address.trim() !== ''}
              invalid={validation.address && formData.address.trim() === ''}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="text"
            id="age"
            label="Age"
            feedback="Please enter a valid age (maximum 3 digits)."
            maxLength={3}
            pattern="\d{1,3}"
            value={formData.age}
            onChange={handleChange}
            valid={validation.age && formData.age.trim() !== ''}
            invalid={validation.age && formData.age.trim() === ''}
            required
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="tel"
            label="Mobile Number"
            id="mobile"
            feedback="Please enter a valid 10-digit mobile number."
            pattern="\d{10}"
            minLength={10}
            maxLength={10}
            value={formData.mobile}
            onChange={handleChange}
            valid={validation.mobile && formData.mobile.trim() !== ''}
            invalid={validation.mobile && formData.mobile.trim() === ''}
            required
          />
        </CCol>

        <CCol xs={12} className="d-flex justify-content-center mt-4 mb-3">
          <div className="d-flex justify-content-center w-100">
            <CButton color="primary" type="submit">
            Add employee
            </CButton>
          </div>
        </CCol>
      </CForm>
      <Toaster />
    </>
  );
};

export default Dashboard;

