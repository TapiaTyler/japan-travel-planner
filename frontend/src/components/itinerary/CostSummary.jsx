function CostSummary({ items, searchQuery }) {
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

            <div>
                <span>Lodging</span>
                <strong>{formatYen(summary.lodging)}</strong>
            </div>

            <div>
                <span>Transportation</span>
                <strong>{formatYen(summary.transportation)}</strong>
            </div>

            <div>
                <span>Activities</span>
                <strong>{formatYen(summary.activities)}</strong>
            </div>

            <hr />

            <div>
                <span>Total</span>
                <strong>{formatYen(summary.total)}</strong>
            </div>

            <h4>Cost Status</h4>

            <div>
                <span>Confirmed</span>
                <strong>
                    {summary.confirmed}{" "}
                    {summary.confirmed === 1 ? "item" : "items"}
                </strong>
            </div>

            <div>
                <span>Estimated</span>
                <strong>
                    {summary.estimated}{" "}
                    {summary.estimated === 1 ? "item" : "items"}
                </strong>
            </div>

            <div>
                <span>Unknown</span>
                <strong>
                    {summary.unknown}{" "}
                    {summary.unknown === 1 ? "item" : "items"}
                </strong>
            </div>
        </aside>
    );
}

export default CostSummary;