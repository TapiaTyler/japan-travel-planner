import {
    BedDouble,
    MapPin,
    Route,
} from "lucide-react";

function CostSummary({ items, searchQuery, hasActiveFilters }) {
    const summary = items.reduce(
        (result, item) => {
            if (item.cost !== null) {
                const cost = Number(item.cost);

                if (item.itemType === "Activity") {
                    result.activities += cost;
                } else if (item.itemType === "Transportation") {
                    result.transportation += cost;
                } else if (item.itemType === "Lodging") {
                    result.lodging += cost;
                }

                result.total += cost;
            }

            if (item.costStatus === "CONFIRMED") {
                result.confirmed += 1;
            } else if (item.costStatus === "ESTIMATED") {
                result.estimated += 1;
            } else {
                result.unknown += 1;
            }

            return result;
        },
        {
            activities: 0,
            transportation: 0,
            lodging: 0,
            total: 0,
            confirmed: 0,
            estimated: 0,
            unknown: 0,
        }
    );

    function formatYen(amount) {
        return `¥${amount.toLocaleString()}`;
    }

    return (
        <aside className="cost-summary">
            <h3>
                Cost Summary
                {searchQuery.trim() && (
                    <>
                        {" ("}
                        <em>{searchQuery.trim()}</em>
                        {")"}
                    </>
                )}
            </h3>

            {hasActiveFilters && (
                <p className="cost-summary-context">
                    Totals reflect the current filters.
                </p>
            )}

            <div>
                <span className="cost-summary-label item-type-activity">
                    <MapPin
                        size={18}
                        aria-hidden="true"
                    />
                    Activities
                </span>

                <strong>
                    {formatYen(summary.activities)}
                </strong>
            </div>

            <div>
                <span className="cost-summary-label item-type-transportation">
                    <Route
                        size={18}
                        aria-hidden="true"
                    />
                    Transportation
                </span>

                <strong>
                    {formatYen(summary.transportation)}
                </strong>
            </div>

            <div>
                <span className="cost-summary-label item-type-lodging">
                    <BedDouble
                        size={18}
                        aria-hidden="true"
                    />
                    Lodging
                </span>

                <strong>
                    {formatYen(summary.lodging)}
                </strong>
            </div>

            <hr />

            <div>
                <strong>Total</strong>
                <strong>{formatYen(summary.total)}</strong>
            </div>

            <hr />

            <h4>Cost Status</h4>

            <div>
                <span className="cost-summary-status cost-status-confirmed">
                    <span
                        className="cost-status-dot"
                        aria-hidden="true"
                    />
                    Confirmed
                </span>

                <span>
                    {summary.confirmed}{" "}
                    {summary.confirmed === 1 ? "item" : "items"}
                </span>
            </div>

            <div>
                <span className="cost-summary-status cost-status-estimated">
                    <span
                        className="cost-status-dot"
                        aria-hidden="true"
                    />
                    Estimated
                </span>
                <span>
                    {summary.estimated}{" "}
                    {summary.estimated === 1 ? "item" : "items"}
                </span>
            </div>

            <div>
                <span className="cost-summary-status cost-status-unknown">
                    <span
                        className="cost-status-dot"
                        aria-hidden="true"
                    />
                    Unknown
                </span>
                <span>
                    {summary.unknown}{" "}
                    {summary.unknown === 1 ? "item" : "items"}
                </span>
            </div>
        </aside>
    );
}

export default CostSummary;
