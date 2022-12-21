import * as jwt from "jsonwebtoken";
import { TokenOptions } from "opentok";
import { DailyTokenPayload, Domain, getMeetingToken } from "../daily";

const testSecret = "very-very-secret";
const testDomainID = "some-domain-id";
const testRoomName = "some-room";
const testRoomURL = `https://mydomain.daily.co/${testRoomName}`;

describe("Daily meeting token retrieval tests", () => {
  test("Success with default timestamp", () => {
    // Freeze the time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const wantPayload = <DailyTokenPayload>{
      r: testRoomName,
      d: testDomainID,
      // exp should be the default, 24 hours
      exp: Math.floor(now / 1000) + 3600,
      o: false,
      iat: Math.floor(now / 1000),
    };

    const opts = {
      domainID: testDomainID,
    };

    const gotToken = getMeetingToken(testSecret, testRoomURL, opts);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });
  test("Success with explicit exp and role", () => {
    // Freeze time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const wantExp = now + 100;

    const wantPayload = <DailyTokenPayload>{
      r: testRoomName,
      d: testDomainID,
      // exp should be the default, 24 hours
      exp: wantExp,
      o: true,
      iat: Math.floor(now / 1000),
    };

    const opts = <TokenOptions & Domain>{
      domainID: testDomainID,
      expireTime: wantExp,
      role: "moderator",
    };

    const gotToken = getMeetingToken(testSecret, testRoomURL, opts);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });

  test("Success with custom data", () => {
    // Freeze the time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const data = "somekey=somevalue;someotherkey=someothervalue;";
    const wantPayload = <DailyTokenPayload>{
      r: testRoomName,
      d: testDomainID,
      // exp should be the default, 24 hours
      exp: Math.floor(now / 1000) + 3600,
      o: false,
      iat: Math.floor(now / 1000),
      otcd: data,
    };

    const opts = {
      domainID: testDomainID,
      data,
    };

    const gotToken = getMeetingToken(testSecret, testRoomURL, opts);
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(wantPayload);
  });

  test("Pass Daily payload, but no opts except data", () => {
    // Freeze the time
    const now = Date.now();
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const exp = Math.floor(now / 1000) + 3600;
    const data = "somekey=somevalue;someotherkey=someothervalue;";
    const payload = <DailyTokenPayload>{
      r: testRoomName,
      d: testDomainID,
      exp,
      o: false,
      iat: Math.floor(now / 1000),
      otcd: data,
      ud: "123",
    };

    const gotToken = getMeetingToken(
      testSecret,
      testRoomURL,
      undefined,
      payload
    );
    const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
    expect(gotPayload).toStrictEqual(payload);
  });
});

test("Failure with missing domain ID", () => {
  // Freeze the time
  const now = Date.now();
  jest.spyOn(Date, "now").mockImplementation(() => now);

  const payload = <DailyTokenPayload>{
    r: testRoomName,
  };

  expect(() => {
    getMeetingToken(testSecret, testRoomURL, undefined, payload);
  }).toThrow("OpenTok options or Daily payload must contain domain ID");
});

test("Success with domain passed in options", () => {
  // Freeze the time
  const now = Date.now();
  jest.spyOn(Date, "now").mockImplementation(() => now);

  const payload = <DailyTokenPayload>{
    r: testRoomName,
  };

  const wantPayload = <DailyTokenPayload>{
    r: testRoomName,
    d: testDomainID,
    exp: Math.floor(now / 1000) + 3600,
    o: false,
    iat: Math.floor(now / 1000),
  };

  const gotToken = getMeetingToken(
    testSecret,
    testRoomURL,
    { domainID: testDomainID },
    payload
  );
  const gotPayload = <DailyTokenPayload>jwt.decode(gotToken);
  expect(gotPayload).toStrictEqual(wantPayload);
});
