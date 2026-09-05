import { useState } from "react";
import { useTranslation } from "react-i18next";

function ConfirmDialog({
                           message,
                           warning,
                           confirmLabel,
                           cancelLabel,
                           onConfirm,
                           onCancel,
                       }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();

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
                    {cancelLabel ?? t("common.cancel")}
                </button>

                <button
                    type="button"
                    className="danger-button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t("common.deleting") : (confirmLabel ?? t("common.delete"))}
                </button>
            </div>
        </div>
    );
}

export default ConfirmDialog;
