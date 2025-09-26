export interface Token {
    firstName: string;
    lastName: string;
    username: string;
    capabilities: number[];
    isAdult: boolean;
    tokenType: string;
    iss: string;
    iat: number;
    exp: number;
}
