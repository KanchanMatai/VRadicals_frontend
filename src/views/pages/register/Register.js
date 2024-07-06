import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import { toast } from 'react-hot-toast';

const Register = () => {
 
  const [formData, setFormData] = useState({
    userName: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      console.log(data)
      if (data.message) {
        // Show success message from the API response
        toast.success(data.message);
   
      } else {
        // If there's no message in the response, show a generic success message
        toast.success('Account created successfully');
      }
      setFormData({
        userName: '',
        age: '',
        email: '',
        mobile: '',
        address: '',
        password: '',

      });
      
    } catch (error) {
      console.error(error)
      // Handle registration error
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="userName"
                      placeholder="Username"
                      autoComplete="username"
                      value={formData.userName}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Age</CInputGroupText>
                    <CFormInput
                      name="age"
                      placeholder="Age"
                      autoComplete="age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Mobile</CInputGroupText>
                    <CFormInput
                      name="mobile"
                      placeholder="Mobile"
                      autoComplete="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Address</CInputGroupText>
                    <CFormInput
                      name="address"
                      placeholder="Address"
                      autoComplete="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </CInputGroup>
                
                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
