import React, { useEffect, useState } from 'react';
import './App.css';
import { ImageData } from './interfaces/imageData';
import Modal from './modal/Modal';

const App: React.FC = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('http://test-backend.itdelta.agency/api/images');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const data: ImageData[] = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const openModal = (imageId: number) => {
        setSelectedImageId(imageId);
    };

    const closeModal = () => {
        setSelectedImageId(null);
    };

    return (
        <div className="image-container">
            {images.map(imageData => (
                <img
                    key={imageData.id}
                    src={imageData.image}
                    alt="image"
                    onClick={() => openModal(imageData.id)}
                />
            ))}
            {selectedImageId !== null && (
                <Modal imageId={selectedImageId} onClose={closeModal} />
            )}
        </div>
    );
};

export default App;
