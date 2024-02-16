interface Request {
    method: string;
    url: string;
    ssr: {
        clientCookiesAttached: boolean;
    };
}

interface Response {
    statusCode: number;
    data: unknown;
}

/** Error thrown when server responds with a different status than 2XX. */
export class ApiResponseError extends Error {
    constructor(public readonly request: Request, public readonly response: Response) {
        super(`Server responded with status: ${response.statusCode}. Request: ${request.method} ${request.url}`);
        Object.setPrototypeOf(this, ApiResponseError.prototype);
    }
}
