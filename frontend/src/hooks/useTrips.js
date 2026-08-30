// Imports
import { useEffect, useState } from "react";

import {
    createTrip,
    deleteTrip,
    duplicateTrip,
    getTrips,
    updateTrip,
} from "../api/api.js";

function useTrips(currentUser) {
    // States
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [addingTrip, setAddingTrip] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [tripError, setTripError] = useState("");

    // Functions
    async function loadTrips() {
        try {
            const data = await getTrips();

            setTrips(data);
            setTripError("");

            return data;
        } catch (error) {
            setTripError(error.message);
            throw error;
        }
    }

    // Handlers
    function handleSelectTrip(trip) {
        setSelectedTrip(trip);

        setAddingTrip(false);
        setEditingTrip(null);
        setTripToDelete(null);
        setTripError("");
    }

    async function handleAddTrip(formData) {
        try {
            await createTrip(formData);

            setAddingTrip(false);
            setTripError("");

            await loadTrips();
        } catch (error) {
            throw error;
        }
    }

    async function handleSaveTrip(formData) {
        try {
            const updatedTrip = await updateTrip(
                editingTrip.id,
                formData
            );

            setTrips((currentTrips) =>
                currentTrips.map((trip) =>
                    trip.id === updatedTrip.id
                        ? updatedTrip
                        : trip
                )
            );

            if (selectedTrip?.id === updatedTrip.id) {
                setSelectedTrip(updatedTrip);
            }

            setEditingTrip(null);
            setTripError("");

            return updatedTrip;
        } catch (error) {
            throw error;
        }
    }

    async function handleDuplicateTrip(trip) {
        try {
            await duplicateTrip(trip.id);

            setTripError("");

            await loadTrips();
        } catch (error) {
            setTripError(error.message);
        }
    }

    async function handleConfirmDeleteTrip() {
        if (!tripToDelete) {
            return;
        }

        try {
            await deleteTrip(tripToDelete.id);

            setTripToDelete(null);
            setTripError("");

            await loadTrips();
        } catch (error) {
            setTripError(error.message);
        }
    }

    function handleBackToTrips() {
        setSelectedTrip(null);
        setEditingTrip(null);
        setTripToDelete(null);
        setTripError("");
    }

    // Effects
    useEffect(() => {
        if (currentUser) {
            loadTrips();
        } else {
            setTrips([]);
            setSelectedTrip(null);
            setAddingTrip(false);
            setEditingTrip(null);
            setTripToDelete(null);
            setTripError("");
        }
    }, [currentUser]);

    // Return
    return {
        trips,
        selectedTrip,
        addingTrip,
        editingTrip,
        tripToDelete,
        tripError,

        setAddingTrip,
        setEditingTrip,
        setTripToDelete,

        handleSelectTrip,
        handleAddTrip,
        handleSaveTrip,
        handleDuplicateTrip,
        handleConfirmDeleteTrip,
        handleBackToTrips,
    };
}

export default useTrips;