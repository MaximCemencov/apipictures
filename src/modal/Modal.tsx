import React, {useEffect, useState, useRef} from 'react';
import './Modal.css';
import {ImageData} from '../interfaces/imageData';
import {ModalProps} from '../interfaces/ModalProps';

const Modal: React.FC<ModalProps> = ({imageId, onClose}) => {
    const [image, setImage] = useState<string>('');
    const [newComment, setNewComment] = useState<string>('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchImage();
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchImage = async () => {
        try {
            const response = await fetch(`http://test-backend.itdelta.agency/api/image/${imageId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data: ImageData = await response.json();
            setImage(data.image);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const handleAddComment = async () => {
        try {
            console.log(imageId)
            const response = await fetch(`http://test-backend.itdelta.agency/api/image/${imageId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({comment: newComment}),
            });

            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            onClose();

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content" ref={modalRef}>
                <img src={image} alt="Image"/>
                <div className="modal-comment">
                    <div className="comment-name">Comment</div>
                    <textarea
                        value={newComment}
                        className="modal-textarea"
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <div className="comment-desc">Write a few sentences about the photo.</div>
                </div>
                <button className="button" onClick={handleAddComment}>Save</button>
            </div>
        </div>
    );
};

export default Modal;
