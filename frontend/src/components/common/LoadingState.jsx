import logo from "../../assets/jtp-logo.png";

function LoadingState({
                          title = "Loading",
                          message = "Please wait...",
                          fullPage = false,
                          showBrand = false,
                      }) {
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
            <h2>{title}</h2>
            <p>{message}</p>
        </section>
    );
}

export default LoadingState;
