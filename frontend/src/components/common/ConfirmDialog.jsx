import { useState } from "react";

function ConfirmDialog({
                           message,
                           warning,
                           confirmLabel = "Confirm",
                           cancelLabel = "Cancel",
                           onConfirm,
                           onCancel,
                       }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleConfirm() {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await onConfirm();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="confirm-dialog" aria-busy={isSubmitting}>
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
                    disabled={isSubmitting}
                >
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    className="danger-button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Deleting..." : confirmLabel}
                </button>
            </div>
        </div>
    );
}

export default ConfirmDialog;
