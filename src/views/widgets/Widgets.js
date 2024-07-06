import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Typography,
} from '@mui/material'
import { toast, Toaster } from 'react-hot-toast'

const Widgets = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null) // State to hold selected product for editing
  const [openModal, setOpenModal] = useState(false) // State to control modal open/close

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        toast.error('Error fetching products.')
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleEdit = async (productId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch product details')
      }
      const data = await response.json()
      setSelectedProduct(data) // Set selected product data to open modal
      setOpenModal(true) // Open the modal
    } catch (error) {
      toast.error('Failed to fetch product details')
      console.error('Error editing product:', error)
    }
  }

  
  const handleSaveChanges = async () => {
    try {
      const { _id, productName, price, description } = selectedProduct
      const response = await fetch(`http://localhost:4000/api/edit-product/${_id}`, {
        method: 'PUT', // Assuming PUT method for editing
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productName, price, description }),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      // Update frontend state or UI accordingly
      const updatedProducts = products.map((product) =>
        product._id === _id ? { ...product, productName, price, description } : product,
      )
      setProducts(updatedProducts) // Update products state with the edited product

      toast.success('Product updated successfully')
      setOpenModal(false) // Close the modal after successful update
    } catch (error) {
      toast.error('Failed to update product')
      console.error('Error updating product:', error)
    }
  }

  const handleCloseModal = () => {
    setSelectedProduct(null) // Clear selected product when closing modal
    setOpenModal(false) // Close the modal
  }

  const handleDelete = async (productId) => {
    try {
      const formData = new FormData()
      formData.append('productId', productId) // If productId needs to be part of the form data

      const response = await fetch(`http://localhost:4000/api/delete-product/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Content-Type: 'multipart/form-data' // Not typically needed for DELETE requests
        },
        body: formData, // Include formData as the body if required
      })

      const data = await response.json() // Parse response if expecting JSON data

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product')
      }

      // Update frontend state or UI accordingly
      const updatedProducts = products.filter((product) => product._id !== productId)
      setProducts(updatedProducts)

      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to delete product')
      console.error('Error deleting product:', error)
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Product url </TableCell>
              <TableCell>Discounted Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.productUrlSlug}</TableCell>
                <TableCell>{product.discountedPrice}</TableCell>
                <TableCell>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(product._id)}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for editing product */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-product-modal-title"
        aria-describedby="edit-product-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={openModal}>
          <Paper style={{ padding: 20, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
              Edit Product
            </Typography>
            <form>
              <TextField
                id="productName"
                label="Product Name"
                variant="outlined"
                value={selectedProduct ? selectedProduct.productName : ''}
                fullWidth
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, productName: e.target.value })
                }
                style={{ marginBottom: 10 }}
              />
              <TextField
                id="price"
                label="Price"
                variant="outlined"
                value={selectedProduct ? selectedProduct.price : ''}
                fullWidth
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                style={{ marginBottom: 10 }}
              />
              <TextField
                id="productUrlSlug"
                label="Product url"
                variant="outlined"
                value={selectedProduct ? selectedProduct.productUrlSlug : ''}
                fullWidth
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, productUrlSlug: e.target.value })
                }
                style={{ marginBottom: 10 }}
                disabled
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                style={{ marginTop: 10 }}
              >
                Save Changes
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>

      <Toaster />
    </>
  )
}

export default Widgets
