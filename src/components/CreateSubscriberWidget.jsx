import React, { useState } from 'react';
import Modal from "./modal/Modal.jsx";
import SubscriberForm from "./modal/SubscriberForm.jsx";
import ContractForm from "./modal/ContractForm.jsx";

const CreateSubscriberWizard = ({ isOpen, onClose, onCreate }) => {
    const [step, setStep] = useState(1); // Текущий шаг (1 или 2)
    const [subscriberData, setSubscriberData] = useState(null);

    const handleStep1Submit = (data) => {
        setSubscriberData(data);
        setStep(2);
    };

    const handleStep2Submit = (contractData) => {
        const fullPackage = {
            subscriberData,
            contractData
        };
        onCreate(fullPackage);
    };

    const handleClose = () => {
        setStep(1);
        setSubscriberData(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            {step === 1 && (
                <SubscriberForm
                    onCancel={handleClose}
                    onSubmit={handleStep1Submit}
                />
            )}
            {step === 2 && (
                <ContractForm
                    onBack={() => setStep(1)}
                    onCancel={handleClose}
                    onSubmit={handleStep2Submit}
                />
            )}
        </Modal>
    );
};