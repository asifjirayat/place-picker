const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button className="button-text" onClick={onCancel}>
          No
        </button>
        <button className="button-text" onClick={onConfirm}>
          Yes
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
