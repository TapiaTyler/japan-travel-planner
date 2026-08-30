// Imports
import "./App.css";
import "@fontsource/noto-sans";

import AppHeader from "./components/common/AppHeader.jsx";
import Modal from "./components/common/Modal.jsx";

import AuthPage from "./pages/AuthPage.jsx";
import TripsPage from "./pages/TripsPage.jsx";
import TripDetailsPage from "./pages/TripDetailsPage.jsx";

import useAuth from "./hooks/useAuth.js";
import useTrips from "./hooks/useTrips.js";
import useItinerary from "./hooks/useItinerary.js";

function App() {
    // Hooks
    const auth = useAuth();

    const tripState = useTrips(
        auth.currentUser
    );

    const itinerary = useItinerary(
        tripState.selectedTrip
    );

    // Loading
    if (auth.checkingSession) {
        return (
            <main>
                <h1>Japan Travel Planner</h1>
                <p>Loading...</p>
            </main>
        );
    }

    // Render
    return (
        <main>
            <AppHeader
                currentUser={auth.currentUser}
                handleLogout={auth.handleLogout}
            />

            {auth.sessionExpired && (
                <Modal
                    title="Session Expired"
                    onClose={auth.handleSessionExpired}
                >
                    <div className="session-expired-message">
                        <p>
                            Your session has expired.
                            Please sign in again to continue.
                        </p>

                        <button
                            type="button"
                            onClick={auth.handleSessionExpired}
                        >
                            Go to Login
                        </button>
                    </div>
                </Modal>
            )}

            <div className="main-wrapper">

                {!auth.currentUser && (
                    <AuthPage
                        authMode={auth.authMode}
                        setAuthMode={auth.setAuthMode}
                        handleLogin={auth.handleLogin}
                        handleRegister={
                            auth.handleRegister
                        }
                    />
                )}

                {auth.currentUser &&
                    !tripState.selectedTrip && (
                        <TripsPage
                            trips={tripState.trips}
                            addingTrip={
                                tripState.addingTrip
                            }
                            editingTrip={
                                tripState.editingTrip
                            }
                            tripToDelete={
                                tripState.tripToDelete
                            }
                            setAddingTrip={
                                tripState.setAddingTrip
                            }
                            setEditingTrip={
                                tripState.setEditingTrip
                            }
                            setTripToDelete={
                                tripState.setTripToDelete
                            }
                            handleSelectTrip={
                                tripState.handleSelectTrip
                            }
                            handleAddTrip={
                                tripState.handleAddTrip
                            }
                            handleSaveTrip={
                                tripState.handleSaveTrip
                            }
                            handleDuplicateTrip={
                                tripState.handleDuplicateTrip
                            }
                            handleConfirmDeleteTrip={
                                tripState.handleConfirmDeleteTrip
                            }
                        />
                    )}

                {auth.currentUser &&
                    tripState.selectedTrip && (
                        <TripDetailsPage
                            tripState={tripState}
                            itinerary={itinerary}
                        />
                    )}
            </div>
        </main>
    );
}

export default App;