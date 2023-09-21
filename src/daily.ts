import axios from "axios";
import * as jwt from "jsonwebtoken";

type Role = "subscriber" | "publisher" | "moderator";
interface TokenOptions {
  role?: Role | undefined;
  data?: string | undefined;
  expireTime?: number | undefined;
  initialLayoutClassList?: string[] | undefined;
}

// The data we'll expect to get from Daily on room creation.
// Daily actually returns much more data, but these are the only
// properties we'll be using.
interface DailyRoomData {
  id: string;
  name: string;
  url: string;
}

interface DailyRoomProperties {
  start_video_off: boolean;
  start_audio_off: boolean;
  sfu_switchover: number;
}

export interface Domain {
  domainID: string;
}

// All Daily token claims can be found here:
// https://docs.daily.co/reference/rest-api/meeting-tokens/self-signing-tokens
export interface DailyTokenPayload {
  r: string;
  d: string;
  exp: number;
  o: boolean;
  iat: number;
  otcd: string;
  ud: string;
  u: string;
}

const dailyAPIDomain = "daily.co";
const dailyAPIURL = `https://api.${dailyAPIDomain}/v1`;

export async function createRoom(
  apiKey: string,
  forceSFU = false
): Promise<DailyRoomData> {
  const req = {
    // TODO: find out if OT sessions have a default
    // expiry time or any other default options that map
    // to Daily rooms.
    properties: <DailyRoomProperties>{
      start_audio_off: false,
      start_video_off: false,
    },
  };

  if (forceSFU) {
    req.properties.sfu_switchover = 0.5;
  }

  // Prepare our headers, containing our Daily API key
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const url = `${dailyAPIURL}/rooms/`;
  const data = JSON.stringify(req);
  const roomErrMsg = "failed to create room";
  // We won't do any error logging here, delegating logging
  // and other error handling to the judgement of the caller.
  const res = await axios
    .post(url, data, { headers })
    .catch((error: unknown) => {
      throw new Error(`${roomErrMsg}: ${error})`);
    });

  if (res.status !== 200 || !res.data) {
    throw new Error(roomErrMsg);
  }
  // Cast Daily's response to our room data interface.
  const roomData = <DailyRoomData>res.data;
  return roomData;
}

function getRoomName(roomURL: string): string {
  const url = new URL(roomURL);
  const roomName = url.pathname.replace("/", "");
  return roomName;
}

export function getDomainID(apiKey: string): Promise<string> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const url = dailyAPIURL;
  const errMsg = "failed to get domain ID";
  return axios
    .get(url, { headers })
    .then((res: { status: number; data: { domain_id: any } }) => {
      if (res.status !== 200 || !res.data) {
        throw new Error(errMsg);
      }
      return res.data.domain_id;
    })
    .catch((error: unknown) => {
      throw new Error(`${errMsg}: ${error})`);
    });
}

// getMeetingToken() obtains a meeting token for a room from Daily.
// We are going to self-sign these, removing
// need for a round-trip.
export function getMeetingToken(
  apiKey: string,
  roomURL: string,
  opts?: TokenOptions & Domain,
  dailyPayload?: DailyTokenPayload
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = dailyPayload ?? <DailyTokenPayload>{};

  // If passed, Daily payload properties take priority
  // over other potential options.
  if (!payload.r) {
    const roomName = getRoomName(roomURL);
    payload.r = roomName;
  }
  if (!payload.d) {
    if (!opts || !opts.domainID) {
      throw new Error(
        "OpenTok options or Daily payload must contain domain ID"
      );
    }
    payload.d = opts.domainID;
  }
  if (!payload.exp) {
    const defaultExp = now + 3600;
    let exp = defaultExp;

    const otOptsExp = opts?.expireTime;
    if (otOptsExp) {
      if (new Date(otOptsExp).getTime() <= 0) {
        throw new Error(
          `invalid expire time provided. Expiry must be a UNIX time stamp: ${exp}`
        );
      }
      exp = otOptsExp;
    }
    payload.exp = exp;
  }
  if (!payload.o) {
    payload.o = false;
  }
  if (!payload.iat) {
    payload.iat = now;
  }

  // Handle OT options, if any, with their Daily equivalents
  if (opts) {
    const { data, role } = opts;
    if (data) {
      if (data.length > 1024) {
        throw new Error("Token data must have a maximum length 1024");
      }
      payload.otcd = data;
    }

    // We're going to treat a "moderator" as the equivalent of
    // a Daily room "owner"
    if (role === "moderator") {
      payload.o = true;
    }
  }

  const jp = JSON.stringify(payload);
  try {
    const token = jwt.sign(jp, apiKey);
    return token;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`failed to create self-signed JWT: ${e.toString()}`);
    }
    throw new Error(`failed to create self-signed JWT: ${e}`);
  }
}
