// Imports
import TripList from "../components/trips/TripList.jsx";
import Modal from "../components/common/Modal.jsx";
import AddTripForm from "../components/trips/AddTripForm.jsx";
import EditTripForm from "../components/trips/EditTripForm.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";

function TripsPage({
                       trips,
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
    // Render
    return (
        <>
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

            {addingTrip && (
                <Modal
                    title="New Trip"
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
                    title={`Edit ${editingTrip.name}`}
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
                    title="Delete Trip"
                    onClose={() => setTripToDelete(null)}
                >
                    <ConfirmDialog
                        message={`Permanently delete "${tripToDelete.name}"?`}
                        warning={
                            "This will permanently delete the trip and all of its itinerary items. This action cannot be undone."
                        }
                        confirmLabel="Delete Trip"
                        onCancel={() => setTripToDelete(null)}
                        onConfirm={handleConfirmDeleteTrip}
                    />
                </Modal>
            )}
        </>
    );
}

export default TripsPage;