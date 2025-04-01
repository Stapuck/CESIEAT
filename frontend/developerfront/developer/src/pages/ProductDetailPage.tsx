import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();

    // Mock data for demonstration purposes
    const product = {
        id: productId,
        name: 'Sample Product',
        description: 'This is a detailed description of the product.',
        price: 99.99,
        imageUrl: 'https://via.placeholder.com/300',
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Product Details</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                />
                <div>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>
                        <strong>Price:</strong> ${product.price.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;