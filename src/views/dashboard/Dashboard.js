import React, { useState, useRef } from 'react'
import {
  CForm,
  CFormInput,
  CCol,
  CButton,
  CFormLabel,
  CInputGroup,
  CCard,
  CCardHeader,
} from '@coreui/react'
import { toast, Toaster } from 'react-hot-toast'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const Dashboard = () => {
  const [formData, setFormData] = useState({
    metaTitle: '',
    productName: '',
    productUrlSlug: '',
    price: '',
    description: '',
    galleryImages: [],
    discountedPrice: '',
  })

  const [validation, setValidation] = useState({
    metaTitle: false,
    productName: false,
    productUrlSlug: false,
    price: false,
    description: false,
    galleryImages: false,
    discountedPrice: false,
  })

  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { id, value, files } = e.target
    if (id === 'galleryImages') {
      setFormData((prevData) => ({
        ...prevData,
        [id]: files,
      }))
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }))
    }
  }

  const handleCKEditorChange = (event, editor) => {
    const data = editor.getData()
    setFormData((prevData) => ({ ...prevData, description: data }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isFormValid = Object.values(formData).every(
      (field) => field !== null && field !== '' && field.length !== 0
    )
    if (!isFormValid) {
      setValidation({
        metaTitle: formData.metaTitle.trim() === '',
        productName: formData.productName.trim() === '',
        productUrlSlug: formData.productUrlSlug.trim() === '',
        price: formData.price.trim() === '',
        galleryImages: !formData.galleryImages,
        discountedPrice: formData.discountedPrice.trim() === '',
        description: formData.description.trim() === '',
      })
      toast.error('Please fill in all required fields.')
      return
    }

    const {
      metaTitle,
      productName,
      productUrlSlug,
      price,
      description,
      galleryImages,
      discountedPrice,
    } = formData

    const formDataObj = new FormData()
    formDataObj.append('metaTitle', metaTitle)
    formDataObj.append('productName', productName)
    formDataObj.append('productUrlSlug', productUrlSlug)
    formDataObj.append('price', parseFloat(price))
    formDataObj.append('discountedPrice', parseFloat(discountedPrice))
    formDataObj.append('description', description)

    if (galleryImages) {
      Array.from(galleryImages).forEach((file) => {
        formDataObj.append('galleryImages', file)
      })
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authentication token not found. Please log in again.')
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/add-product', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(data.message || 'Product added successfully')
        setFormData({
          metaTitle: '',
          productName: '',
          productUrlSlug: '',
          price: '',
          description: '',
          galleryImages: [],
          discountedPrice: '',
        })
        setValidation({
          metaTitle: false,
          productName: false,
          productUrlSlug: false,
          price: false,
          description: false,
          galleryImages: false,
          discountedPrice: false,
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = null
        }
      } else if (response.status === 403) {
        toast.error(data.message || 'Access forbidden. Please try again.')
        setFormData({
          metaTitle: '',
          productName: '',
          productUrlSlug: '',
          price: '',
          description: '',
          galleryImages: [],
          discountedPrice: '',
        })
        setValidation({
          metaTitle: false,
          productName: false,
          productUrlSlug: false,
          price: false,
          description: false,
          galleryImages: false,
          discountedPrice: false,
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = null
        }
      } else {
        toast.error(data.message || 'Failed to add product')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-center">
          Add Product Details
        </CCardHeader>
      </CCard>

      <CForm className="row g-3 mt-3" onSubmit={handleSubmit}>
        <CCol md={4}>
          <CFormInput
            type="text"
            id="metaTitle"
            label="Meta Title"
            feedback="Looks good!"
            value={formData.metaTitle}
            onChange={handleChange}
            valid={validation.metaTitle && formData.metaTitle.trim() !== ''}
            invalid={validation.metaTitle && formData.metaTitle.trim() === ''}
            required
          />
        </CCol>

        <CCol md={4}>
          <CFormLabel htmlFor="productName">Product Name</CFormLabel>
          <CInputGroup className="has-validation">
            <CFormInput
              type="text"
              id="productName"
              feedback="Please choose a username."
              value={formData.productName}
              onChange={handleChange}
              aria-describedby="inputGroupPrepend03"
              valid={validation.productName && formData.productName.trim() !== ''}
              invalid={validation.productName && formData.productName.trim() === ''}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol md={4}>
          <CFormLabel htmlFor="productUrlSlug">Product URL Slug</CFormLabel>
          <CInputGroup className="has-validation">
            <CFormInput
              type="text"
              id="productUrlSlug"
              feedback="Please enter product url slug."
              aria-describedby="inputGroupPrepend03"
              value={formData.productUrlSlug}
              onChange={handleChange}
              valid={validation.productUrlSlug && formData.productUrlSlug.trim() !== ''}
              invalid={validation.productUrlSlug && formData.productUrlSlug.trim() === ''}
              required
            />
          </CInputGroup>
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="number"
            id="price"
            label="Price"
            feedback="Please enter price (maximum 3 digits)."
            maxLength={4}
            pattern="\d{1,3}"
            value={formData.price}
            onChange={handleChange}
            valid={validation.price && formData.price.trim() !== ''}
            invalid={validation.price && formData.price.trim() === ''}
            required
          />
        </CCol>
    
        <CCol md={4}>
          <label htmlFor="galleryImages" className="form-label">
            Choose image(s)
          </label>
          <input
            type="file"
            className="form-control"
            id="galleryImages"
            name="galleryImages"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            multiple
            required
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="number"
            id="discountedPrice"
            label="Discounted Price"
            feedback="Please enter a valid age (maximum 3 digits)."
            maxLength={4}
            pattern="\d{1,3}"
            value={formData.discountedPrice}
            onChange={handleChange}
            valid={
              validation.discountedPrice &&
              formData.discountedPrice.trim() !== ''
            }
            invalid={
              validation.discountedPrice &&
              formData.discountedPrice.trim() === ''
            }
            required
          />
        </CCol>
        <CCol md={4}>
          <label htmlFor="description">Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={handleCKEditorChange}
          />
        </CCol>
        <CCol xs={12} className="d-flex justify-content-center mt-4 mb-3">
          <div className="d-flex justify-content-center w-100">
            <CButton color="primary" type="submit">
              Add product
            </CButton>
          </div>
        </CCol>
      </CForm>
      <Toaster />
    </>
  )
}

export default Dashboard
