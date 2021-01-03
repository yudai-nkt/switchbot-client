import { RestClient } from "../index";
import nock from "nock";

const ACCESS_TOKEN = "fake_token";

beforeEach(() => {
  nock("https://api.switch-bot.com")
    .get("/v1.0/devices")
    .reply(200, {
      statusCode: 100,
      body: {
        deviceList: [
          {
            deviceId: "500291B269BE",
            deviceName: "Living Room Humidifier",
            deviceType: "Humidifier",
            enableCloudService: true,
            hubDeviceId: "000000000000",
          },
        ],
        infraredRemoteList: [
          {
            deviceId: "02-202008110034-13",
            deviceName: "Living Room TV",
            remoteType: "TV",
            hubDeviceId: "FA7310762361",
          },
        ],
      },
      message: "success",
    })
    .get("/v1.0/devices/C271111EC0AB/status")
    .reply(200, {
      statusCode: 100,
      body: {
        deviceId: "C271111EC0AB",
        deviceType: "Meter",
        hubDeviceId: "FA7310762361",
        humidity: 52,
        temperature: 26.1,
      },
      message: "success",
    })
    .post("/v1.0/devices/210/commands", {
      command: "turnOn",
      parameter: "default",
      commandType: "command",
    })
    .reply(200, {
      statusCode: 100,
      body: {},
      message: "success",
    });
});

describe("test suite for RestClient.getDeviceList()", () => {
  const client = new RestClient(ACCESS_TOKEN);
  it("should return a valid list of devices", async () => {
    const response = await client.getDeviceList();

    expect(response).toEqual({
      deviceList: [
        {
          deviceId: "500291B269BE",
          deviceName: "Living Room Humidifier",
          deviceType: "Humidifier",
          enableCloudService: true,
          hubDeviceId: "000000000000",
        },
      ],
      infraredRemoteList: [
        {
          deviceId: "02-202008110034-13",
          deviceName: "Living Room TV",
          remoteType: "TV",
          hubDeviceId: "FA7310762361",
        },
      ],
    });
  });
});

describe("test suite for RestClient.getDeviceStatus()", () => {
  const client = new RestClient(ACCESS_TOKEN);
  it("should return a status of Meter", async () => {
    const response = await client.getDeviceStatus("C271111EC0AB");

    expect(response).toEqual({
      deviceId: "C271111EC0AB",
      deviceType: "Meter",
      hubDeviceId: "FA7310762361",
      humidity: 52,
      temperature: 26.1,
    });
  });
});

describe("test suite for RestClient.sendControlCommand()", () => {
  const client = new RestClient(ACCESS_TOKEN);
  it("should return a status of Meter", async () => {
    const response = await client.sendControlCommand("210", {
      command: "turnOn",
      parameter: "default",
      commandType: "command",
    });

    expect(response).toEqual({});
  });
});
