import axios from "axios";
import { TokenOptions } from "opentok";
import * as jwt from "jsonwebtoken";

// The data we'll expect to get from Daily on room creation.
// Daily actually returns much more data, but these are the only
// properties we'll be using.
interface DailyRoomData {
  id: string;
  name: string;
  url: string;
}

interface TokenConfig {
  roomName: string;
  domainID: string;
}

export interface DailyTokenPayload {
  r: string;
  d: string;
  exp: number;
  o: boolean;
  iat: number;
}

const dailyAPIDomain = "daily.co";
const dailyAPIURL = `https://api.${dailyAPIDomain}/v1`;

export async function createRoom(apiKey: string): Promise<DailyRoomData> {
  const req = {
    // TODO: find out if OT sessions have a default
    // expiry time or any other default options that map
    // to Daily rooms.
    properties: {
      start_audio_off: false,
      start_video_off: false,
    },
  };

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
  const res = await axios.post(url, data, { headers }).catch((error) => {
    throw new Error(`${roomErrMsg}: ${error})`);
  });

  if (res.status !== 200 || !res.data) {
    throw new Error(roomErrMsg);
  }
  // Cast Daily's response to our room data interface.
  const roomData = <DailyRoomData>res.data;
  return roomData;
}

function getTokenConfig(roomURL: string): TokenConfig {
  const url = new URL(roomURL);
  const roomName = url.pathname.replace("/", "");

  const { hostname } = url;

  const parts = hostname.split(".");
  if (parts.length !== 3) {
    throw new Error(
      `unexpected hostname; must have Daily account subdomain: ${hostname}`
    );
  }
  const domainID = parts[0];
  return <TokenConfig>{
    roomName,
    domainID,
  };
}
// getMeetingToken() obtains a meeting token for a room from Daily.
export function getMeetingToken(
  apiKey: string,
  roomURL: string,
  opts: TokenOptions | null = null
): string {
  const now = Math.floor(Date.now() / 1000);
  const defaultExp = now + 86400;

  const c = getTokenConfig(roomURL);

  // We are going to self-sign these, removing
  // need for a round-trip.
  const payload = <DailyTokenPayload>{
    r: c.roomName,
    d: c.domainID,
    exp: defaultExp,
    o: false,
    iat: now,
  };

  const exp = opts?.expireTime;
  if (exp) {
    if (new Date(exp).getTime() <= 0) {
      throw new Error(
        `invalid expire time provided. Expiry must be a UNIX time stamp: ${exp}`
      );
    }
    payload.exp = exp;
  }

  const role = opts?.role;
  // We're going to treat a "moderator" as the equivalent of
  // a Daily room "owner"
  if (role === "moderator") {
    payload.o = true;
  }

  try {
    const token = jwt.sign(payload, apiKey);
    return token;
  } catch (e) {
    throw new Error(`failed to create self-signed JWT: ${e.toString()}`);
  }
}
