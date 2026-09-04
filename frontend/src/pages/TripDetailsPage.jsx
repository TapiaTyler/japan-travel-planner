// Imports
import { useEffect, useState } from "react";
import {
    formatDateHeading,
    formatDateLabel,
} from "../utils/itineraryUtils.js";
import {
    ChevronDown,
    FileText,
    Pencil,
    Printer,
    SlidersHorizontal,
} from "lucide-react";

import Modal from "../components/common/Modal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import LoadingState from "../components/common/LoadingState.jsx";

import EditTripForm from "../components/trips/EditTripForm.jsx";

import AddItemForm from "../components/itinerary/AddItemForm.jsx";
import EditItemForm from "../components/itinerary/EditItemForm.jsx";
import GroupToggle from "../components/itinerary/GroupToggle.jsx";
import QuickJumpNav from "../components/itinerary/QuickJumpNav.jsx";
import ItineraryItem from "../components/itinerary/ItineraryItem.jsx";
import CostSummary from "../components/itinerary/CostSummary.jsx";
import ItineraryFilters from "../components/itinerary/ItineraryFilters.jsx";

import PrintableItinerary from "../components/reports/PrintableItinerary.jsx";
import PrintableItineraryOptions
    from "../components/reports/PrintableItineraryOptions.jsx";

function TripDetailsPage({
                             tripState,
                             itinerary,
                         }) {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState(null);

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
        loadingItems,
        hasLoadedItems,
        groupedByDate,
        groupedByLocation,
        outsideTripItemCount,

        addingItem,
        editingItem,
        itemToDelete,

        groupBy,

        activeSearchQuery,
        filters,
        availableLocations,
        activeFilterCount,
        itineraryError,

        printModalOpen,
        printOptions,

        setAddingItem,
        setEditingItem,
        setItemToDelete,

        setGroupBy,
        setPrintModalOpen,
        setPrintOptions,

        handleAddItem,
        handleEditItem,
        handleSaveItem,
        handleConfirmDeleteItem,

        handleSearch,
        handleClearSearch,
        handleFiltersChange,
        handleResetFilters,
    } = itinerary;

    useEffect(() => {
        function updateActiveGroup() {
            const groups = [...document.querySelectorAll(".itinerary-group")];

            if (groups.length === 0) {
                setActiveGroup(null);
                return;
            }

            const stickyNav = document.querySelector(".group-toggle-container");
            const activationLine = (stickyNav?.offsetHeight ?? 0) + 16;
            let currentGroup = groups[0];

            groups.forEach((group) => {
                if (group.getBoundingClientRect().top <= activationLine) {
                    currentGroup = group;
                }
            });

            setActiveGroup(currentGroup.id.replace("group-", ""));
        }

        updateActiveGroup();
        window.addEventListener("scroll", updateActiveGroup, { passive: true });
        window.addEventListener("resize", updateActiveGroup);

        return () => {
            window.removeEventListener("scroll", updateActiveGroup);
            window.removeEventListener("resize", updateActiveGroup);
        };
    }, [displayItems, groupBy]);

    if (!hasLoadedItems) {
        return (
            <LoadingState
                title="Loading Itinerary"
                message="Retrieving your itinerary items..."
            />
        );
    }

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
            {loadingItems && (
                <p className="refresh-status" role="status">
                    Refreshing itinerary...
                </p>
            )}

            {itineraryError && (
                <p className="page-error" role="alert">
                    {itineraryError}
                </p>
            )}

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
                        <Pencil
                            className="button-lucide-icon"
                            aria-hidden="true"
                        />
                        Edit Trip Details
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
                    className={
                        printOptions
                            ? "print-modal"
                            : "print-options-modal"
                    }
                >
                    {!printOptions ? (
                        <PrintableItineraryOptions
                            baseItemCount={displayItems.length}
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
                                    <Printer
                                        className="button-lucide-icon"
                                        aria-hidden="true"
                                    />
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
                            name="query"
                            key={activeSearchQuery}
                            defaultValue={activeSearchQuery}
                            placeholder="Search by name, notes, or location"
                        />
                    </label>

                    <button
                        type="submit"
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        aria-expanded={filtersOpen}
                        aria-controls="itinerary-filters"
                        onClick={() => setFiltersOpen((open) => !open)}
                    >
                        <SlidersHorizontal
                            className="filter-toggle-icon"
                            size={16}
                            aria-hidden="true"
                        />
                        Filters
                        {activeFilterCount > 0 && ` (${activeFilterCount})`}
                        <ChevronDown
                            className={
                                filtersOpen
                                    ? "filter-chevron filter-chevron-open"
                                    : "filter-chevron"
                            }
                            size={16}
                            aria-hidden="true"
                        />
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
                        <FileText
                            className="button-lucide-icon"
                            aria-hidden="true"
                        />
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

            {filtersOpen && (
                <ItineraryFilters
                    filters={filters}
                    locations={availableLocations}
                    onChange={handleFiltersChange}
                    onReset={handleResetFilters}
                />
            )}

            <div className="group-toggle-container">
                <GroupToggle
                    groupBy={groupBy}
                    onChange={setGroupBy}
                />

                <QuickJumpNav
                    groupBy={groupBy}
                    activeGroup={activeGroup}
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
                    {displayItems.length === 0 && !itineraryError && (
                        <div className="itinerary-empty-state">
                            {activeSearchQuery || activeFilterCount > 0 ? (
                                <>
                                    <h3>No matching itinerary items</h3>

                                    <p>
                                        No itinerary items matched the current
                                        search and filters.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3>No itinerary items yet</h3>

                                    <p>
                                        Start building your trip by adding
                                        your first itinerary item.
                                    </p>

                                    <button
                                        type="button"
                                        className="empty-state-add-button"
                                        aria-label="Add itinerary item"
                                        title="Add itinerary item"
                                        onClick={() => {
                                            setEditingItem(null);
                                            setAddingItem(true);
                                        }}
                                    >
                                        +
                                    </button>
                                </>
                            )}
                        </div>
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
                    hasActiveFilters={activeFilterCount > 0}
                />
            </div>
        </>
    );
}

export default TripDetailsPage;
