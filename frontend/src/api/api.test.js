import { afterEach, describe, expect, it, vi } from "vitest";

import i18n from "../i18n/index.js";
import { login, register } from "./api.js";

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
