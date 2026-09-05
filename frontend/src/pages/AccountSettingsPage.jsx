import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { changePassword, deleteAccount } from "../api/api.js";

function AccountSettingsPage({ currentUser, onAccountDeleted }) {
    const { t } = useTranslation();
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
            setPasswordError(t("account.newPasswordMismatch"));
            return;
        }

        setIsChangingPassword(true);

        try {
            await changePassword(
                passwords.currentPassword,
                passwords.newPassword
            );
            setPasswordMessage(t("success.passwordUpdated"));
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
                ← {returnToItinerary ? t("account.backToItinerary") : t("account.backToTrips")}
            </Link>

            <header className="account-settings-header">
                <h2>{t("account.title")}</h2>
                <p>{t("account.manage", { username: currentUser.username })}</p>
            </header>

            <section className="settings-card">
                <h3>{t("account.changePassword")}</h3>
                <p>{t("account.changeHint")}</p>

                <form onSubmit={handlePasswordSubmit} aria-busy={isChangingPassword}>
                    {passwordError && <p className="form-error" role="alert">{passwordError}</p>}
                    {passwordMessage && <p className="form-success" role="status">{passwordMessage}</p>}

                    <label>
                        {t("account.currentPassword")}
                        <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} autoComplete="current-password" required />
                    </label>
                    <label>
                        {t("account.newPassword")}
                        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} autoComplete="new-password" minLength={5} maxLength={100} required />
                    </label>
                    <label>
                        {t("account.confirmNewPassword")}
                        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} autoComplete="new-password" required />
                    </label>

                    <button className="add-button" type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? t("account.updating") : t("account.update")}
                    </button>
                </form>
            </section>

            <section className="settings-card danger-zone">
                <h3>{t("account.deleteTitle")}</h3>
                <p>{t("account.deleteWarning")}</p>

                <form onSubmit={handleDeleteSubmit} aria-busy={isDeleting}>
                    {deleteError && <p className="form-error" role="alert">{deleteError}</p>}

                    <label>
                        {t("account.currentPassword")}
                        <input type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} autoComplete="current-password" required />
                    </label>

                    <label className="destructive-confirmation">
                        <input
                            type="checkbox"
                            checked={deletionConfirmed}
                            onChange={(event) => setDeletionConfirmed(event.target.checked)}
                            required
                        />
                        {t("account.deleteConfirmation")}
                    </label>

                    <button className="danger-button" type="submit" disabled={isDeleting || !deletionConfirmed}>
                        {isDeleting ? t("account.deleting") : t("account.deletePermanently")}
                    </button>
                </form>
            </section>
        </section>
    );
}

export default AccountSettingsPage;
