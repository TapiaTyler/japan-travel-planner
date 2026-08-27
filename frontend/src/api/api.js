const API_BASE_URL = "http://localhost:8080";

export async function register(username, password) {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to create account."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Login failed.");
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
            "Unable to verify the current session."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function logout() {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/logout`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to log out."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function createTrip(trip) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(trip),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to create trip."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateTrip(tripId, trip) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(trip),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to update trip."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function duplicateTrip(tripId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/duplicate`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to duplicate trip."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function deleteTrip(tripId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "The trip could not be deleted. Please try again."
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

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to load trips."
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

    if (!response.ok) {
        throw new Error("Unable to load itinerary items.");
    }

    return response.json();
}

async function getErrorMessage(response, fallbackMessage) {
    try {
        const errorData = await response.json();

        if (errorData.message) {
            return errorData.message;
        }
    } catch {
        // Ignore JSON parsing errors and use the fallback message.
    }

    return fallbackMessage;
}

export async function createActivity(tripId, activity) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/activities`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(activity),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to create activity."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function createTransportation(tripId, transportation) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/transportation`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(transportation),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to create transportation."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function createLodging(tripId, lodging) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/lodging`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(lodging),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to create lodging."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateActivity(tripId, itemId, activity) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}/activities`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(activity),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to update activity."
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
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}/transportation`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(transportation),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to update transportation."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateLodging(tripId, itemId, lodging) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}/lodging`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(lodging),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to update lodging."
        );

        throw new Error(message);
    }

    return response.json();
}

export async function deleteTripItem(tripId, itemId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/${itemId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Unable to delete itinerary item.");
    }
}

export async function searchTripItems(tripId, query) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/items/search?query=${encodeURIComponent(query)}`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Unable to search itinerary items."
        );

        throw new Error(message);
    }

    return response.json();
}