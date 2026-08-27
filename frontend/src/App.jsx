import { useEffect, useState } from "react";
import "./App.css";

import AddItemForm from "./components/AddItemForm";
import AddTripForm from "./components/AddTripForm";
import CostSummary from "./components/CostSummary";
import EditItemForm from "./components/EditItemForm";
import EditTripForm from "./components/EditTripForm";
import GroupToggle from "./components/GroupToggle";
import ItineraryItem from "./components/ItineraryItem";
import PrintableItinerary from "./components/PrintableItinerary";
import QuickJumpNav from "./components/QuickJumpNav";
import TripList from "./components/TripList";

import {
    createActivity,
    createLodging,
    createTransportation,
    createTrip,
    deleteTrip,
    deleteTripItem,
    getTripItems,
    getTrips,
    login,
    searchTripItems,
    updateActivity,
    updateLodging,
    updateTransportation,
    updateTrip,
} from "./api/api";

import {
    formatDateHeading,
    formatDateLabel,
    getItemLocation,
} from "./utils/itineraryUtils";

function scrollToGroup(groupKey) {
    const element = document.getElementById(`group-${groupKey}`);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
}

function App() {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const [showPrintableItinerary, setShowPrintableItinerary] = useState(false);

    const [items, setItems] = useState([]);

    const [activeSearchQuery, setActiveSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);

    const [addingTrip, setAddingTrip] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);

    const [addingItem, setAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [groupBy, setGroupBy] = useState("date");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const [error, setError] = useState("");

    const loadTrips = async () => {
        try {
            const data = await getTrips();
            setTrips(data);
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    const loadItems = async (tripId) => {
        try {
            const data = await getTripItems(tripId);
            setItems(data);
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    /*
     * Recalculate itinerary day information against the CURRENT trip dates.
     *
     * This deliberately does not modify the stored item dates.
     * If the user temporarily changes the trip dates, existing itinerary
     * items remain untouched and are simply marked as outside the trip.
     */
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

        const itemDate = new Date(`${item.date}T00:00:00`);
        const tripStart = new Date(`${selectedTrip.startDate}T00:00:00`);
        const tripEnd = new Date(`${selectedTrip.endDate}T00:00:00`);

        const outsideTripDates =
            itemDate < tripStart || itemDate > tripEnd;

        let dayNumber = null;

        if (!outsideTripDates) {
            const millisecondsPerDay = 1000 * 60 * 60 * 24;

            dayNumber =
                Math.round(
                    (itemDate.getTime() - tripStart.getTime()) /
                    millisecondsPerDay
                ) + 1;
        }

        return {
            ...item,
            outsideTripDates,
            dayNumber,
        };
    });

    const groupedByDate = displayItems.reduce((groups, item) => {
        const key = item.date ?? "Unscheduled";

        if (!groups[key]) {
            groups[key] = [];
        }

        groups[key].push(item);

        return groups;
    }, {});

    const groupedByLocation = displayItems.reduce((groups, item) => {
        const key = getItemLocation(item);

        if (!groups[key]) {
            groups[key] = [];
        }

        groups[key].push(item);

        return groups;
    }, {});

    const outsideTripItemCount = displayItems.filter(
        (item) => item.outsideTripDates
    ).length;

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            await login(username, password);

            setLoggedIn(true);
            setError("");

            await loadTrips();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddTrip = async (formData) => {
        await createTrip(formData);

        setAddingTrip(false);
        setError("");

        await loadTrips();
    };

    const handleSaveTrip = async (formData) => {
        await updateTrip(editingTrip.id, formData);

        setEditingTrip(null);
        setError("");

        await loadTrips();
    };

    const handleDeleteTrip = async (trip) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${trip.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteTrip(trip.id);

            setError("");
            await loadTrips();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddItem = async (itemType, formData) => {
        const normalizedItem = {
            ...formData,
            cost:
                formData.cost === "" || formData.cost === null
                    ? null
                    : Number(formData.cost),
        };

        if (itemType === "Activity") {
            await createActivity(selectedTrip.id, normalizedItem);
        } else if (itemType === "Transportation") {
            await createTransportation(selectedTrip.id, normalizedItem);
        } else if (itemType === "Lodging") {
            await createLodging(selectedTrip.id, normalizedItem);
        } else {
            throw new Error("Unsupported itinerary item type.");
        }

        setAddingItem(false);
        setError("");

        await loadItems(selectedTrip.id);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleSaveItem = async (updatedItem) => {
        const normalizedItem = {
            ...updatedItem,
            cost:
                updatedItem.cost === "" || updatedItem.cost === null
                    ? null
                    : Number(updatedItem.cost),
        };

        let savedItem;

        if (updatedItem.itemType === "Activity") {
            savedItem = await updateActivity(
                selectedTrip.id,
                updatedItem.id,
                normalizedItem
            );
        } else if (updatedItem.itemType === "Transportation") {
            savedItem = await updateTransportation(
                selectedTrip.id,
                updatedItem.id,
                normalizedItem
            );
        } else if (updatedItem.itemType === "Lodging") {
            savedItem = await updateLodging(
                selectedTrip.id,
                updatedItem.id,
                normalizedItem
            );
        } else {
            throw new Error("Unsupported itinerary item type.");
        }

        setEditingItem(null);
        setError("");

        await loadItems(selectedTrip.id);

        return savedItem;
    };

    const handleDeleteItem = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteTripItem(selectedTrip.id, item.id);

            setItems((currentItems) =>
                currentItems.filter(
                    (currentItem) => currentItem.id !== item.id
                )
            );

            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleBackToTrips = () => {
        setSelectedTrip(null);
        setItems([]);

        setEditingItem(null);
        setAddingItem(false);

        setGroupBy("date");
        setSearchQuery("");
        setActiveSearchQuery("");
        setError("");
    };

    useEffect(() => {
        if (selectedTrip) {
            loadItems(selectedTrip.id);
        }
    }, [selectedTrip]);

    const handleShowPrintableItinerary = () => {
        setShowPrintableItinerary(true);
    };

    const handlePrintItinerary = () => {
        window.print();
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!selectedTrip) {
            return;
        }

        try {
            setSearching(true);

            const data = await searchTripItems(
                selectedTrip.id,
                searchQuery
            );

            setItems(data);
            setActiveSearchQuery(searchQuery.trim());
            setError("");
        } catch (error) {
            setError(error.message);
        } finally {
            setSearching(false);
        }
    };

    const handleClearSearch = async () => {
        setSearchQuery("");
        setActiveSearchQuery("");

        if (selectedTrip) {
            await loadItems(selectedTrip.id);
        }
    };

    return (
        <main>
            <h1>Japan Travel Planner</h1>

            {!loggedIn && (
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>

                    <div>
                        <label>
                            Username
                            <input
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </label>
                    </div>

                    <button type="submit">Login</button>
                </form>
            )}

            {error && <p className="page-error">{error}</p>}

            {loggedIn && !selectedTrip && (
                <>
                    <TripList
                        trips={trips}
                        onSelectTrip={setSelectedTrip}
                        onAddTrip={() => {
                            setEditingTrip(null);
                            setAddingTrip(true);
                        }}
                        onEditTrip={(trip) => {
                            setAddingTrip(false);
                            setEditingTrip(trip);
                        }}
                        onDeleteTrip={handleDeleteTrip}
                    />

                    {addingTrip && (
                        <AddTripForm
                            onCancel={() => setAddingTrip(false)}
                            onSave={handleAddTrip}
                        />
                    )}

                    {editingTrip && (
                        <EditTripForm
                            trip={editingTrip}
                            onCancel={() => setEditingTrip(null)}
                            onSave={handleSaveTrip}
                        />
                    )}
                </>
            )}

            {loggedIn && selectedTrip && (
                <>
                    <button
                        type="button"
                        onClick={handleBackToTrips}
                    >
                        ← Back to My Trips
                    </button>

                    <h2>{selectedTrip.name}</h2>

                    <p>
                        {formatDateLabel(selectedTrip.startDate)} -{" "}
                        {formatDateLabel(selectedTrip.endDate)}
                    </p>

                    {selectedTrip.notes && (
                        <p>{selectedTrip.notes}</p>
                    )}

                    {outsideTripItemCount > 0 && (
                        <div className="trip-date-warning">
                            ⚠ {outsideTripItemCount} itinerary{" "}
                            {outsideTripItemCount === 1 ? "item falls" : "items fall"}{" "}
                            outside the current trip dates.
                        </div>
                    )}

                    <CostSummary
                        items={displayItems}
                        searchQuery={activeSearchQuery}
                    />

                    <div className="trip-actions">
                        {!addingItem && !editingItem && (
                            <button
                                type="button"
                                onClick={() => setAddingItem(true)}
                            >
                                + Add Item
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleShowPrintableItinerary}
                        >
                            Generate Printable Itinerary
                        </button>
                    </div>

                    {addingItem && (
                        <AddItemForm
                            onCancel={() => setAddingItem(false)}
                            onSave={handleAddItem}
                        />
                    )}

                    {editingItem && (
                        <EditItemForm
                            item={editingItem}
                            onCancel={() => setEditingItem(null)}
                            onSave={handleSaveItem}
                        />
                    )}

                    <form onSubmit={handleSearch} className="itinerary-search">
                        <label>
                            Search Itinerary
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Search by name, notes, or location"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={searching}
                        >
                            {searching ? "Searching..." : "Search"}
                        </button>

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <GroupToggle
                        groupBy={groupBy}
                        onChange={setGroupBy}
                    />

                    <QuickJumpNav
                        groupBy={groupBy}
                        groupedByDate={groupedByDate}
                        groupedByLocation={groupedByLocation}
                        onJump={scrollToGroup}
                    />

                    {showPrintableItinerary && (
                        <div className="print-preview">
                            <div className="print-preview-actions">
                                <button
                                    type="button"
                                    onClick={handlePrintItinerary}
                                >
                                    Print / Save as PDF
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowPrintableItinerary(false)}
                                >
                                    Close Preview
                                </button>
                            </div>

                            <PrintableItinerary
                                trip={selectedTrip}
                                groupedByDate={groupedByDate}
                                items={displayItems}
                            />
                        </div>
                    )}

                    {groupBy === "date" &&
                        Object.entries(groupedByDate).map(
                            ([date, dateItems]) => {
                                const outsideTripDates =
                                    dateItems[0]?.outsideTripDates;

                                return (
                                    <section
                                        key={date}
                                        id={`group-${date}`}
                                        className={
                                            outsideTripDates
                                                ? "itinerary-group itinerary-group-warning"
                                                : "itinerary-group"
                                        }
                                    >
                                        <h3>
                                            {date === "Unscheduled"
                                                ? "Unscheduled"
                                                : outsideTripDates
                                                    ? `${formatDateLabel(date)} · Outside trip dates`
                                                    : formatDateHeading(
                                                        date,
                                                        dateItems[0].dayNumber
                                                    )}
                                        </h3>

                                        {dateItems.map((item) => (
                                            <ItineraryItem
                                                key={item.id}
                                                item={item}
                                                onEdit={handleEditItem}
                                                onDelete={handleDeleteItem}
                                            />
                                        ))}
                                    </section>
                                );
                            }
                        )}

                    {groupBy === "location" &&
                        Object.entries(groupedByLocation).map(
                            ([location, locationItems]) => (
                                <section
                                    key={location}
                                    id={`group-${location}`}
                                    className="itinerary-group"
                                >
                                    <h3>{location}</h3>

                                    {locationItems.map((item) => (
                                        <ItineraryItem
                                            key={item.id}
                                            item={item}
                                            onEdit={handleEditItem}
                                            onDelete={handleDeleteItem}
                                        />
                                    ))}
                                </section>
                            )
                        )}
                </>
            )}
        </main>
    );
}

export default App;