// Imports
import { useEffect, useState } from "react";

import {
    createTemplateFromTrip,
    createTrip,
    deleteTrip,
    duplicateTrip,
    getTrips,
    updateTrip,
} from "../api/api.js";

function useTrips(currentUser, selectedTripId) {
    // States
    const [trips, setTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [hasLoadedTrips, setHasLoadedTrips] = useState(false);
    const [addingTrip, setAddingTrip] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [tripToTemplate, setTripToTemplate] = useState(null);
    const [savedTemplateName, setSavedTemplateName] = useState("");
    const [tripError, setTripError] = useState("");

    const selectedTrip = selectedTripId
        ? trips.find(
            (trip) => String(trip.id) === selectedTripId
        ) ?? null
        : null;

    // Functions
    async function loadTrips() {
        setLoadingTrips(true);

        try {
            const data = await getTrips();

            setTrips(data);
            setTripError("");

            return data;
        } catch (error) {
            setTripError(error.message);
            throw error;
        } finally {
            setLoadingTrips(false);
            setHasLoadedTrips(true);
        }
    }

    // Handlers
    function handleSelectTrip() {
        setAddingTrip(false);
        setEditingTrip(null);
        setTripToDelete(null);
        setTripToTemplate(null);
        setTripError("");
    }

    async function handleAddTrip(formData) {
        await createTrip(formData);

        setAddingTrip(false);
        setTripError("");

        await loadTrips();
    }

    async function handleSaveTrip(formData) {
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

        setEditingTrip(null);
        setTripError("");

        return updatedTrip;
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

    async function handleSaveTripAsTemplate(formData) {
        const template = await createTemplateFromTrip(tripToTemplate.id, formData);
        setTripToTemplate(null);
        setSavedTemplateName(template.name);
        setTripError("");
        return template;
    }

    function handleBackToTrips() {
        setEditingTrip(null);
        setTripToDelete(null);
        setTripToTemplate(null);
        setTripError("");
    }

    // Effects
    useEffect(() => {
        if (currentUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadTrips().catch(() => {});
        } else {
            setTrips([]);
            setLoadingTrips(false);
            setHasLoadedTrips(false);
            setAddingTrip(false);
            setEditingTrip(null);
            setTripToDelete(null);
            setTripToTemplate(null);
            setSavedTemplateName("");
            setTripError("");
        }
    }, [currentUser]);

    // Return
    return {
        trips,
        selectedTrip,
        loadingTrips,
        hasLoadedTrips,
        addingTrip,
        editingTrip,
        tripToDelete,
        tripToTemplate,
        savedTemplateName,
        tripError,

        setAddingTrip,
        setEditingTrip,
        setTripToDelete,
        setTripToTemplate,
        setSavedTemplateName,

        handleSelectTrip,
        handleAddTrip,
        handleSaveTrip,
        handleDuplicateTrip,
        handleConfirmDeleteTrip,
        handleSaveTripAsTemplate,
        handleBackToTrips,
        loadTrips,
    };
}

export default useTrips;
