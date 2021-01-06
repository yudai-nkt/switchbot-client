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
    })
    .get("/v1.0/scenes")
    .reply(200, {
      statusCode: 100,
      body: [
        {
          sceneId: "T02-20200804130110",
          sceneName: "Close Office Devices",
        },
        {
          sceneId: "T02-202009221414-48924101",
          sceneName: "Set Office AC to 25",
        },
        {
          sceneId: "T02-202011051830-39363561",
          sceneName: "Set Bedroom to 24",
        },
        {
          sceneId: "T02-202011051831-82928991",
          sceneName: "Turn off home devices",
        },
        {
          sceneId: "T02-202011062059-26364981",
          sceneName: "Set Bedroom to 26 degree",
        },
      ],
      message: "success",
    })
    .post("/v1.0/scenes/T02-202009221414-48924101/execute")
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
  it("should return a response of turn-on command", async () => {
    const response = await client.sendControlCommand("210", {
      command: "turnOn",
      parameter: "default",
      commandType: "command",
    });

    expect(response).toEqual({});
  });
});

describe("test suite for RestClient.getSceneList()", () => {
  const client = new RestClient(ACCESS_TOKEN);
  it("should return a list of scenes", async () => {
    const response = await client.getSceneList();

    expect(response).toEqual([
      {
        sceneId: "T02-20200804130110",
        sceneName: "Close Office Devices",
      },
      {
        sceneId: "T02-202009221414-48924101",
        sceneName: "Set Office AC to 25",
      },
      {
        sceneId: "T02-202011051830-39363561",
        sceneName: "Set Bedroom to 24",
      },
      {
        sceneId: "T02-202011051831-82928991",
        sceneName: "Turn off home devices",
      },
      {
        sceneId: "T02-202011062059-26364981",
        sceneName: "Set Bedroom to 26 degree",
      },
    ]);
  });
});

describe("test suite for RestClient.execScene()", () => {
  const client = new RestClient(ACCESS_TOKEN);
  it("should return a response of scene execution", async () => {
    const response = await client.execScene("T02-202009221414-48924101");

    expect(response).toEqual({});
  });
});
