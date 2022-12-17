import { Archive, ArchiveOptions, Broadcast, BroadcastLayoutType, BroadcastOptions, BroadcastStopResponse, DialOptions, ListArchivesOptions, ListBroadcastsOptions, PatchStream, Session, SignalOptions, SipInterconnect, Stream, StreamId, Token, TokenOptions } from "opentok";
declare type MediaMode = "routed" | "relayed";
declare type ArchiveMode = "always" | "manual";
declare type OTOptions = {
    mediaMode: MediaMode;
    archiveMode: ArchiveMode;
};
declare type Callback = (error: Error | null, session?: Session) => void;
declare class OpenTokClass {
    private readonly apiKey;
    private domainID;
    constructor(apiKey: string, domainID?: string);
    deleteArchive(_archiveId: string, _callback: (error: Error | null) => void): void;
    dial(_sessionId: string, _token: Token, _sipUri: string, _options: DialOptions, _callback: (error: Error | null, sipInterconnect: SipInterconnect) => void): void;
    forceDisconnect(_sessionId: string, _connectionId: string, _callback: (error: Error | null) => void): void;
    getArchive(_archiveId: string, _callback: (error: Error | null, archive?: Archive) => void): void;
    getBroadcast(_broadcastId: string, _callback: (error: Error | null, broadcast?: Broadcast) => void): void;
    getStream(_sessionId: string, _options: StreamId, _callback: (error: Error | null, stream?: Stream) => void): void;
    listArchives(_options: ListArchivesOptions, _callback: (error: Error | null, archives?: Archive[], totalCount?: number) => void): void;
    listBroadcasts(_options: ListBroadcastsOptions, _callback: (error: Error | null, broadcasts?: Broadcast[]) => void): void;
    listStreams(_sessionId: string, _callback: (error: Error | null, streams?: Stream[]) => void): void;
    addArchiveStream(_archiveId: string, _streamId: string, _options: PatchStream, _callback: (error: Error | null) => void): void;
    removeArchiveStream(_archiveId: string, _streamId: string, _options: PatchStream, _callback: (error: Error | null) => void): void;
    addBroadcastStream(_broadcastId: string, _streamId: string, _options: PatchStream, _callback: (error: Error | null) => void): void;
    removeBroadcastStream(_broadcastId: string, _streamId: string, _options: PatchStream, _callback: (error: Error | null) => void): void;
    playDTMF(_sessionId: string, _connectionId: string, _digits: string, _callback: (error: Error | null) => void): void;
    setArchiveLayout(_archiveId: string, _type: BroadcastLayoutType | "custom", _stylesheet: string | null, _callback: (error: Error | null) => void): void;
    setBroadcastLayout(_broadcastId: string, _type: BroadcastLayoutType | "custom", _stylesheet: string | null, _callback: (error: Error | null) => void): void;
    setStreamClassLists(_sessionId: string, _classListArray: ReadonlyArray<{
        id: string;
        layoutClassList: string[];
    }>, _callback: (error: Error | null) => void): void;
    signal(_sessionId: string, _connectionId: string | null, _data: SignalOptions, _callback: (error: Error | null) => void): void;
    startArchive(_sessionId: string, _options: ArchiveOptions, _callback: (error: Error | null, archive?: Archive) => void): void;
    startBroadcast(_sessionId: string, _options: BroadcastOptions, _callback: (error: Error | null, broadcast: Broadcast) => void): void;
    stopArchive(_archiveId: string, _callback: (error: Error | null, archive?: Archive) => void): void;
    stopBroadcast(_broadcastId: string, _callback: (error: Error | null, broadcast: BroadcastStopResponse) => void): void;
    getDomainID(): Promise<string>;
    createSession(opts: OTOptions, callback: Callback): void;
    generateToken(sessionID: string, options?: TokenOptions): string;
}
export default function OpenTok(apiKey: string, domainID?: string, _env?: {}): OpenTokClass;
export {};
//# sourceMappingURL=index.d.ts.map