import { useCallback, useEffect, useState } from "react";
import {
    deleteTemplate,
    getMyTemplates,
    getPublicTemplates,
    instantiateTemplate,
} from "../api/api.js";

function useTripLibrary(currentUser) {
    const [publicTemplates, setPublicTemplates] = useState([]);
    const [myTemplates, setMyTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTemplates = useCallback(async () => {
        setLoading(true);

        try {
            const [featured, personal] = await Promise.all([
                getPublicTemplates(),
                currentUser ? getMyTemplates() : Promise.resolve([]),
            ]);
            setPublicTemplates(featured);
            setMyTemplates(personal);
            setError("");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadTemplates();
    }, [loadTemplates]);

    async function createTripFromTemplate(templateId, trip) {
        return instantiateTemplate(templateId, trip);
    }

    async function removeTemplate(templateId) {
        await deleteTemplate(templateId);
        setMyTemplates((templates) =>
            templates.filter((template) => template.id !== templateId)
        );
    }

    return {
        publicTemplates,
        myTemplates,
        loading,
        error,
        createTripFromTemplate,
        removeTemplate,
    };
}

export default useTripLibrary;
