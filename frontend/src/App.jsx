import { useEffect, useState } from "react";
import "./App.css";

import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

import Modal from "./components/common/Modal";
import ConfirmDialog from "./components/common/ConfirmDialog";

import AddTripForm from "./components/trips/AddTripForm";
import EditTripForm from "./components/trips/EditTripForm";
import TripList from "./components/trips/TripList";

import AddItemForm from "./components/itinerary/AddItemForm";
import CostSummary from "./components/itinerary/CostSummary";
import EditItemForm from "./components/itinerary/EditItemForm";
import GroupToggle from "./components/itinerary/GroupToggle";
import ItineraryItem from "./components/itinerary/ItineraryItem";
import QuickJumpNav from "./components/itinerary/QuickJumpNav";

import PrintableItinerary from "./components/reports/PrintableItinerary";
import PrintableItineraryOptions from "./components/reports/PrintableItineraryOptions.jsx";

import {
    createActivity,
    createLodging,
    createTransportation,
    createTrip,
    deleteTrip,
    deleteTripItem,
    duplicateTrip,
    getCurrentUser,
    getTripItems,
    getTrips,
    login,
    logout,
    register,
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

import "@fontsource/noto-sans";

function scrollToGroup(groupKey) {
    const element = document.getElementById(`group-${groupKey}`);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        // Restart the highlight animation if this group was already selected previously.
        element.classList.remove("itinerary-group-selected");

        void element.offsetWidth;

        element.classList.add("itinerary-group-selected");

        setTimeout(() => {
            element.classList.remove("itinerary-group-selected");
        }, 1200);
    }
}

function getDateValue(date) {
    const [year, month, day] = date.split("-").map(Number);

    return Date.UTC(year, month - 1, day);
}

