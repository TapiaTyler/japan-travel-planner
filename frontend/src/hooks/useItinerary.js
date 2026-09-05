// Imports
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import {
    createActivity,
    createLodging,
    createTransportation,
    deleteTripItem,
    getTripItems,
    saveItineraryItemToLibrary,
    updateActivity,
    updateLodging,
    updateTransportation,
} from "../api/api.js";

import {
    getItemLocation,
} from "../utils/itineraryUtils.js";
import {
    countActiveFilters,
    EMPTY_ITINERARY_FILTERS,
    FILTER_QUERY_KEYS,
    filterItineraryItems,
    getAvailableLocations,
} from "../utils/itineraryFilters.js";

function useItinerary(selectedTrip) {
    const [searchParams, setSearchParams] = useSearchParams();

    // States
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [hasLoadedItems, setHasLoadedItems] = useState(false);
    const [loadedTripId, setLoadedTripId] = useState(null);
    const [addingItem, setAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [savedLibraryItemName, setSavedLibraryItemName] = useState("");

    const [groupBy, setGroupBy] = useState("date");

    const activeSearchQuery = searchParams.get("q") ?? "";
    const filters = {
        dateFrom: searchParams.get("from") ?? "",
        dateTo: searchParams.get("to") ?? "",
        locations: searchParams.getAll("location"),
        itemTypes: searchParams.getAll("type"),
        costStatuses: searchParams.getAll("status"),
        minCost: searchParams.get("minCost") ?? "",
        maxCost: searchParams.get("maxCost") ?? "",
        transportationTypes: searchParams.getAll("transportation"),
    };

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
        setLoadingItems(true);

        try {
            const data = await getTripItems(tripId);

            setItems(data);
            setItineraryError("");

            return data;
        } catch (error) {
            setItineraryError(error.message);
            throw error;
        } finally {
            setLoadingItems(false);
            setHasLoadedItems(true);
            setLoadedTripId(tripId);
        }
    }

    async function refreshCurrentItems() {
        if (!selectedTrip) {
            return;
        }

        try {
            await loadItems(selectedTrip.id);

            setItineraryError("");
        } catch (error) {
            setItineraryError(error.message);
            throw error;
        }
    }

    function resetItineraryState() {
        setItems([]);
        setLoadingItems(false);
        setHasLoadedItems(false);
        setLoadedTripId(null);

        setAddingItem(false);
        setEditingItem(null);
        setItemToDelete(null);
        setSavedLibraryItemName("");

        setGroupBy("date");

        setPrintModalOpen(false);
        setPrintOptions(null);

        setItineraryError("");
    }

    // Data Logic
    const enrichedItems = items.map((item) => {
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

    const displayItems = filterItineraryItems(
        enrichedItems,
        activeSearchQuery,
        filters
    );

    const availableLocations = getAvailableLocations(enrichedItems);
    const activeFilterCount = countActiveFilters(filters);

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
    function handleSearch(event) {
        event.preventDefault();
        const query = new FormData(event.currentTarget)
            .get("query")
            ?.toString()
            .trim() ?? "";
        const nextParams = new URLSearchParams(searchParams);

        if (query) {
            nextParams.set("q", query);
        } else {
            nextParams.delete("q");
        }

        setSearchParams(nextParams, { replace: true });
    }

    async function handleSaveItemToLibrary(item) {
        try {
            const savedItem = await saveItineraryItemToLibrary(selectedTrip.id, item.id);
            setSavedLibraryItemName(savedItem.name);
            setItineraryError("");
            return savedItem;
        } catch (error) {
            setItineraryError(error.message);
            return null;
        }
    }

    function handleClearSearch() {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("q");
        setSearchParams(nextParams, { replace: true });
    }

    function handleFiltersChange(nextFilters) {
        const nextParams = new URLSearchParams(searchParams);

        FILTER_QUERY_KEYS.forEach((key) => nextParams.delete(key));

        if (nextFilters.dateFrom) nextParams.set("from", nextFilters.dateFrom);
        if (nextFilters.dateTo) nextParams.set("to", nextFilters.dateTo);
        if (nextFilters.minCost !== "") nextParams.set("minCost", nextFilters.minCost);
        if (nextFilters.maxCost !== "") nextParams.set("maxCost", nextFilters.maxCost);

        nextFilters.locations.forEach((value) => nextParams.append("location", value));
        nextFilters.itemTypes.forEach((value) => nextParams.append("type", value));
        nextFilters.costStatuses.forEach((value) => nextParams.append("status", value));
        nextFilters.transportationTypes.forEach(
            (value) => nextParams.append("transportation", value)
        );

        setSearchParams(nextParams, { replace: true });
    }

    function handleResetFilters() {
        handleFiltersChange(EMPTY_ITINERARY_FILTERS);
    }

    // Effects
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        resetItineraryState();

        if (selectedTrip) {
            loadItems(selectedTrip.id).catch(() => {});
        }
    }, [selectedTrip]);

    // Return
    return {
        items,
        displayItems,
        loadingItems,
        hasLoadedItems:
            hasLoadedItems && loadedTripId === selectedTrip?.id,
        groupedByDate,
        groupedByLocation,
        outsideTripItemCount,

        addingItem,
        editingItem,
        itemToDelete,
        savedLibraryItemName,

        groupBy,

        activeSearchQuery,
        filters,
        availableLocations,
        activeFilterCount,

        printModalOpen,
        printOptions,

        itineraryError,

        setAddingItem,
        setEditingItem,
        setItemToDelete,
        setSavedLibraryItemName,

        setGroupBy,

        setPrintModalOpen,
        setPrintOptions,

        handleAddItem,
        handleEditItem,
        handleSaveItem,
        handleConfirmDeleteItem,
        handleSaveItemToLibrary,

        handleSearch,
        handleClearSearch,
        handleFiltersChange,
        handleResetFilters,

        resetItineraryState,
    };
}

export default useItinerary;
