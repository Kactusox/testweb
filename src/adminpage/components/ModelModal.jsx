import { Modal } from 'react-bootstrap';
import ModelForm from './ModelForm';

const ModelModal = ({ isOpen, onClose, onSubmitSuccess, initialData }) => {
    const handleSubmitSuccess = () => {
        onSubmitSuccess();
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {initialData ? 'Edit Model' : 'Create New Model'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModelForm 
                    initialData={initialData}
                    onSubmitSuccess={handleSubmitSuccess}
                    onCancel={onClose}
                />
            </Modal.Body>
        </Modal>
    );
};

export default ModelModal;