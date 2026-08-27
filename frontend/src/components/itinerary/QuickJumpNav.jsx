function QuickJumpNav({
                          groupBy,
                          groupedByDate,
                          groupedByLocation,
                          onJump,
                      }) {
    return (
        <div className="quick-jump-nav">
            {groupBy === "date" &&
                Object.keys(groupedByDate).map((date) => (
                    <button
                        key={date}
                        type="button"
                        onClick={() => onJump(date)}
                    >
                        {date === "Unscheduled"
                            ? "Unscheduled"
                            : new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                    </button>
                ))}

            {groupBy === "location" &&
                Object.keys(groupedByLocation).map((location) => (
                    <button
                        key={location}
                        type="button"
                        onClick={() => onJump(location)}
                    >
                        {location}
                    </button>
                ))}
        </div>
    );
}

export default QuickJumpNav;