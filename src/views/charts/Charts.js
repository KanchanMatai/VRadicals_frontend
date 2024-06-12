// import React, { useState } from 'react';
// import { CForm, CFormInput, CCol, CButton, CFormLabel, CInputGroup, CCard, CCardHeader } from '@coreui/react';
// import { toast, Toaster } from 'react-hot-toast';

// const Charts = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     address: '',
//     age: '',
//     mobile: ''
//   });

//   const [validation, setValidation] = useState({
//     email: false,
//     username: false,
//     address: false,
//     age: false,
//     mobile: false
//   });

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [id]: value }));
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // Check if all fields are filled
//     const isFormValid = Object.values(formData).every((field) => field.trim() !== '');
//     if (!isFormValid) {
//       setValidation({
//         email: formData.email.trim() === '',
//         username: formData.username.trim() === '',
//         address: formData.address.trim() === '',
//         age: formData.age.trim() === '',
//         mobile: formData.mobile.trim() === '',
//       });
//       toast.error('Please fill in all required fields.');
//       return;
//     }
  
//     const { email, username, address, age, mobile } = formData;
//     const requestBody = {
//       name: username,
//       age: age,
//       mobile: mobile,
//       email: email,
//       address: address,
//     };
  
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Authentication token not found. Please log in again.');
//       return;
//     }
  
//     try {
//       const response = await fetch('http://localhost:4000/api/hr/add-employee', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
  
//       const data = await response.json();
//       if (response.ok) {
//         toast.success(data.message || 'Employee added successfully');
//         setFormData({
//           email: '',
//           username: '',
//           address: '',
//           age: '',
//           mobile: '',
//         });
//         setValidation({
//           email: false,
//           username: false,
//           address: false,
//           age: false,
//           mobile: false,
//         });
//       } else if (response.status === 403) {
//         // Clear form fields if forbidden
//         toast.error(data.message || 'Access forbidden. Please try again.');
//         setFormData({
//           email: '',
//           username: '',
//           address: '',
//           age: '',
//           mobile: '',
//         });
//         setValidation({
//           email: false,
//           username: false,
//           address: false,
//           age: false,
//           mobile: false,
//         });
//       } else {
//         toast.error(data.message || 'Failed to add employee');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     }
//   };
  

 
//   return (
//     <>
//       <CCard>
//         <CCardHeader className="d-flex justify-content-center">Approve Employee</CCardHeader>
//       </CCard>

//       <CForm className="row g-3 mt-3" onSubmit={handleSubmit}>
//         <CCol md={4}>
//           <CFormInput
//             type="text"
//             id="employeeid"
//             label="Employee Id"
//             feedback="Looks good!"
//             value={formData.email}
//             onChange={handleChange}
//             valid={validation.email && formData.email.trim() !== ''}
//             invalid={validation.email && formData.email.trim() === ''}
//             required
//           />
//         </CCol>

    

//         <CCol xs={12} className="d-flex justify-content-center mt-4 mb-3">
//           <div className="d-flex justify-content-center w-100">
//             <CButton color="primary" type="submit">
//            Approve employee
//             </CButton>
//           </div>
//         </CCol>
//       </CForm>
//       <Toaster />
//     </>
//   );
// };

// export default Charts;



import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CCol, CButton, CCard, CCardHeader } from '@coreui/react';
import { toast, Toaster } from 'react-hot-toast';

const Charts = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [validation, setValidation] = useState(false);

  useEffect(() => {
    // Extract employeeId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('employeeId');
    if (id) {
      setEmployeeId(id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId.trim()) {
      toast.error('Please enter Employee Id.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/hr/approve-employee/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // You can send an empty body since the employeeId is in the URL
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Employee approved successfully');
        setEmployeeId('')
      } else if (response.status === 403) {
        toast.error(data.message || 'Access forbidden. Please try again.');
        setEmployeeId('')
      } else {
        toast.error(data.message || 'Failed to approve employee');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-center">Approve Employee</CCardHeader>
      </CCard>

      <CForm className="row g-3 mt-3" onSubmit={handleSubmit}>
        <CCol md={4}>
          <CFormInput
            type="text"
            id="employeeid"
            label="Employee Id"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </CCol>

        <CCol xs={12} className="d-flex justify-content-center mt-4 mb-3">
          <div className="d-flex justify-content-center w-100">
            <CButton color="primary" type="submit">
              Approve Employee
            </CButton>
          </div>
        </CCol>
      </CForm>
      <Toaster />
    </>
  );
};

export default Charts;
