function ConfirmDialog({
                           message,
                           warning,
                           confirmLabel = "Confirm",
                           cancelLabel = "Cancel",
                           onConfirm,
                           onCancel,
                       }) {
    return (
        <div className="confirm-dialog">
            <p>{message}</p>

            {warning && (
                <p className="confirm-warning">
                    {warning}
                </p>
            )}

            <div className="modal-actions">
                <button
                    type="button"
                    onClick={onCancel}
                >
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    className="danger-button"
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
}

export default ConfirmDialog;