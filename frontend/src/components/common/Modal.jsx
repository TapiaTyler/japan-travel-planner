import { useTranslation } from "react-i18next";

function Modal({
                   title,
                   children,
                   onClose,
                   closeLabel,
                   showCloseButton = true,
                   className = "",
               }) {
    const { t } = useTranslation();
    const resolvedCloseLabel = closeLabel ?? t("common.close");
    return (
        <div className="modal-backdrop" role="presentation">
            <section
                className={`modal ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-header">
                    <h2 id="modal-title">{title}</h2>

                    {showCloseButton && (
                        <button
                            type="button"
                            className="modal-close"
                            onClick={onClose}
                            aria-label={resolvedCloseLabel}
                            title={resolvedCloseLabel}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </section>
        </div>
    );
}

export default Modal;
