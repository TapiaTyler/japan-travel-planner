import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formatters.js";

function QuickJumpNav({
                          groupBy,
                          groupedByDate,
                          groupedByLocation,
                          activeGroup,
                          onJump,
                      }) {
    const { t, i18n } = useTranslation();
    return (
        <div className="quick-jump-nav">
            {groupBy === "date" &&
                Object.keys(groupedByDate).map((date) => (
                    <button
                        key={date}
                        type="button"
                        className={activeGroup === date ? "quick-jump-active" : ""}
                        aria-current={activeGroup === date ? "location" : undefined}
                        onClick={() => onJump(date)}
                    >
                        {date === "Unscheduled"
                            ? t("common.unscheduled")
                            : formatDate(date, i18n.resolvedLanguage, {
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
                        className={activeGroup === location ? "quick-jump-active" : ""}
                        aria-current={activeGroup === location ? "location" : undefined}
                        onClick={() => onJump(location)}
                    >
                        {location === "Other / Unspecified"
                            ? t("common.otherUnspecified")
                            : location}
                    </button>
                ))}
        </div>
    );
}

export default QuickJumpNav;
