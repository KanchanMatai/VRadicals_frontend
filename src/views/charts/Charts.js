
import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';

const Charts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Product Images</h2>
      <Carousel>
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <div className="d-flex justify-content-center">
              {product.galleryImages.map((image, index) => (
                <img
                  key={index}
                  // className="d-block w-100"
                  className="img-fluid rounded" 
                  style={{ maxHeight: '400px', objectFit: 'cover' }} // Adjust max height and object fit as needed
                  src={`http://localhost:4000/${image.replace(/\\/g, '/')}`} // Replace backslashes with forward slashes
                  alt={`Slide ${index}`}
                  onLoad={() => console.log(`Image ${index} loaded`)}
                  onError={(e) => console.error(`Error loading image ${index}:`, e)}
                />
              ))}
            </div>
            <Carousel.Caption>
              <h3>{product.productName}</h3>
              {/* <p>{product.description}</p> */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Charts;
