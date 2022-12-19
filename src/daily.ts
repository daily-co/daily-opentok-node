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

interface DailyRoomProperties {
  start_video_off: boolean;
  start_audio_off: boolean;
  sfu_switchover: number;
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
    .then((res) => {
      if (res.status !== 200 || !res.data) {
        throw new Error(errMsg);
      }
      return res.data.domain_id;
    })
    .catch((error) => {
      throw new Error(`${errMsg}: ${error})`);
    });
}

// getMeetingToken() obtains a meeting token for a room from Daily.
export function getMeetingToken(
  apiKey: string,
  roomURL: string,
  opts: TokenOptions & Domain & Data
): string {
  const now = Math.floor(Date.now() / 1000);
  const defaultExp = now + 3600;

  const roomName = getRoomName(roomURL);
  const { domainID } = opts;
  if (!domainID) {
    throw new Error("options must contain domain ID");
  }

  // We are going to self-sign these, removing
  // need for a round-trip.
  const payload = <DailyTokenPayload>{
    r: roomName,
    d: domainID,
    exp: defaultExp,
    o: false,
    iat: now,
    u: undefined,
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

  if (opts?.data) {
    const dataObj = opts.data
      .split('&')
      .reduce((obj: { [key: string]: string }, pair) => {
        const [key, value] = pair.split('=');
        obj[key] = value;
        return obj;
      }, {});

    if (dataObj?.username) {
      payload.u = decodeURIComponent(dataObj.username);
    }

    if (dataObj?.uuid) {
      payload.ud = decodeURIComponent(dataObj.uuid);
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
