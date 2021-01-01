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
