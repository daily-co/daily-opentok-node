import * as jwt from "jsonwebtoken";
import { TokenOptions } from "opentok";
import { DailyTokenPayload, getMeetingToken } from "../daily";

describe("Daily meeting token retrieval tests", () => {
  test("Success with default timestamp", () => {
    const secret = "very-very-secret";
    const roomURL = "https://mydomain.daily.co/roomname";

    // Freeze the
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const wantPayload = <DailyTokenPayload>{
      r: "roomname",
      d: "mydomain",
      // exp should be the default, 24 hours
      exp: Math.floor(now / 1000) + 86400,
      o: false,
      iat: Math.floor(now / 1000),
    };

    const gotToken = getMeetingToken(secret, roomURL);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });
  test("Success with explicit exp and role", () => {
    const secret = "very-very-secret";
    const roomURL = "https://mydomain.daily.co/roomname";

    // Freeze the
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const wantExp = now + 3600;
    const options = <TokenOptions>{
      expireTime: wantExp,
      role: "moderator",
    };

    const wantPayload = <DailyTokenPayload>{
      r: "roomname",
      d: "mydomain",
      // exp should be the default, 24 hours
      exp: wantExp,
      o: true,
      iat: Math.floor(now / 1000),
    };

    const gotToken = getMeetingToken(secret, roomURL, options);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });
});
