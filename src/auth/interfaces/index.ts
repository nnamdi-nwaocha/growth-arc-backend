export interface ITokenPayload {
    userId: string;
}

export interface ISetTokensResponse {
    accessToken: string;
    refreshToken: string;
}