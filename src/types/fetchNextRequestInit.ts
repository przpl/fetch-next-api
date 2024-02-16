export interface FetchNextRequestInit extends RequestInit {
    ssr?: {
        /** Cookies that should be forwarded from the client by the server. */
        clientCookies?: string;
    };
}
