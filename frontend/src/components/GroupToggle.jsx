function GroupToggle({ groupBy, onChange }) {
    return (
        <div className="group-toggle">
            <button
                type="button"
                onClick={() => onChange("date")}
                disabled={groupBy === "date"}
            >
                Date
            </button>

            <button
                type="button"
                onClick={() => onChange("location")}
                disabled={groupBy === "location"}
            >
                Location
            </button>
        </div>
    );
}

export default GroupToggle;