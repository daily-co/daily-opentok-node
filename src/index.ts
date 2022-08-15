import { Session, TokenOptions } from "opentok";
import { createRoom, getMeetingToken, Domain, getDomainID } from "./daily";

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

export default class OpenTok {
  private readonly apiKey: string;

  constructor(apiKey: string, _apiSecret: string) {
    this.apiKey = apiKey;
  }

  // getDomainID() retrieves a Daily domain ID
  getDomainID(): Promise<string> {
    return getDomainID(this.apiKey).then((id) => id);
  }

  // createSession() creates a Daily room and wrangles it
  // into an OpenTok session object
  createSession(_opts: OTOptions, callback: Callback) {
    createRoom(this.apiKey)
      .then((room) => {
        const session = <Session>{
          sessionId: room.url,
        };
        callback(null, session);
      })
      .catch((e) => {
        callback(new Error(`failed to create session: ${e.toString()}`));
      });
  }

  // generateToken() returns a self-signed Daily meeting token
  generateToken(sessionID: string, options?: TokenOptions & Domain): string {
    if (!options?.domainID) {
      throw new Error("expecting Daily domain ID in options");
    }
    return getMeetingToken(this.apiKey, sessionID, options);
  }
}
