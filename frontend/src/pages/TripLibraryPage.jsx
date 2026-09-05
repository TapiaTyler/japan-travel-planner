import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import Modal from "../components/common/Modal.jsx";
import TripTemplateCard from "../components/library/TripTemplateCard.jsx";
import UseTemplateForm from "../components/library/UseTemplateForm.jsx";
import AddSavedItemToTripForm from "../components/library/AddSavedItemToTripForm.jsx";
import SavedItineraryItemCard from "../components/library/SavedItineraryItemCard.jsx";
import useTripLibrary from "../hooks/useTripLibrary.js";

function TemplateGrid({ templates, owned, onUse, onDelete }) {
    return (
        <div className="template-grid">
            {templates.map((template) => (
                <TripTemplateCard
                    key={template.id}
                    template={template}
                    owned={owned}
                    onUse={onUse}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

function TripLibraryPage({ currentUser, trips = [], onRequireAuth, onTripCreated, onItemAdded }) {
    const { t } = useTranslation();
    const library = useTripLibrary(currentUser);
    const [templateToUse, setTemplateToUse] = useState(null);
    const [pendingTemplate, setPendingTemplate] = useState(null);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [savedItemToAdd, setSavedItemToAdd] = useState(null);
    const [savedItemToDelete, setSavedItemToDelete] = useState(null);

    const activeTemplate = templateToUse ?? (currentUser ? pendingTemplate : null);

    function handleUse(template) {
        if (!currentUser) {
            setPendingTemplate(template);
            onRequireAuth();
            return;
        }

        setTemplateToUse(template);
    }

    async function handleCreateTrip(formData) {
        const trip = await library.createTripFromTemplate(activeTemplate.id, formData);
        setTemplateToUse(null);
        setPendingTemplate(null);
        await onTripCreated(trip);
    }

    async function handleDelete() {
        await library.removeTemplate(templateToDelete.id);
        setTemplateToDelete(null);
    }

    async function handleAddSavedItem({ tripId, date }) {
        await library.addSavedItem(savedItemToAdd.id, tripId, date);
        const destinationTrip = trips.find((trip) => trip.id === tripId);
        setSavedItemToAdd(null);
        await onItemAdded(destinationTrip);
    }

    async function handleDeleteSavedItem() {
        await library.removeSavedItem(savedItemToDelete.id);
        setSavedItemToDelete(null);
    }

    return (
        <section className="library-page">
            <div className="library-hero">
                <p className="template-eyebrow">{t("library.eyebrow")}</p>
                <h2>{t("library.title")}</h2>
                <p>{t("library.introduction")}</p>
            </div>

            {library.loading ? (
                <LoadingState title={t("library.loading")} message={t("library.loadingMessage")} />
            ) : (
                <>
                    {library.error && <p className="page-error" role="alert">{library.error}</p>}

                    <section className="library-section" aria-labelledby="featured-templates-heading">
                        <div className="library-section-heading">
                            <div>
                                <h3 id="featured-templates-heading">{t("library.featured")}</h3>
                                <p>{t("library.featuredHint")}</p>
                            </div>
                        </div>
                        <TemplateGrid templates={library.publicTemplates} onUse={handleUse} />
                    </section>

                    {currentUser && (
                        <>
                        <section className="library-section" aria-labelledby="my-templates-heading">
                            <div className="library-section-heading">
                                <div>
                                    <h3 id="my-templates-heading">{t("library.mine")}</h3>
                                    <p>{t("library.mineHint")}</p>
                                </div>
                            </div>
                            {library.myTemplates.length > 0 ? (
                                <TemplateGrid
                                    templates={library.myTemplates}
                                    owned
                                    onUse={handleUse}
                                    onDelete={setTemplateToDelete}
                                />
                            ) : (
                                <div className="library-empty-state">
                                    <h4>{t("library.noPersonalTemplates")}</h4>
                                    <p>{t("library.noPersonalTemplatesHint")}</p>
                                </div>
                            )}
                        </section>

                        <section className="library-section" aria-labelledby="saved-items-heading">
                            <div className="library-section-heading">
                                <div>
                                    <h3 id="saved-items-heading">{t("libraryItems.title")}</h3>
                                    <p>{t("libraryItems.hint")}</p>
                                </div>
                            </div>
                            {library.savedItems.length > 0 ? (
                                <div className="saved-items-grid">
                                    {library.savedItems.map((item) => (
                                        <SavedItineraryItemCard
                                            key={item.id}
                                            item={item}
                                            canAdd={trips.length > 0}
                                            onAdd={setSavedItemToAdd}
                                            onDelete={setSavedItemToDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="library-empty-state">
                                    <h4>{t("libraryItems.empty")}</h4>
                                    <p>{t("libraryItems.emptyHint")}</p>
                                </div>
                            )}
                        </section>
                        </>
                    )}
                </>
            )}

            {activeTemplate && (
                <Modal
                    title={t("library.useNamed", { name: activeTemplate.name })}
                    onClose={() => {
                        setTemplateToUse(null);
                        setPendingTemplate(null);
                    }}
                >
                    <UseTemplateForm
                        template={activeTemplate}
                        onCancel={() => {
                            setTemplateToUse(null);
                            setPendingTemplate(null);
                        }}
                        onSave={handleCreateTrip}
                    />
                </Modal>
            )}

            {templateToDelete && (
                <Modal title={t("library.deleteTemplate")} onClose={() => setTemplateToDelete(null)}>
                    <ConfirmDialog
                        message={t("library.deleteConfirmation", { name: templateToDelete.name })}
                        warning={t("library.deleteWarning")}
                        confirmLabel={t("common.delete")}
                        onCancel={() => setTemplateToDelete(null)}
                        onConfirm={handleDelete}
                    />
                </Modal>
            )}

            {savedItemToAdd && (
                <Modal
                    title={t("libraryItems.addNamed", { name: savedItemToAdd.name })}
                    onClose={() => setSavedItemToAdd(null)}
                >
                    <AddSavedItemToTripForm
                        item={savedItemToAdd}
                        trips={trips}
                        onCancel={() => setSavedItemToAdd(null)}
                        onSave={handleAddSavedItem}
                    />
                </Modal>
            )}

            {savedItemToDelete && (
                <Modal
                    title={t("libraryItems.delete")}
                    onClose={() => setSavedItemToDelete(null)}
                >
                    <ConfirmDialog
                        message={t("libraryItems.deleteConfirmation", { name: savedItemToDelete.name })}
                        warning={t("libraryItems.deleteWarning")}
                        confirmLabel={t("common.delete")}
                        onCancel={() => setSavedItemToDelete(null)}
                        onConfirm={handleDeleteSavedItem}
                    />
                </Modal>
            )}
        </section>
    );
}

export default TripLibraryPage;
