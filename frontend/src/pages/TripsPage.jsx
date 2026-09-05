// Imports
import TripList from "../components/trips/TripList.jsx";
import Modal from "../components/common/Modal.jsx";
import AddTripForm from "../components/trips/AddTripForm.jsx";
import EditTripForm from "../components/trips/EditTripForm.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { useTranslation } from "react-i18next";

function TripsPage({
                       trips,
                       loadingTrips,
                       hasLoadedTrips,
                       tripError,
                       addingTrip,
                       editingTrip,
                       tripToDelete,

                       setAddingTrip,
                       setEditingTrip,
                       setTripToDelete,

                       handleSelectTrip,
                       handleAddTrip,
                       handleSaveTrip,
                       handleDuplicateTrip,
                       handleConfirmDeleteTrip,
                   }) {
    const { t } = useTranslation();
    if (!hasLoadedTrips) {
        return (
            <LoadingState
                title={t("trips.loading")}
                message={t("trips.loadingMessage")}
            />
        );
    }

    // Render
    return (
        <>
            {loadingTrips && (
                <p className="refresh-status" role="status">
                    {t("trips.refreshing")}
                </p>
            )}

            {tripError && (
                <p className="page-error" role="alert">
                    {tripError}
                </p>
            )}

            {(!tripError || trips.length > 0) && (
                <TripList
                    trips={trips}
                    onSelectTrip={handleSelectTrip}
                    onAddTrip={() => {
                        setEditingTrip(null);
                        setAddingTrip(true);
                    }}
                    onEditTrip={(trip) => {
                        setAddingTrip(false);
                        setEditingTrip(trip);
                    }}
                    onDuplicateTrip={handleDuplicateTrip}
                    onDeleteTrip={setTripToDelete}
                />
            )}

            {addingTrip && (
                <Modal
                    title={t("trips.new")}
                    onClose={() => setAddingTrip(false)}
                >
                    <AddTripForm
                        onCancel={() => setAddingTrip(false)}
                        onSave={handleAddTrip}
                    />
                </Modal>
            )}

            {editingTrip && (
                <Modal
                    title={t("trips.editNamed", { name: editingTrip.name })}
                    onClose={() => setEditingTrip(null)}
                >
                    <EditTripForm
                        trip={editingTrip}
                        onCancel={() => setEditingTrip(null)}
                        onSave={handleSaveTrip}
                    />
                </Modal>
            )}

            {tripToDelete && (
                <Modal
                    title={t("trips.delete")}
                    onClose={() => setTripToDelete(null)}
                >
                    <ConfirmDialog
                        message={t("trips.deleteNamed", { name: tripToDelete.name })}
                        warning={t("trips.deleteWarning")}
                        confirmLabel={t("trips.delete")}
                        onCancel={() => setTripToDelete(null)}
                        onConfirm={handleConfirmDeleteTrip}
                    />
                </Modal>
            )}
        </>
    );
}

export default TripsPage;
