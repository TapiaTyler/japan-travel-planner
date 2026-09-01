// Imports
import { useEffect, useState } from "react";

import {
    createActivity,
    createLodging,
    createTransportation,
    deleteTripItem,
    getTripItems,
    searchTripItems,
    updateActivity,
    updateLodging,
    updateTransportation,
} from "../api/api.js";

import {
    getItemLocation,
} from "../utils/itineraryUtils.js";

function useItinerary(selectedTrip) {
    // States
    const [items, setItems] = useState([]);
    const [addingItem, setAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [groupBy, setGroupBy] = useState("date");

    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchQuery, setActiveSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);

    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [printOptions, setPrintOptions] = useState(null);

    const [itineraryError, setItineraryError] = useState("");

    // Functions
    function getDateValue(date) {
        const [year, month, day] = date
            .split("-")
            .map(Number);

        return Date.UTC(
            year,
            month - 1,
            day
        );
    }

    async function loadItems(tripId) {
        try {
            const data = await getTripItems(tripId);

            setItems(data);
            setItineraryError("");

            return data;
        } catch (error) {
            setItineraryError(error.message);
            throw error;
        }
    }

    async function refreshCurrentItems() {
        if (!selectedTrip) {
            return;
        }

        try {
            if (activeSearchQuery) {
                const data = await searchTripItems(
                    selectedTrip.id,
                    activeSearchQuery
                );

                setItems(data);
            } else {
                await loadItems(selectedTrip.id);
            }

            setItineraryError("");
        } catch (error) {
            setItineraryError(error.message);
            throw error;
        }
    }

    function resetItineraryState() {
        setItems([]);

        setAddingItem(false);
        setEditingItem(null);
        setItemToDelete(null);

        setGroupBy("date");

        setSearchQuery("");
        setActiveSearchQuery("");
        setSearching(false);

        setPrintModalOpen(false);
        setPrintOptions(null);

        setItineraryError("");
    }

    // Data Logic
    const displayItems = items.map((item) => {
        if (
            !selectedTrip ||
            !item.date ||
            !selectedTrip.startDate ||
            !selectedTrip.endDate
        ) {
            return {
                ...item,
                outsideTripDates: false,
            };
        }

        const itemDate = getDateValue(item.date);
        const tripStart = getDateValue(selectedTrip.startDate);
        const tripEnd = getDateValue(selectedTrip.endDate);

        const outsideTripDates =
            itemDate < tripStart ||
            itemDate > tripEnd;

        let dayNumber = null;

        if (!outsideTripDates) {
            const millisecondsPerDay =
                1000 * 60 * 60 * 24;

            dayNumber =
                Math.round(
                    (itemDate - tripStart) /
                    millisecondsPerDay
                ) + 1;
        }

        return {
            ...item,
            outsideTripDates,
            dayNumber,
        };
    });

    const groupedByDate = displayItems.reduce(
        (groups, item) => {
            const key =
                item.date ?? "Unscheduled";

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(item);

            return groups;
        },
        {}
    );

    const groupedByLocation = displayItems.reduce(
        (groups, item) => {
            const key =
                getItemLocation(item);

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(item);

            return groups;
        },
        {}
    );

    const outsideTripItemCount =
        displayItems.filter(
            (item) => item.outsideTripDates
        ).length;

    // Handlers
    async function handleAddItem(
        itemType,
        formData
    ) {
        const normalizedItem = {
            ...formData,
            cost:
                formData.cost === "" ||
                formData.cost === null
                    ? null
                    : Number(formData.cost),
        };

        if (itemType === "Activity") {
            await createActivity(
                selectedTrip.id,
                normalizedItem
            );
        } else if (
            itemType === "Transportation"
        ) {
            await createTransportation(
                selectedTrip.id,
                normalizedItem
            );
        } else if (
            itemType === "Lodging"
        ) {
            await createLodging(
                selectedTrip.id,
                normalizedItem
            );
        } else {
            throw new Error(
                "Unsupported itinerary item type."
            );
        }

        setAddingItem(false);
        setItineraryError("");

        await refreshCurrentItems();
    }

    function handleEditItem(item) {
        setAddingItem(false);
        setEditingItem(item);
    }

    async function handleSaveItem(
        updatedItem
    ) {
        const normalizedItem = {
            ...updatedItem,
            cost:
                updatedItem.cost === "" ||
                updatedItem.cost === null
                    ? null
                    : Number(updatedItem.cost),
        };

        let savedItem;

        if (
            updatedItem.itemType ===
            "Activity"
        ) {
            savedItem =
                await updateActivity(
                    selectedTrip.id,
                    updatedItem.id,
                    normalizedItem
                );
        } else if (
            updatedItem.itemType ===
            "Transportation"
        ) {
            savedItem =
                await updateTransportation(
                    selectedTrip.id,
                    updatedItem.id,
                    normalizedItem
                );
        } else if (
            updatedItem.itemType ===
            "Lodging"
        ) {
            savedItem =
                await updateLodging(
                    selectedTrip.id,
                    updatedItem.id,
                    normalizedItem
                );
        } else {
            throw new Error(
                "Unsupported itinerary item type."
            );
        }

        setEditingItem(null);
        setItineraryError("");

        await refreshCurrentItems();

        return savedItem;
    }

    async function handleConfirmDeleteItem() {
        if (
            !itemToDelete ||
            !selectedTrip
        ) {
            return;
        }

        try {
            await deleteTripItem(
                selectedTrip.id,
                itemToDelete.id
            );

            setItems((currentItems) =>
                currentItems.filter(
                    (item) =>
                        item.id !==
                        itemToDelete.id
                )
            );

            setItemToDelete(null);
            setItineraryError("");
        } catch (error) {
            setItineraryError(error.message);
        }
    }

    // Search Handlers
    async function handleSearch(event) {
        event.preventDefault();

        if (!selectedTrip) {
            return;
        }

        const trimmedQuery =
            searchQuery.trim();

        if (!trimmedQuery) {
            await handleClearSearch();
            return;
        }

        try {
            setSearching(true);

            const data =
                await searchTripItems(
                    selectedTrip.id,
                    trimmedQuery
                );

            setItems(data);
            setActiveSearchQuery(
                trimmedQuery
            );

            setItineraryError("");
        } catch (error) {
            setItineraryError(error.message);
        } finally {
            setSearching(false);
        }
    }

    async function handleClearSearch() {
        setSearchQuery("");
        setActiveSearchQuery("");

        if (selectedTrip) {
            await loadItems(
                selectedTrip.id
            );
        }
    }

    // Effects
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        resetItineraryState();

        if (selectedTrip) {
            loadItems(selectedTrip.id);
        }
    }, [selectedTrip]);

    // Return
    return {
        items,
        displayItems,
        groupedByDate,
        groupedByLocation,
        outsideTripItemCount,

        addingItem,
        editingItem,
        itemToDelete,

        groupBy,

        searchQuery,
        activeSearchQuery,
        searching,

        printModalOpen,
        printOptions,

        itineraryError,

        setAddingItem,
        setEditingItem,
        setItemToDelete,

        setGroupBy,

        setSearchQuery,

        setPrintModalOpen,
        setPrintOptions,

        handleAddItem,
        handleEditItem,
        handleSaveItem,
        handleConfirmDeleteItem,

        handleSearch,
        handleClearSearch,

        resetItineraryState,
    };
}

export default useItinerary;