function App() {
    // Authentication
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState("login");
    const [checkingSession, setCheckingSession] = useState(true);

    // Trips
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [addingTrip, setAddingTrip] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);

    // Itinerary
    const [items, setItems] = useState([]);
    const [addingItem, setAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Display controls
    const [groupBy, setGroupBy] = useState("date");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchQuery, setActiveSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [printOptions, setPrintOptions] = useState(null);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    // General errors
    const [error, setError] = useState("");

    async function loadTrips() {
        try {
            const data = await getTrips();

            setTrips(data);
            setError("");

            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function loadItems(tripId) {
        try {
            const data = await getTripItems(tripId);

            setItems(data);
            setError("");

            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function refreshCurrentItems() {
        if (!selectedTrip) {
            return;
        }

        if (activeSearchQuery) {
            const data = await searchTripItems(
                selectedTrip.id,
                activeSearchQuery
            );

            setItems(data);
        } else {
            await loadItems(selectedTrip.id);
        }
    }

    /*
     * Recalculate day numbers against the current trip dates.
     *
     * Existing itinerary dates are never modified when trip dates change.
     * Items outside the new trip range are simply flagged.
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

        const itemDate = getDateValue(item.date);
        const tripStart = getDateValue(selectedTrip.startDate);
        const tripEnd = getDateValue(selectedTrip.endDate);

        const outsideTripDates =
            itemDate < tripStart || itemDate > tripEnd;

        let dayNumber = null;

        if (!outsideTripDates) {
            const millisecondsPerDay = 1000 * 60 * 60 * 24;

            dayNumber =
                Math.round(
                    (itemDate - tripStart) / millisecondsPerDay
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

    const groupedByLocation = displayItems.reduce(
        (groups, item) => {
            const key = getItemLocation(item);

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(item);

            return groups;
        },
        {}
    );

    const outsideTripItemCount = displayItems.filter(
        (item) => item.outsideTripDates
    ).length;

    // Authentication handlers

    async function handleLogin(username, password) {
        const user = await login(username, password);

        setCurrentUser({
            username: user.username,
        });

        setAuthMode("login");
        setError("");

        await loadTrips();
    }

    async function handleRegister(username, password) {
        await register(username, password);

        // Automatically log in after successful registration.
        await handleLogin(username, password);
    }

    async function handleLogout() {
        try {
            await logout();

            setCurrentUser(null);
            setTrips([]);
            setSelectedTrip(null);
            setItems([]);

            setAddingTrip(false);
            setEditingTrip(null);
            setTripToDelete(null);
            setAddingItem(false);
            setEditingItem(null);
            setItemToDelete(null);

            setSearchQuery("");
            setActiveSearchQuery("");
            setGroupBy("date");

            setPrintModalOpen(false);
            setPrintOptions(null);

            setAuthMode("login");
            setError("");
        } catch (error) {
            setError(error.message);
        }
    }

    // Trip handlers

    function handleSelectTrip(trip) {
        setSelectedTrip(trip);

        setSearchQuery("");
        setActiveSearchQuery("");

        setAddingItem(false);
        setEditingItem(null);
        setItemToDelete(null);

        setGroupBy("date");

        setPrintModalOpen(false);
        setPrintOptions(null);

        setError("");
    }

    async function handleAddTrip(formData) {
        await createTrip(formData);

        setAddingTrip(false);
        setError("");

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

        if (selectedTrip?.id === updatedTrip.id) {
            setSelectedTrip(updatedTrip);
        }

        setEditingTrip(null);
        setError("");
    }

    async function handleDuplicateTrip(trip) {
        try {
            await duplicateTrip(trip.id);

            setError("");
            await loadTrips();
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleConfirmDeleteTrip() {
        if (!tripToDelete) {
            return;
        }

        try {
            await deleteTrip(tripToDelete.id);

            setTripToDelete(null);
            setError("");

            await loadTrips();
        } catch (error) {
            setError(error.message);
        }
    }

    function handleBackToTrips() {
        setSelectedTrip(null);
        setItems([]);

        setAddingItem(false);
        setEditingItem(null);
        setItemToDelete(null);

        setSearchQuery("");
        setActiveSearchQuery("");

        setPrintModalOpen(false);
        setPrintOptions(null);

        setGroupBy("date");

        setError("");
    }

    // Itinerary handlers

    async function handleAddItem(itemType, formData) {
        const normalizedItem = {
            ...formData,
            cost:
                formData.cost === "" || formData.cost === null
                    ? null
                    : Number(formData.cost),
        };

        if (itemType === "Activity") {
            await createActivity(
                selectedTrip.id,
                normalizedItem
            );
        } else if (itemType === "Transportation") {
            await createTransportation(
                selectedTrip.id,
                normalizedItem
            );
        } else if (itemType === "Lodging") {
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
        setError("");

        await refreshCurrentItems();
    }

    function handleEditItem(item) {
        setAddingItem(false);
        setEditingItem(item);
    }

    async function handleSaveItem(updatedItem) {
        const normalizedItem = {
            ...updatedItem,
            cost:
                updatedItem.cost === "" ||
                updatedItem.cost === null
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
        } else if (
            updatedItem.itemType === "Transportation"
        ) {
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
            throw new Error(
                "Unsupported itinerary item type."
            );
        }

        setEditingItem(null);
        setError("");

        await refreshCurrentItems();

        return savedItem;
    }

    async function handleConfirmDeleteItem() {
        if (!itemToDelete || !selectedTrip) {
            return;
        }

        try {
            await deleteTripItem(
                selectedTrip.id,
                itemToDelete.id
            );

            setItems((currentItems) =>
                currentItems.filter(
                    (item) => item.id !== itemToDelete.id
                )
            );

            setItemToDelete(null);
            setError("");
        } catch (error) {
            setError(error.message);
        }
    }

    // Search handlers

    async function handleSearch(event) {
        event.preventDefault();

        if (!selectedTrip) {
            return;
        }

        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) {
            await handleClearSearch();
            return;
        }

        try {
            setSearching(true);

            const data = await searchTripItems(
                selectedTrip.id,
                trimmedQuery
            );

            setItems(data);
            setActiveSearchQuery(trimmedQuery);
            setError("");
        } catch (error) {
            setError(error.message);
        } finally {
            setSearching(false);
        }
    }

    async function handleClearSearch() {
        setSearchQuery("");
        setActiveSearchQuery("");

        if (selectedTrip) {
            await loadItems(selectedTrip.id);
        }
    }

    // Restore an existing Spring session after refresh.

    useEffect(() => {
        async function restoreSession() {
            try {
                const user = await getCurrentUser();

                if (user) {
                    setCurrentUser(user);
                    await loadTrips();
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setCheckingSession(false);
            }
        }

        restoreSession();
    }, []);

    // Load itinerary whenever a trip is selected.

    useEffect(() => {
        if (selectedTrip) {
            loadItems(selectedTrip.id);
        }
    }, [selectedTrip]);

    if (checkingSession) {
        return (
            <main>
                <h1>Japan Travel Planner</h1>
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main>
            <header className="app-header">
                <h1>Japan Travel Planner</h1>

                {currentUser && (
                    <div className="user-controls">
                        <span>
                          Signed in as {currentUser.username}
                        </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            <div className="main-wrapper">

                {error && (
                    <p className="page-error">
                        {error}
                    </p>
                )}

                {!currentUser && (
                    <>
                        {authMode === "login" ? (
                            <LoginForm
                                onLogin={handleLogin}
                                onShowRegister={() =>
                                    setAuthMode("register")
                                }
                            />
                        ) : (
                            <RegisterForm
                                onRegister={handleRegister}
                                onCancel={() =>
                                    setAuthMode("login")
                                }
                            />
                        )}
                    </>
                )}

                {currentUser && !selectedTrip && (
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
                            onDuplicateTrip={
                                handleDuplicateTrip
                            }
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
                )}

                {currentUser && selectedTrip && (
                    <>
                        <button
                            className="back-to-trips"
                            type="button"
                            onClick={handleBackToTrips}
                        >
                            ← Back to Trips
                        </button>

                        <section className="trip-header">
                            <div className="trip-header-content">
                                <div>
                                    <h2>{selectedTrip.name}</h2>

                                    <p>
                                        {formatDateLabel(selectedTrip.startDate)} -{" "}
                                        {formatDateLabel(selectedTrip.endDate)}
                                    </p>

                                    {selectedTrip.notes && (
                                        <p className="item-notes">{selectedTrip.notes}</p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setEditingTrip(selectedTrip)}
                                >
                                    ✎ Edit Trip Details
                                </button>
                            </div>
                        </section>

                        {editingTrip && selectedTrip && (
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

                        {outsideTripItemCount > 0 && (
                            <div className="trip-date-warning">
                                ⚠ {outsideTripItemCount} itinerary{" "}
                                {outsideTripItemCount === 1
                                    ? "item falls"
                                    : "items fall"}{" "}
                                outside the current trip dates.
                            </div>
                        )}

                        {printModalOpen && (
                            <Modal
                                title={
                                    printOptions
                                        ? "Printable Itinerary Preview"
                                        : "Printable Itinerary Options"
                                }
                                onClose={() => {
                                    setPrintModalOpen(false);
                                    setPrintOptions(null);
                                }}
                                className="print-modal"
                            >
                                {!printOptions ? (
                                    <PrintableItineraryOptions
                                        onCancel={() => {
                                            setPrintModalOpen(false);
                                            setPrintOptions(null);
                                        }}
                                        onGenerate={(options) => {
                                            setPrintOptions(options);
                                        }}
                                    />
                                ) : (
                                    <>
                                        <div className="print-preview-actions">
                                            <button
                                                type="button"
                                                onClick={() => setPrintOptions(null)}
                                            >
                                                Back to Options
                                            </button>

                                            <button
                                                type="button"
                                                className="add-button"
                                                onClick={() => window.print()}
                                            >
                                                Print / Save as PDF
                                            </button>
                                        </div>

                                        <PrintableItinerary
                                            trip={selectedTrip}
                                            items={displayItems}
                                            options={printOptions}
                                        />
                                    </>
                                )}
                            </Modal>
                        )}

                        {addingItem && (
                            <Modal
                                title="Add Itinerary Item"
                                onClose={() => setAddingItem(false)}
                            >
                                <AddItemForm
                                    onCancel={() => setAddingItem(false)}
                                    onSave={handleAddItem}
                                />
                            </Modal>
                        )}

                        {editingItem && (
                            <Modal
                                title={`Edit ${editingItem.name}`}
                                onClose={() => setEditingItem(null)}
                            >
                                <EditItemForm
                                    item={editingItem}
                                    onCancel={() => setEditingItem(null)}
                                    onSave={handleSaveItem}
                                />
                            </Modal>
                        )}

                        {itemToDelete && (
                            <Modal
                                title="Delete Itinerary Item"
                                onClose={() => setItemToDelete(null)}
                            >
                                <ConfirmDialog
                                    message={`Permanently delete "${itemToDelete.name}"?`}
                                    warning="This itinerary item will be permanently deleted. This action cannot be undone."
                                    confirmLabel="Delete Item"
                                    onCancel={() => setItemToDelete(null)}
                                    onConfirm={handleConfirmDeleteItem}
                                />
                            </Modal>
                        )}

                        <div className="trip-actions">

                            <form
                                onSubmit={handleSearch}
                                className="itinerary-search"
                            >
                                <label>
                                    Search Itinerary
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search by name, notes, or location"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    disabled={searching}
                                >
                                    {searching
                                        ? "Searching..."
                                        : "Search"}
                                </button>

                                {activeSearchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>

                            <div className="trip-actions-buttons">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPrintOptions(null);
                                        setPrintModalOpen(true);
                                    }}
                                >
                                    <span className="button-icon">🗐</span> Generate Printable Itinerary
                                </button>
                                {!addingItem && !editingItem && (
                                    <button
                                        className="add-button"
                                        type="button"
                                        onClick={() => {
                                            setEditingItem(null);
                                            setAddingItem(true);
                                        }}
                                    >
                                        <span className="button-icon">+</span> Add Item
                                    </button>
                                )}
                            </div>

                        </div>

                        <div className="group-toggle-container">

                            <GroupToggle
                                groupBy={groupBy}
                                onChange={setGroupBy}
                            />

                            <QuickJumpNav
                                groupBy={groupBy}
                                groupedByDate={groupedByDate}
                                groupedByLocation={
                                    groupedByLocation
                                }
                                onJump={scrollToGroup}
                            />

                        </div>

                        <div className="itinerary-layout">
                            <div className="itinerary-main">

                                {displayItems.length === 0 && (
                                    <p>
                                        {activeSearchQuery
                                            ? `No itinerary items matched "${activeSearchQuery}".`
                                            : "No itinerary items have been added yet."}
                                    </p>
                                )}

                                {groupBy === "date" &&
                                    Object.entries(
                                        groupedByDate
                                    ).map(([date, dateItems]) => {
                                        const outsideTripDates =
                                            dateItems[0]
                                                ?.outsideTripDates;

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
                                                                dateItems[0]
                                                                    .dayNumber
                                                            )}
                                                </h3>

                                                    {dateItems.map((item) => (
                                                        <ItineraryItem
                                                            key={item.id}
                                                            item={item}
                                                            onEdit={
                                                                handleEditItem
                                                            }
                                                            onDelete={
                                                                setItemToDelete
                                                            }
                                                        />
                                                    ))}
                                            </section>
                                        );
                                    })}

                                {groupBy === "location" &&
                                    Object.entries(
                                        groupedByLocation
                                    ).map(
                                        ([location, locationItems]) => (
                                            <section
                                                key={location}
                                                id={`group-${location}`}
                                                className="itinerary-group"
                                            >
                                                <h3>{location}</h3>

                                                {locationItems.map(
                                                    (item) => (
                                                        <ItineraryItem
                                                            key={item.id}
                                                            item={item}
                                                            onEdit={
                                                                handleEditItem
                                                            }
                                                            onDelete={
                                                                setItemToDelete
                                                            }
                                                        />
                                                    )
                                                )}
                                            </section>
                                        )
                                    )}

                            </div>

                            <CostSummary
                                items={displayItems}
                                searchQuery={activeSearchQuery}
                            />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default App;