// Imports
import {
    formatDateHeading,
    formatDateLabel,
} from "../utils/itineraryUtils.js";

import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";

import EditTripForm from "../components/trips/EditTripForm.jsx";

import AddItemForm from "../components/itinerary/AddItemForm.jsx";
import EditItemForm from "../components/itinerary/EditItemForm.jsx";
import GroupToggle from "../components/itinerary/GroupToggle.jsx";
import QuickJumpNav from "../components/itinerary/QuickJumpNav.jsx";
import ItineraryItem from "../components/itinerary/ItineraryItem.jsx";
import CostSummary from "../components/itinerary/CostSummary.jsx";

import PrintableItinerary from "../components/reports/PrintableItinerary.jsx";
import PrintableItineraryOptions
    from "../components/reports/PrintableItineraryOptions.jsx";

function TripDetailsPage({
                             tripState,
                             itinerary,
                         }) {
    // Trip State
    const {
        selectedTrip,
        editingTrip,

        setEditingTrip,

        handleSaveTrip,
        handleBackToTrips,
    } = tripState;

    // Itinerary State
    const {
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
    } = itinerary;

    // Functions
    function scrollToGroup(groupKey) {
        const element =
            document.getElementById(
                `group-${groupKey}`
            );

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            // Restart the highlight animation.
            element.classList.remove(
                "itinerary-group-selected"
            );

            void element.offsetWidth;

            element.classList.add(
                "itinerary-group-selected"
            );

            setTimeout(() => {
                element.classList.remove(
                    "itinerary-group-selected"
                );
            }, 1200);
        }
    }

    // Render
    return (
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
                        <h2>
                            {selectedTrip.name}
                        </h2>

                        <p>
                            {formatDateLabel(
                                selectedTrip.startDate
                            )}
                            {" - "}
                            {formatDateLabel(
                                selectedTrip.endDate
                            )}
                        </p>

                        {selectedTrip.notes && (
                            <p className="item-notes">
                                {selectedTrip.notes}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setEditingTrip(
                                selectedTrip
                            )
                        }
                    >
                        ✎ Edit Trip Details
                    </button>
                </div>
            </section>

            {editingTrip && (
                <Modal
                    title={`Edit ${editingTrip.name}`}
                    onClose={() =>
                        setEditingTrip(null)
                    }
                >
                    <EditTripForm
                        trip={editingTrip}
                        onCancel={() =>
                            setEditingTrip(null)
                        }
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
                            onGenerate={(options) =>
                                setPrintOptions(
                                    options
                                )
                            }
                        />
                    ) : (
                        <>
                            <div className="print-preview-actions">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPrintOptions(
                                            null
                                        )
                                    }
                                >
                                    Back to Options
                                </button>

                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() =>
                                        window.print()
                                    }
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
                    onClose={() =>
                        setAddingItem(false)
                    }
                >
                    <AddItemForm
                        onCancel={() =>
                            setAddingItem(false)
                        }
                        onSave={handleAddItem}
                    />
                </Modal>
            )}

            {editingItem && (
                <Modal
                    title={`Edit ${editingItem.name}`}
                    onClose={() =>
                        setEditingItem(null)
                    }
                >
                    <EditItemForm
                        item={editingItem}
                        onCancel={() =>
                            setEditingItem(null)
                        }
                        onSave={handleSaveItem}
                    />
                </Modal>
            )}

            {itemToDelete && (
                <Modal
                    title="Delete Itinerary Item"
                    onClose={() =>
                        setItemToDelete(null)
                    }
                >
                    <ConfirmDialog
                        message={
                            `Permanently delete "${itemToDelete.name}"?`
                        }
                        warning={
                            "This itinerary item will be permanently deleted. This action cannot be undone."
                        }
                        confirmLabel="Delete Item"
                        onCancel={() =>
                            setItemToDelete(null)
                        }
                        onConfirm={
                            handleConfirmDeleteItem
                        }
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
                            onClick={
                                handleClearSearch
                            }
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
                        <span className="button-icon">
                            🗐
                        </span>{" "}
                        Generate Printable Itinerary
                    </button>

                    {!addingItem &&
                        !editingItem && (
                            <button
                                className="add-button"
                                type="button"
                                onClick={() => {
                                    setEditingItem(
                                        null
                                    );
                                    setAddingItem(
                                        true
                                    );
                                }}
                            >
                                <span className="button-icon">
                                    +
                                </span>{" "}
                                Add Item
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
                    groupedByDate={
                        groupedByDate
                    }
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
                        ).map(
                            ([
                                 date,
                                 dateItems,
                             ]) => {
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
                                        <h3 className="itinerary-group-heading">
                                            {date ===
                                            "Unscheduled"
                                                ? "Unscheduled"
                                                : outsideTripDates
                                                    ? `${formatDateLabel(date)} · Outside trip dates`
                                                    : formatDateHeading(
                                                        date,
                                                        dateItems[0]
                                                            .dayNumber
                                                    )}
                                        </h3>

                                        {dateItems.map(
                                            (item) => (
                                                <ItineraryItem
                                                    key={
                                                        item.id
                                                    }
                                                    item={
                                                        item
                                                    }
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
                                );
                            }
                        )}

                    {groupBy === "location" &&
                        Object.entries(
                            groupedByLocation
                        ).map(
                            ([
                                 location,
                                 locationItems,
                             ]) => (
                                <section
                                    key={location}
                                    id={`group-${location}`}
                                    className="itinerary-group"
                                >
                                    <h3 className="itinerary-group-heading">
                                        {location}
                                    </h3>

                                    {locationItems.map(
                                        (item) => (
                                            <ItineraryItem
                                                key={
                                                    item.id
                                                }
                                                item={
                                                    item
                                                }
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
                    searchQuery={
                        activeSearchQuery
                    }
                />
            </div>
        </>
    );
}

export default TripDetailsPage;