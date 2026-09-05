import i18n from "../i18n/index.js";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8080";

// Errors
export class SessionExpiredError extends Error {
    constructor() {
        super(i18n.t("status.sessionExpiredMessage"));
        this.name = "SessionExpiredError";
    }
}

function translateErrorCode(code) {
    const key = `apiErrors.${code}`;
    return code && i18n.exists(key) ? i18n.t(key) : null;
}

async function getErrorMessage(response, fallbackCode) {
    try {
        const errorData = await response.json();

        const validationMessages = Object.values(errorData.fieldErrors ?? {})
            .map(translateErrorCode)
            .filter(Boolean);

        if (validationMessages.length > 0) {
            return validationMessages.join(" ");
        }

        const codedMessage = translateErrorCode(errorData.code);
        if (codedMessage) return codedMessage;

        if (errorData.message) {
            return errorData.message;
        }

        const legacyValidationMessages = Object.entries(errorData)
            .filter(([key, value]) =>
                !["code", "message", "fieldErrors"].includes(key)
                && typeof value === "string"
            )
            .map(([, value]) => value);

        if (legacyValidationMessages.length > 0) {
            return legacyValidationMessages.join(" ");
        }

        return i18n.t(`apiErrors.${fallbackCode}`);
    } catch {
        return i18n.t(`apiErrors.${fallbackCode}`);
    }
}

// Functions
function checkForExpiredSession(response) {
    if (response.status === 401) {
        window.dispatchEvent(
            new Event("session-expired")
        );

        throw new SessionExpiredError();
    }
}

async function getCsrfToken() {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/csrf`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            i18n.t("apiErrors.CSRF_INIT")
        );
    }

    return response.json();
}

async function csrfFetch(url, options = {}) {
    const csrf = await getCsrfToken();

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            [csrf.headerName]: csrf.token,
        },
        credentials: "include",
    });
}

export async function register(username, password) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "REGISTER"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function login(username, password) {
    const response = await csrfFetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error(await getErrorMessage(
                response,
                "LOGIN"
            ));
        }

        throw new Error(await getErrorMessage(response, "LOGIN"));
    }

    return response.json();
}

export async function getCurrentUser() {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
            credentials: "include",
        }
    );

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "SESSION_VERIFY"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function logout() {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/auth/logout`,
        {
            method: "POST",
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "LOGOUT"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function createTrip(trip) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(trip),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRIP_CREATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateTrip(tripId, trip) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(trip),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRIP_UPDATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function duplicateTrip(tripId) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/duplicate`,
        {
            method: "POST",
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRIP_DUPLICATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function deleteTrip(tripId) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}`,
        {
            method: "DELETE",
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRIP_DELETE"
        );

        throw new Error(message);
    }
}

export async function getTrips() {
    const response = await fetch(
        `${API_BASE_URL}/api/trips`,
        {
            credentials: "include",
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRIPS_LOAD"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function getTripItems(tripId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items`,
        {
            credentials: "include",
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "ITEMS_LOAD"));
    }

    return response.json();
}

export async function createActivity(tripId, activity) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/activities`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(activity),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "ACTIVITY_CREATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function createTransportation(tripId, transportation) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/transportation`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transportation),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRANSPORTATION_CREATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function createLodging(tripId, lodging) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/lodging`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lodging),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "LODGING_CREATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateActivity(tripId, itemId, activity) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}/activities`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(activity),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "ACTIVITY_UPDATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateTransportation(
    tripId,
    itemId,
    transportation
) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}/transportation`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transportation),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "TRANSPORTATION_UPDATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateLodging(tripId, itemId, lodging) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}/lodging`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lodging),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "LODGING_UPDATE"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function deleteTripItem(tripId, itemId) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}`,
        {
            method: "DELETE",
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "ITEM_DELETE"));
    }
}

export async function searchTripItems(tripId, query) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/search?query=${encodeURIComponent(query)}`,
        {
            credentials: "include",
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "ITEM_SEARCH"
        );

        throw new Error(message);
    }

    return response.json();
}

export async function changePassword(currentPassword, newPassword) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/account/password`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
        }
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "PASSWORD_UPDATE"));
    }

    return response.json();
}

export async function getPublicTemplates() {
    const response = await fetch(`${API_BASE_URL}/api/templates/public`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "TEMPLATES_LOAD"));
    }

    return response.json();
}

export async function getMyTemplates() {
    const response = await fetch(`${API_BASE_URL}/api/templates/mine`, {
        credentials: "include",
    });

    checkForExpiredSession(response);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "TEMPLATES_LOAD"));
    }

    return response.json();
}

export async function createTemplateFromTrip(tripId, template) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/templates/from-trip/${tripId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(template),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "TEMPLATE_CREATE"));
    }

    return response.json();
}

export async function instantiateTemplate(templateId, trip) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/templates/${templateId}/instantiate`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip),
        }
    );

    checkForExpiredSession(response);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "TEMPLATE_USE"));
    }

    return response.json();
}

export async function deleteTemplate(templateId) {
    const response = await csrfFetch(`${API_BASE_URL}/api/templates/${templateId}`, {
        method: "DELETE",
    });

    checkForExpiredSession(response);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "TEMPLATE_DELETE"));
    }
}

export async function deleteAccount(currentPassword) {
    const response = await csrfFetch(
        `${API_BASE_URL}/api/account`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword }),
        }
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "ACCOUNT_DELETE"));
    }

    return response.json();
}
