function Modal({
                   title,
                   children,
                   onClose,
                   closeLabel = "Close",
                   showCloseButton = true,
                   className = "",
               }) {
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
                            aria-label={closeLabel}
                            title={closeLabel}
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