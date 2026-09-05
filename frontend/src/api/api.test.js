import { afterEach, describe, expect, it, vi } from "vitest";

import i18n from "../i18n/index.js";
import { getPublicTemplates, instantiateTemplate, login, register } from "./api.js";

function response({ ok, status, body }) {
    return {
        ok,
        status,
        json: vi.fn().mockResolvedValue(body),
    };
}

function mockCsrfThen(errorResponse) {
    vi.stubGlobal("fetch", vi.fn()
        .mockResolvedValueOnce(response({
            ok: true,
            status: 200,
            body: { token: "token", headerName: "X-CSRF-TOKEN" },
        }))
        .mockResolvedValueOnce(errorResponse));
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("localized API errors", () => {
    it("translates a stable authentication error code", async () => {
        await i18n.changeLanguage("ja");
        mockCsrfThen(response({
            ok: false,
            status: 401,
            body: {
                code: "AUTH_INVALID_CREDENTIALS",
                message: "Invalid username or password.",
                fieldErrors: {},
            },
        }));

        await expect(login("traveler", "wrong"))
            .rejects.toThrow("ユーザー名またはパスワードを確認してください。");
    });

    it("translates validation field codes", async () => {
        await i18n.changeLanguage("ja");
        mockCsrfThen(response({
            ok: false,
            status: 400,
            body: {
                code: "VALIDATION_FAILED",
                message: "The submitted information is invalid.",
                fieldErrors: { username: "VALIDATION_USERNAME_SIZE" },
            },
        }));

        await expect(register("x", "password"))
            .rejects.toThrow("ユーザー名は3～20文字で入力してください。");
    });
});

describe("Trip Library API", () => {
    it("loads public templates without requesting a CSRF token", async () => {
        const templates = [{ id: 1, name: "Tokyo Highlights" }];
        const fetchMock = vi.fn().mockResolvedValue(response({
            ok: true,
            status: 200,
            body: templates,
        }));
        vi.stubGlobal("fetch", fetchMock);

        await expect(getPublicTemplates()).resolves.toEqual(templates);
        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock.mock.calls[0][0]).toContain("/api/templates/public");
    });

    it("uses CSRF protection when creating a trip from a template", async () => {
        const trip = { id: 12, name: "Autumn Tokyo" };
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(response({
                ok: true,
                status: 200,
                body: { token: "token", headerName: "X-CSRF-TOKEN" },
            }))
            .mockResolvedValueOnce(response({ ok: true, status: 201, body: trip }));
        vi.stubGlobal("fetch", fetchMock);

        await expect(instantiateTemplate(3, {
            name: "Autumn Tokyo",
            startDate: "2027-10-04",
        })).resolves.toEqual(trip);

        expect(fetchMock.mock.calls[1][0]).toContain("/api/templates/3/instantiate");
        expect(fetchMock.mock.calls[1][1]).toMatchObject({
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": "token",
            },
        });
    });
});
