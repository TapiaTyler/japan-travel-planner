import { useState } from "react";
import { Link, useLocation } from "react-router";

import { changePassword, deleteAccount } from "../api/api.js";

function AccountSettingsPage({ currentUser, onAccountDeleted }) {
    const location = useLocation();
    const previousPath = location.state?.from;
    const returnToItinerary =
        typeof previousPath === "string" && previousPath.startsWith("/trips/");
    const returnPath = returnToItinerary ? previousPath : "/trips";
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [deletePassword, setDeletePassword] = useState("");
    const [deletionConfirmed, setDeletionConfirmed] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function handlePasswordChange(event) {
        const { name, value } = event.target;
        setPasswords((current) => ({ ...current, [name]: value }));
    }

    async function handlePasswordSubmit(event) {
        event.preventDefault();
        if (isChangingPassword) return;

        setPasswordError("");
        setPasswordMessage("");

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await changePassword(
                passwords.currentPassword,
                passwords.newPassword
            );
            setPasswordMessage(response.message);
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setPasswordError(error.message);
        } finally {
            setIsChangingPassword(false);
        }
    }

    async function handleDeleteSubmit(event) {
        event.preventDefault();
        if (isDeleting) return;

        setDeleteError("");
        setIsDeleting(true);

        try {
            await deleteAccount(deletePassword);
            onAccountDeleted();
        } catch (error) {
            setDeleteError(error.message);
            setIsDeleting(false);
        }
    }

    return (
        <section className="account-settings">
            <Link className="settings-back-link" to={returnPath}>
                ← {returnToItinerary ? "Back to Itinerary" : "Back to Trips"}
            </Link>

            <header className="account-settings-header">
                <h2>Account Settings</h2>
                <p>Manage the account for <strong>{currentUser.username}</strong>.</p>
            </header>

            <section className="settings-card">
                <h3>Change Password</h3>
                <p>Use your current password to choose a new one.</p>

                <form onSubmit={handlePasswordSubmit} aria-busy={isChangingPassword}>
                    {passwordError && <p className="form-error" role="alert">{passwordError}</p>}
                    {passwordMessage && <p className="form-success" role="status">{passwordMessage}</p>}

                    <label>
                        Current Password
                        <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} autoComplete="current-password" required />
                    </label>
                    <label>
                        New Password
                        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} autoComplete="new-password" minLength={5} maxLength={100} required />
                    </label>
                    <label>
                        Confirm New Password
                        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} autoComplete="new-password" required />
                    </label>

                    <button className="add-button" type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? "Updating Password..." : "Update Password"}
                    </button>
                </form>
            </section>

            <section className="settings-card danger-zone">
                <h3>Delete Account</h3>
                <p>Permanently deletes your account, trips, and itinerary items. This cannot be undone.</p>

                <form onSubmit={handleDeleteSubmit} aria-busy={isDeleting}>
                    {deleteError && <p className="form-error" role="alert">{deleteError}</p>}

                    <label>
                        Current Password
                        <input type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} autoComplete="current-password" required />
                    </label>

                    <label className="destructive-confirmation">
                        <input
                            type="checkbox"
                            checked={deletionConfirmed}
                            onChange={(event) => setDeletionConfirmed(event.target.checked)}
                            required
                        />
                        I understand that this permanently deletes my account and trip data.
                    </label>

                    <button className="danger-button" type="submit" disabled={isDeleting || !deletionConfirmed}>
                        {isDeleting ? "Deleting Account..." : "Delete Account Permanently"}
                    </button>
                </form>
            </section>
        </section>
    );
}

export default AccountSettingsPage;
