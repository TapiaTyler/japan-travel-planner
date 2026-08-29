function GroupToggle({ groupBy, onChange }) {
    return (
        <div className="group-toggle">
            <button
                type="button"
                className={groupBy === "date" ? "active-tab" : ""}
                onClick={() => onChange("date")}
                disabled={groupBy === "date"}
            >
                Date
            </button>

            <button
                type="button"
                className={groupBy === "location" ? "active-tab" : ""}
                onClick={() => onChange("location")}
                disabled={groupBy === "location"}
            >
                Location
            </button>
        </div>
    );
}

export default GroupToggle;