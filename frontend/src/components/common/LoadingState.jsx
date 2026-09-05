import logo from "../../assets/jtp-logo.png";
import { useTranslation } from "react-i18next";

function LoadingState({
                          title,
                          message,
                          fullPage = false,
                          showBrand = false,
                      }) {
    const { t } = useTranslation();
    return (
        <section
            className={
                fullPage
                    ? "loading-state loading-state-full"
                    : "loading-state"
            }
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            {showBrand && (
                <img
                    src={logo}
                    alt=""
                    className="loading-state-logo"
                    aria-hidden="true"
                />
            )}

            <span className="loading-spinner" aria-hidden="true" />
            <h2>{title ?? t("common.loading")}</h2>
            {message && <p>{message}</p>}
        </section>
    );
}

export default LoadingState;
