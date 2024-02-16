import { ApiResponseError } from "./apiResponseError";
import { DefaultRequestInit } from "./types/defaultRequestInit";
import { FetchNextRequestInit } from "./types/fetchNextRequestInit";

type WithDataRequestInit = Omit<FetchNextRequestInit, "method" | "body">;

export class FetchNext {
    constructor(private defaultInit?: DefaultRequestInit) {}

    public async get<T = void>(input: RequestInfo | URL, init?: Omit<FetchNextRequestInit, "method"> | undefined) {
        return await this.fetch<T>(input, { ...init, method: "GET" });
    }

    public async post<T = void>(input: RequestInfo | URL, data: { body: object | null }, init?: WithDataRequestInit | undefined) {
        return await this.fetchWithData<T>("POST", input, data, init);
    }

    public async put<T = void>(input: RequestInfo | URL, data: { body: object | null }, init?: WithDataRequestInit | undefined) {
        return await this.fetchWithData<T>("PUT", input, data, init);
    }

    public async patch<T = void>(input: RequestInfo | URL, data: { body: object | null }, init?: WithDataRequestInit | undefined) {
        return await this.fetchWithData<T>("PATCH", input, data, init);
    }

    public async delete<T = void>(input: RequestInfo | URL, init?: Omit<FetchNextRequestInit, "method"> | undefined) {
        return await this.fetch<T>(input, { ...init, method: "DELETE" });
    }

    public async fetch<T = void>(input: RequestInfo | URL, init?: Readonly<FetchNextRequestInit>): Promise<T> {
        const finalInit = { ...this.defaultInit, ...init };
        const ssr = { clientCookiesAttached: false };

        if (init?.ssr?.clientCookies) {
            finalInit.headers = { ...finalInit.headers, Cookie: init.ssr.clientCookies };
            ssr.clientCookiesAttached = true;
        } else if (this.defaultInit?.ssr?.getClientCookies) {
            finalInit.headers = { ...finalInit.headers, Cookie: this.defaultInit.ssr?.getClientCookies() };
            ssr.clientCookiesAttached = true;
        }

        const url = this.combineUrl(input);
        const response = await fetch(url, finalInit);

        let data: T;
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            const text = await response.text();
            // server can return empty response which will cause JSON.parse to throw an error
            if (text) {
                data = JSON.parse(text);
            } else {
                data = {} as T;
            }
        } else {
            data = (await response.text()) as T; // string is (probably) not a valid type for T. There is no guarantee that the response from the server will be of type T.
        }

        if (!response.ok) {
            throw new ApiResponseError({ method: finalInit?.method || "GET", url, ssr }, { statusCode: response.status, data });
        }

        return data;
    }

    private async fetchWithData<T>(
        method: "POST" | "PUT" | "PATCH",
        input: RequestInfo | URL,
        data: { body: object | null },
        init?: WithDataRequestInit | undefined
    ) {
        const headers: HeadersInit = {};
        if (data.body !== undefined && data.body !== null && !(data.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        return await this.fetch<T>(input, {
            method,
            body: data.body !== undefined && data.body !== null && !(data.body instanceof FormData) ? JSON.stringify(data.body) : data.body,
            ...init,
            headers: {
                ...headers,
                ...init?.headers,
            },
        });
    }

    private combineUrl(path: RequestInfo | URL) {
        if (!this.defaultInit || !this.defaultInit.baseURL) {
            return path.toString();
        }

        const baseURLString = this.defaultInit.baseURL.toString();
        const pathString = path.toString();

        const baseURLHasTrailingSlash = baseURLString.endsWith("/");
        const pathHasLeadingSlash = pathString.startsWith("/");

        if (baseURLHasTrailingSlash && pathHasLeadingSlash) {
            return `${baseURLString}${pathString.slice(1)}`;
        }
        if (!baseURLHasTrailingSlash && !pathHasLeadingSlash) {
            return `${baseURLString}/${pathString}`;
        }
        return `${baseURLString}${pathString}`;
    }
}
