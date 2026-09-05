import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    addSavedItemToTrip,
    deleteSavedItineraryItem,
    deleteTemplate,
    getSavedItineraryItems,
    getMyTemplates,
    getPublicTemplates,
    instantiateTemplate,
} from "../api/api.js";

function useTripLibrary(currentUser) {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage;
    const [publicTemplates, setPublicTemplates] = useState([]);
    const [myTemplates, setMyTemplates] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTemplates = useCallback(async () => {
        setLoading(true);

        try {
            const [featured, personal, reusableItems] = await Promise.all([
                getPublicTemplates(language),
                currentUser ? getMyTemplates() : Promise.resolve([]),
                currentUser ? getSavedItineraryItems() : Promise.resolve([]),
            ]);
            setPublicTemplates(featured);
            setMyTemplates(personal);
            setSavedItems(reusableItems);
            setError("");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }, [currentUser, language]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadTemplates();
    }, [loadTemplates]);

    async function createTripFromTemplate(templateId, trip) {
        return instantiateTemplate(templateId, trip, language);
    }

    async function removeTemplate(templateId) {
        await deleteTemplate(templateId);
        setMyTemplates((templates) =>
            templates.filter((template) => template.id !== templateId)
        );
    }

    async function addSavedItem(savedItemId, tripId, date) {
        await addSavedItemToTrip(savedItemId, tripId, date);
    }

    async function removeSavedItem(savedItemId) {
        await deleteSavedItineraryItem(savedItemId);
        setSavedItems((items) => items.filter((item) => item.id !== savedItemId));
    }

    return {
        publicTemplates,
        myTemplates,
        savedItems,
        loading,
        error,
        createTripFromTemplate,
        removeTemplate,
        addSavedItem,
        removeSavedItem,
    };
}

export default useTripLibrary;
