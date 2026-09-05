import {
    ArrowRight,
    BedDouble,
    CalendarDays,
    Languages,
    LibraryBig,
    MapPin,
    MapPinned,
    Route,
    SlidersHorizontal,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const featureIcons = [CalendarDays, LibraryBig, MapPinned, Languages];

function LandingPage({ currentUser, onStart }) {
    const { t } = useTranslation();
    const primaryDestination = currentUser ? "/trips" : null;

    return (
        <div className="landing-page">
            <section className="landing-hero" aria-labelledby="landing-title">
                <div className="landing-hero-copy">
                    <p className="landing-eyebrow">{t("landing.eyebrow")}</p>
                    <h2 id="landing-title">{t("landing.title")}</h2>
                    <p className="landing-lead">{t("landing.lead")}</p>

                    <div className="landing-actions">
                        {primaryDestination ? (
                            <Link className="landing-primary-action" to={primaryDestination}>
                                {t("landing.viewTrips")}
                                <ArrowRight size={18} aria-hidden="true" />
                            </Link>
                        ) : (
                            <button className="landing-primary-action" type="button" onClick={onStart}>
                                {t("landing.startPlanning")}
                                <ArrowRight size={18} aria-hidden="true" />
                            </button>
                        )}
                        <Link className="landing-secondary-action" to="/library">
                            {t("landing.exploreLibrary")}
                        </Link>
                    </div>

                    <p className="landing-note">{t("landing.noCard")}</p>
                </div>

                <div className="landing-preview" aria-label={t("landing.previewLabel")}>
                    <div className="landing-preview-window">
                        <div className="landing-preview-toolbar" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <p>{t("landing.previewTrip")}</p>
                        </div>

                        <div className="landing-preview-heading">
                            <div>
                                <p>{t("landing.previewDates")}</p>
                                <h3>{t("landing.previewTitle")}</h3>
                            </div>
                            <span><WalletCards size={17} /> {t("landing.previewBudget")}</span>
                        </div>

                        <div className="landing-preview-controls">
                            <span><SlidersHorizontal size={15} /> {t("landing.previewFilters")}</span>
                            <span>{t("landing.previewDay")}</span>
                        </div>

                        <div className="landing-preview-items">
                            <article>
                                <span className="preview-item-icon preview-activity"><MapPin size={19} /></span>
                                <div><strong>{t("landing.previewShrine")}</strong><small>{t("landing.previewKyoto")}</small></div>
                                <span className="preview-map"><MapPinned size={17} /></span>
                            </article>
                            <article>
                                <span className="preview-item-icon preview-transport"><Route size={19} /></span>
                                <div><strong>{t("landing.previewTrain")}</strong><small>{t("landing.previewTrainRoute")}</small></div>
                                <strong>¥14,500</strong>
                            </article>
                            <article>
                                <span className="preview-item-icon preview-lodging"><BedDouble size={19} /></span>
                                <div><strong>{t("landing.previewHotel")}</strong><small>{t("landing.previewNights")}</small></div>
                                <strong>¥52,000</strong>
                            </article>
                        </div>
                    </div>
                    <div className="landing-preview-accent" aria-hidden="true">
                        <MapPinned size={20} />
                        <span>{t("landing.previewMapReady")}</span>
                    </div>
                </div>
            </section>

            <section className="landing-features" aria-labelledby="features-title">
                <div className="landing-section-heading">
                    <p className="landing-eyebrow">{t("landing.featuresEyebrow")}</p>
                    <h2 id="features-title">{t("landing.featuresTitle")}</h2>
                    <p>{t("landing.featuresLead")}</p>
                </div>

                <div className="landing-feature-grid">
                    {featureIcons.map((Icon, index) => (
                        <article key={index}>
                            <span><Icon size={22} aria-hidden="true" /></span>
                            <h3>{t(`landing.feature${index + 1}Title`)}</h3>
                            <p>{t(`landing.feature${index + 1}Text`)}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-library-callout">
                <div>
                    <p className="landing-eyebrow">{t("landing.libraryEyebrow")}</p>
                    <h2>{t("landing.libraryTitle")}</h2>
                    <p>{t("landing.libraryText")}</p>
                </div>
                <Link className="landing-primary-action" to="/library">
                    {t("landing.browseTemplates")}
                    <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}

export default LandingPage;
