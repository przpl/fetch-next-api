export interface FetchNextErrorRequest {
    method: string;
    url: string;
    ssr: {
        clientCookiesAttached: boolean;
    };
}

export interface FetchNextErrorResponse {
    statusCode: number;
    data: unknown;
}

/** Error thrown when server responds with a different status than 2XX. */
export class FetchNextError extends Error {
    constructor(public readonly request: FetchNextErrorRequest, public readonly response: FetchNextErrorResponse) {
        super(`Server responded with status: ${response.statusCode}. Request: ${request.method} ${request.url}`);
        Object.setPrototypeOf(this, FetchNextError.prototype);
    }
}
