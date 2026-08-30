import logo from "../../assets/jtp-logo1.png";

function AppHeader({
                       currentUser,
                       handleLogout,
                   }) {
    // Render
    return (
        <header className="app-header">
            <div className="app-brand">
                <img src={logo} alt="" className="app-logo" />
                <h1>Japan Travel Planner</h1>
            </div>

            {currentUser && (
                <div className="user-controls">
                    <span>
                        Signed in as {currentUser.username}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default AppHeader;