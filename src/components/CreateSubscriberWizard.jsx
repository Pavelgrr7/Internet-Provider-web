import React, { useState } from 'react';
import Modal from "./modal/Modal.jsx";
import SubscriberForm from "./modal/SubscriberForm.jsx";
import ContractForm from "./modal/ContractForm.jsx";

const CreateSubscriberWizard = ({ isOpen, onClose, onCreate }) => {
    const [step, setStep] = useState(1); // Текущий шаг (1 или 2)

    const [subscriberData, setSubscriberData] = useState(null);
    const [wizardData, setWizardData] = useState({
        subscriberData: null,
        contractData: null
    });

    const handleStep1Submit = (data) => {
        // Сохраняем данные шага 1
        setWizardData(prev => ({ ...prev, subscriberData: data }));
        setStep(2);
    };

    const handleStep2Submit = (data) => {
        // Сохраняем данные шага 2
        setWizardData(prev => ({ ...prev, contractData: data }));
        // Теперь отправляем полный пакет
        onCreate({
            subscriberData: wizardData.subscriberData,
            contractData: data // Берем самые свежие данные из формы
        });
    };

    const handleBack = () => {
        // Просто возвращаемся на шаг назад, данные уже сохранены
        setStep(1);
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
                    // Передаем сохраненные данные, если они есть
                    initialData={wizardData.subscriberData}
                />
            )}
            {step === 2 && (
                <ContractForm
                    onBack={handleBack} // <-- Передаем функцию "Назад"
                    onCancel={handleClose}
                    onSubmit={handleStep2Submit}
                    // Передаем сохраненные данные для второго шага
                    initialData={wizardData.contractData}
                />
            )}
        </Modal>
    );
};

export default CreateSubscriberWizard;