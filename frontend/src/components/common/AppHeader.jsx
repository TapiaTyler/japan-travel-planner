function AppHeader({
                       currentUser,
                       handleLogout,
                   }) {
    // Render
    return (
        <header className="app-header">
            <h1>Japan Travel Planner</h1>

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