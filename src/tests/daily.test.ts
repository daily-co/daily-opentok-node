import * as jwt from "jsonwebtoken";
import { TokenOptions } from "opentok";
import { DailyTokenPayload, Domain, getMeetingToken } from "../daily";

describe("Daily meeting token retrieval tests", () => {
  test("Success with default timestamp", () => {
    const secret = "very-very-secret";
    const roomURL = "https://mydomain.daily.co/roomname";

    // Freeze the time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const domainID = "domainID";
    const wantPayload = <DailyTokenPayload>{
      r: "roomname",
      d: domainID,
      // exp should be the default, 24 hours
      exp: Math.floor(now / 1000) + 3600,
      o: false,
      iat: Math.floor(now / 1000),
    };

    const opts = {
      domainID,
    };

    const gotToken = getMeetingToken(secret, roomURL, opts);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });
  test("Success with explicit exp and role", () => {
    const secret = "very-very-secret";
    const roomURL = "https://mydomain.daily.co/roomname";

    // Freeze time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const wantExp = now + 100;

    const domainID = "domain-id";
    const wantPayload = <DailyTokenPayload>{
      r: "roomname",
      d: domainID,
      // exp should be the default, 24 hours
      exp: wantExp,
      o: true,
      iat: Math.floor(now / 1000),
    };

    const opts = <TokenOptions & Domain>{
      domainID,
      expireTime: wantExp,
      role: "moderator",
    };

    const gotToken = getMeetingToken(secret, roomURL, opts);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });

  test("Success with custom data", () => {
    const secret = "very-very-secret";
    const roomURL = "https://mydomain.daily.co/roomname";

    // Freeze the time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const domainID = "domainID";
    const data = "somekey=somevalue;someotherkey=someothervalue;";
    const wantPayload = <DailyTokenPayload>{
      r: "roomname",
      d: domainID,
      // exp should be the default, 24 hours
      exp: Math.floor(now / 1000) + 3600,
      o: false,
      iat: Math.floor(now / 1000),
      otcd: data,
    };

    const opts = {
      domainID,
      data,
    };

    const gotToken = getMeetingToken(secret, roomURL, opts);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });
});
