import { FetchNextRequestInit } from "./fetchNextRequestInit";

export interface DefaultRequestInit extends RequestInit {
    baseURL?: string | URL;
    ssr?: {
        /** Cookies that should be forwarded from the client by the server. */
        getClientCookies?: () => Promise<string> | string;
    };
    interceptors?: {
        request?: (fetchInput: string, init: FetchNextRequestInit) => FetchNextRequestInit;
    };
}
