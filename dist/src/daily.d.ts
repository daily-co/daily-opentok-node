import { TokenOptions } from "opentok";
interface DailyRoomData {
    id: string;
    name: string;
    url: string;
}
export interface Domain {
    domainID: string;
}
export interface Data {
    data?: string;
}
export interface DailyTokenPayload {
    r: string;
    d: string;
    exp: number;
    o: boolean;
    iat: number;
    u?: string;
    ud?: string;
}
export declare function createRoom(apiKey: string, forceSFU?: boolean): Promise<DailyRoomData>;
export declare function getDomainID(apiKey: string): Promise<string>;
export declare function getMeetingToken(apiKey: string, roomURL: string, opts: TokenOptions & Domain & Data): string;
export {};
//# sourceMappingURL=daily.d.ts.map