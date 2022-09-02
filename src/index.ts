/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { createRoom, getMeetingToken, Domain, getDomainID } from "./daily";

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

  constructor(apiKey: string, _apiSecret: string) {
    this.apiKey = apiKey;
    this.domainID = "";
  }

  public deleteArchive(
    archiveId: string,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public dial(
    sessionId: string,
    token: Token,
    sipUri: string,
    options: DialOptions,
    callback: (error: Error | null, sipInterconnect: SipInterconnect) => void
  ): void {
    notImplemented();
  }

  public forceDisconnect(
    sessionId: string,
    connectionId: string,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public getArchive(
    archiveId: string,
    callback: (error: Error | null, archive?: Archive) => void
  ): void {
    notImplemented();
  }

  public getBroadcast(
    broadcastId: string,
    callback: (error: Error | null, broadcast?: Broadcast) => void
  ): void {
    notImplemented();
  }

  public getStream(
    sessionId: string,
    options: StreamId,
    callback: (error: Error | null, stream?: Stream) => void
  ): void {
    notImplemented();
  }

  public listArchives(
    options: ListArchivesOptions,
    callback: (
      error: Error | null,
      archives?: Archive[],
      totalCount?: number
    ) => void
  ): void {
    notImplemented();
  }

  public listBroadcasts(
    options: ListBroadcastsOptions,
    callback: (error: Error | null, broadcasts?: Broadcast[]) => void
  ): void {
    notImplemented();
  }

  public listStreams(
    sessionId: string,
    callback: (error: Error | null, streams?: Stream[]) => void
  ): void {
    notImplemented();
  }

  public addArchiveStream(
    archiveId: string,
    streamId: string,
    options: PatchStream,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public removeArchiveStream(
    archiveId: string,
    streamId: string,
    options: PatchStream,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public addBroadcastStream(
    broadcastId: string,
    streamId: string,
    options: PatchStream,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public removeBroadcastStream(
    broadcastId: string,
    streamId: string,
    options: PatchStream,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public playDTMF(
    sessionId: string,
    connectionId: string,
    digits: string,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public setArchiveLayout(
    archiveId: string,
    type: BroadcastLayoutType | "custom",
    stylesheet: string | null,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public setBroadcastLayout(
    broadcastId: string,
    type: BroadcastLayoutType | "custom",
    stylesheet: string | null,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public setStreamClassLists(
    sessionId: string,
    classListArray: ReadonlyArray<{ id: string; layoutClassList: string[] }>,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public signal(
    sessionId: string,
    connectionId: string | null,
    data: SignalOptions,
    callback: (error: Error | null) => void
  ): void {
    notImplemented();
  }

  public startArchive(
    sessionId: string,
    options: ArchiveOptions,
    callback: (error: Error | null, archive?: Archive) => void
  ): void {
    notImplemented();
  }

  public startBroadcast(
    sessionId: string,
    options: BroadcastOptions,
    callback: (error: Error | null, broadcast: Broadcast) => void
  ): void {
    notImplemented();
  }

  public stopArchive(
    archiveId: string,
    callback: (error: Error | null, archive?: Archive) => void
  ): void {
    notImplemented();
  }

  public stopBroadcast(
    broadcastId: string,
    callback: (error: Error | null, broadcast: BroadcastStopResponse) => void
  ): void {
    notImplemented();
  }

  // getDomainID() retrieves a Daily domain ID
  public getDomainID(): Promise<string> {
    return getDomainID(this.apiKey).then((id) => {
      this.domainID = id;
      return id;
    });
  }

  // createSession() creates a Daily room and wrangles it
  // into an OpenTok session object
  createSession(_opts: OTOptions, callback: Callback) {
    createRoom(this.apiKey)
      .then((room) => {
        const session = {
          sessionId: room.url,
          mediaMode: "routed",
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

export default function OpenTok(apiKey: string, domainID: string, env: {}) {
  return new OpenTokClass(apiKey, domainID);
}
