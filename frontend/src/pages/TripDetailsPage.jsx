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
import { useTranslation } from "react-i18next";

function TripDetailsPage({
                             tripState,
                             itinerary,
                         }) {
    const { t, i18n } = useTranslation();
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
        savedLibraryItemName,

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
                title={t("itinerary.loading")}
                message={t("itinerary.loadingMessage")}
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
                    {t("itinerary.refreshing")}
                </p>
            )}

            {itineraryError && (
                <p className="page-error" role="alert">
                    {itineraryError}
                </p>
            )}

            {savedLibraryItemName && (
                <div className="page-success" role="status">
                    <span>{t("libraryItems.saved", { name: savedLibraryItemName })}</span>
                    <button
                        type="button"
                        className="notice-dismiss"
                        aria-label={t("common.close")}
                        onClick={() => setSavedLibraryItemName("")}
                    >
                        ×
                    </button>
                </div>
            )}

            <button
                className="back-to-trips"
                type="button"
                onClick={handleBackToTrips}
            >
                ← {t("trips.back")}
            </button>

            <section className="trip-header">
                <div className="trip-header-content">
                    <div>
                        <h2>
                            {selectedTrip.name}
                        </h2>

                        <p>
                            {formatDateLabel(
                                selectedTrip.startDate, i18n.resolvedLanguage
                            )}
                            {" - "}
                            {formatDateLabel(
                                selectedTrip.endDate, i18n.resolvedLanguage
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
                        {t("itinerary.editTripDetails")}
                    </button>
                </div>
            </section>

            {editingTrip && (
                <Modal
                    title={t("trips.editNamed", { name: editingTrip.name })}
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
                    ⚠ {t("itinerary.outsideCount", { count: outsideTripItemCount })}
                </div>
            )}

            {printModalOpen && (
                <Modal
                    title={
                        printOptions
                            ? t("report.preview")
                            : t("report.options")
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
                                    {t("report.backToOptions")}
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
                                    {t("report.print")}
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
                    title={t("itinerary.addItineraryItem")}
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
                    title={t("itinerary.editNamed", { name: editingItem.name })}
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
                    title={t("itinerary.deleteItineraryItem")}
                    onClose={() =>
                        setItemToDelete(null)
                    }
                >
                    <ConfirmDialog
                        message={
                            t("itinerary.deleteNamed", { name: itemToDelete.name })
                        }
                        warning={
                            t("itinerary.deleteWarning")
                        }
                        confirmLabel={t("itinerary.deleteItem")}
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
                        {t("itinerary.search")}

                        <input
                            type="search"
                            name="query"
                            key={activeSearchQuery}
                            defaultValue={activeSearchQuery}
                            placeholder={t("itinerary.searchPlaceholder")}
                        />
                    </label>

                    <button
                        type="submit"
                    >
                        {t("itinerary.searchButton")}
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
                        {t("itinerary.filters")}
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
                            {t("itinerary.clear")}
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
                        {t("itinerary.generate")}
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
                                {t("itinerary.addItem")}
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
                                    <h3>{t("itinerary.noMatches")}</h3>

                                    <p>
                                        {t("itinerary.noMatchesHint")}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3>{t("itinerary.empty")}</h3>

                                    <p>
                                        {t("itinerary.emptyHint")}
                                    </p>

                                    <button
                                        type="button"
                                        className="empty-state-add-button"
                                        aria-label={t("itinerary.addItineraryItem")}
                                        title={t("itinerary.addItineraryItem")}
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
                                                ? t("common.unscheduled")
                                                : outsideTripDates
                                                    ? `${formatDateLabel(date, i18n.resolvedLanguage)} · ${t("itinerary.outsideTripDates")}`
                                                    : formatDateHeading(
                                                        date,
                                                        t("itinerary.day", { count: dateItems[0].dayNumber }),
                                                        i18n.resolvedLanguage
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
                                                    onSaveToLibrary={handleSaveItemToLibrary}
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
                                        {location === "Other / Unspecified"
                                            ? t("common.otherUnspecified")
                                            : location}
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
                                                onSaveToLibrary={handleSaveItemToLibrary}
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
