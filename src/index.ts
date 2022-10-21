/* eslint-disable class-methods-use-this */
import {
  Archive,
  ArchiveOptions,
  Broadcast,
  BroadcastLayoutType,
  BroadcastOptions,
  BroadcastStopResponse,
  DialOptions,
  ListArchivesOptions,
  ListBroadcastsOptions,
  PatchStream,
  Session,
  SignalOptions,
  SipInterconnect,
  Stream,
  StreamId,
  Token,
  TokenOptions,
} from "opentok";
import { createRoom, getMeetingToken, getDomainID } from "./daily";

function notImplemented(): never {
  throw new Error("Method not implemented.");
}
type MediaMode = "routed" | "relayed";
type ArchiveMode = "always" | "manual";

// Just a couple of OpenTok options now, which we will
// do nothing with. We can expand on this to both
// accept OT options and add our own room options.
type OTOptions = {
  mediaMode: MediaMode;
  archiveMode: ArchiveMode;
};

// What we'll call after a session is created
type Callback = (error: Error | null, session?: Session) => void;

class OpenTokClass {
  private readonly apiKey: string;

  private domainID: string;

  constructor(apiKey: string, domainID: string = "") {
    this.apiKey = apiKey;
    this.domainID = domainID;
  }

  deleteArchive(
    _archiveId: string,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  dial(
    _sessionId: string,
    _token: Token,
    _sipUri: string,
    _options: DialOptions,
    _callback: (error: Error | null, sipInterconnect: SipInterconnect) => void
  ): void {
    notImplemented();
  }

  forceDisconnect(
    _sessionId: string,
    _connectionId: string,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  getArchive(
    _archiveId: string,
    _callback: (error: Error | null, archive?: Archive) => void
  ): void {
    notImplemented();
  }

  getBroadcast(
    _broadcastId: string,
    _callback: (error: Error | null, broadcast?: Broadcast) => void
  ): void {
    notImplemented();
  }

  getStream(
    _sessionId: string,
    _options: StreamId,
    _callback: (error: Error | null, stream?: Stream) => void
  ): void {
    notImplemented();
  }

  listArchives(
    _options: ListArchivesOptions,
    _callback: (
      error: Error | null,
      archives?: Archive[],
      totalCount?: number
    ) => void
  ): void {
    notImplemented();
  }

  listBroadcasts(
    _options: ListBroadcastsOptions,
    _callback: (error: Error | null, broadcasts?: Broadcast[]) => void
  ): void {
    notImplemented();
  }

  listStreams(
    _sessionId: string,
    _callback: (error: Error | null, streams?: Stream[]) => void
  ): void {
    notImplemented();
  }

  addArchiveStream(
    _archiveId: string,
    _streamId: string,
    _options: PatchStream,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  removeArchiveStream(
    _archiveId: string,
    _streamId: string,
    _options: PatchStream,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  addBroadcastStream(
    _broadcastId: string,
    _streamId: string,
    _options: PatchStream,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  removeBroadcastStream(
    _broadcastId: string,
    _streamId: string,
    _options: PatchStream,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  playDTMF(
    _sessionId: string,
    _connectionId: string,
    _digits: string,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  setArchiveLayout(
    _archiveId: string,
    _type: BroadcastLayoutType | "custom",
    _stylesheet: string | null,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  setBroadcastLayout(
    _broadcastId: string,
    _type: BroadcastLayoutType | "custom",
    _stylesheet: string | null,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  setStreamClassLists(
    _sessionId: string,
    _classListArray: ReadonlyArray<{ id: string; layoutClassList: string[] }>,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  signal(
    _sessionId: string,
    _connectionId: string | null,
    _data: SignalOptions,
    _callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  startArchive(
    _sessionId: string,
    _options: ArchiveOptions,
    _callback: (error: Error | null, archive?: Archive) => void
  ): void {
    notImplemented();
  }

  startBroadcast(
    _sessionId: string,
    _options: BroadcastOptions,
    _callback: (error: Error | null, broadcast: Broadcast) => void
  ): void {
    notImplemented();
  }

  stopArchive(
    _archiveId: string,
    _callback: (error: Error | null, archive?: Archive) => void
  ): void {
    notImplemented();
  }

  stopBroadcast(
    _broadcastId: string,
    _callback: (error: Error | null, broadcast: BroadcastStopResponse) => void
  ): void {
    notImplemented();
  }

  // getDomainID() retrieves a Daily domain ID
  getDomainID(): Promise<string> {
    return getDomainID(this.apiKey).then((id) => {
      this.domainID = id;
      return id;
    });
  }

  // createSession() creates a Daily room and wrangles it
  // into an OpenTok session object
  createSession(opts: OTOptions, callback: Callback) {
    createRoom(this.apiKey, opts.mediaMode === "routed")
      .then((room) => {
        const session = {
          sessionId: room.url,
          mediaMode: opts.mediaMode,
          archiveMode: "manual",
          ot: this,
        };
        callback(null, session);
      })
      .catch((e) => {
        callback(new Error(`failed to create session: ${e.toString()}`));
      });
  }

  // generateToken() returns a self-signed Daily meeting token
  generateToken(sessionID: string, options?: TokenOptions): string {
    if (!this.domainID) {
      throw new Error(
        "Daily domain ID is missing. Did you call getDomainID() first?"
      );
    }
    return getMeetingToken(this.apiKey, sessionID, {
      ...options,
      domainID: this.domainID,
    });
  }
}

export default function OpenTok(apiKey: string, domainID?: string, _env?: {}) {
  return new OpenTokClass(apiKey, domainID);
}
