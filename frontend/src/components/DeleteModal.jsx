const DeleteModal = ({ task, deleting, onClose, onConfirm }) => (
  <>
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title">Delete Task</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Delete <strong>{task.title}</strong>? This cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show" />
  </>
);

export default DeleteModal;
