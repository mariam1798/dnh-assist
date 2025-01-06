import React from "react";
import Modal from "react-modal";
import close from "../../assets/images/icons/close.svg";

const CancelModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  handleCloseModal,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cancel Booking Confirmation"
      ariaHideApp={false}
      className="modal modal--cancel"
      overlayClassName="Overlay"
    >
      <div className="modal__icon">
        <img
          onClick={handleCloseModal}
          src={close}
          alt="close icon"
          className="modal__close"
        />
      </div>

      <div className="modal__container">
        <h2 className="modal__title">
          Are you sure you want to cancel your booking?
        </h2>
        <div className="modal__actions">
          <button className="modal__submit" onClick={onConfirm}>
            Yes, cancel
          </button>
          <button className="modal__cancel" onClick={onRequestClose}>
            No, keep it
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelModal;
