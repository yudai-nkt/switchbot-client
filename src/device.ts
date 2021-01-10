import { RestClient } from "./client";
import {
  DeviceCommand,
  PostResponseBody,
  LightCommand,
  TvCommand,
  AirConditionerCommand,
  TurnOnOff,
} from "./interface";

abstract class InfraredDevice {
  protected readonly client: RestClient;
  protected readonly deviceId: string;
  // TODO: this should ideally be a static abstract property.
  // cf. https://github.com/microsoft/TypeScript/issues/34516
  protected abstract deviceType: RegExp;

  constructor(client: RestClient, deviceId: string) {
    this.client = client;
    this.deviceId = deviceId;
  }

  /**
   * Check if the device type associated with the device ID is consistent with the class.
   * @return `true` if the device type is consistent with the class, `false` otherwise.
   * @throws Will throw an error if the device ID is not found in the infrared remote list.
   */
  async validateId(): Promise<boolean> {
    const list = await this.client.getDeviceList();
    const remote = list.infraredRemoteList.filter(
      (remote) => remote.deviceId === this.deviceId
    );
    if (remote.length === 0) {
      throw new Error(`${this.deviceId} is not a valid device ID.`);
    }

    return this.deviceType.test(remote[0].remoteType);
  }

  /**
   * Turn on the device.
   * @return Response of the command execution.
   */
  async turnOn() {
    return this.manipulate({
      command: "turnOn",
      parameter: "default",
      commandType: "command",
    });
  }

  /**
   * Turn off the device.
   * @return Response of the command execution.
   */
  async turnOff() {
    return this.manipulate({
      command: "turnOff",
      parameter: "default",
      commandType: "command",
    });
  }

  protected abstract manipulate(
    command: DeviceCommand
  ): Promise<PostResponseBody>;
}

/**
 * The light device class.
 *
 * This class manipulates light.
 */
export class Light extends InfraredDevice {
  protected readonly deviceType = /(DIY )?Light/;

  protected async manipulate(command: LightCommand): Promise<PostResponseBody> {
    return this.client.sendControlCommand(this.deviceId, command);
  }

  /**
   * Change the brightness.
   * @param brightness If set to `up` (resp. `down`), the brightness level increases (resp. decreases).
   */
  async changeBrightness(brightness: "up" | "down"): Promise<PostResponseBody> {
    const command: LightCommand = {
      command: brightness === "up" ? "brightnessUp" : "brightnessDown",
      parameter: "default",
      commandType: "command",
    };
    return this.manipulate(command);
  }
}

/**
 * The television device class.
 *
 * This class manipulates television.
 */
export class Television extends InfraredDevice {
  protected readonly deviceType = /(DIY )?TV/;

  protected async manipulate(command: TvCommand): Promise<PostResponseBody> {
    return this.client.sendControlCommand(this.deviceId, command);
  }

  /**
   * Change the TV channel.
   * @param channel A channel to be set. If `channel` is a `number`, set to that specific channel.
   * If `channel` is `prev` (resp. `next`), set to the previous (resp. the next) channel.
   */
  async setChannel(
    channel: number | "prev" | "next"
  ): Promise<PostResponseBody> {
    let command: TvCommand;
    if (typeof channel == "number") {
      command = {
        command: "SetChannel",
        parameter: channel,
        commandType: "command",
      };
    } else {
      command = {
        command: channel === "prev" ? "channelSub" : "channelAdd",
        parameter: "default",
        commandType: "command",
      };
    }

    return this.manipulate(command);
  }

  /**
   * Change the volume.
   * @param volume If set to `up` (resp. `down`), the volume level increases (resp. decreases).
   */
  async changeVolume(volume: "up" | "down"): Promise<PostResponseBody> {
    const command: TvCommand = {
      command: volume === "up" ? "volumeAdd" : "volumeSub",
      parameter: "default",
      commandType: "command",
    };

    return this.manipulate(command);
  }
}

/**
 * The air conditioner device class.
 *
 * This class manipulates air conditioner.
 */
export class AirConditioner extends InfraredDevice {
  protected readonly deviceType = /(DIY )?Air Conditioner/;

  protected async manipulate(
    command: AirConditionerCommand
  ): Promise<PostResponseBody> {
    return this.client.sendControlCommand(this.deviceId, command);
  }

  async setParams(
    temperature: number,
    mode: "auto" | "cool" | "dry" | "fan" | "heat",
    fanSpeed: "auto" | "low" | "medium" | "high",
    powerState: "on" | "off"
  ): Promise<PostResponseBody> {
    let modeParam: 1 | 2 | 3 | 4 | 5;
    switch (mode) {
      case "auto":
        modeParam = 1;
        break;

      case "cool":
        modeParam = 2;
        break;

      case "dry":
        modeParam = 3;
        break;

      case "fan":
        modeParam = 4;
        break;

      case "heat":
        modeParam = 5;
        break;

      default:
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
        const _: never = mode;
        throw new Error("This branch should not be reached.");
    }

    let fanSpeedParam: 1 | 2 | 3 | 4;
    switch (fanSpeed) {
      case "auto":
        fanSpeedParam = 1;
        break;

      case "low":
        fanSpeedParam = 2;
        break;

      case "medium":
        fanSpeedParam = 3;
        break;

      case "high":
        fanSpeedParam = 4;
        break;

      default:
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
        const _: never = fanSpeed;
        throw new Error("This branch should not be reached.");
    }

    return this.manipulate({
      command: "setAll",
      // TypeScript infers this value as string (not a strict template literal type),
      // which necessitates this downcasting.
      parameter: `${temperature},${modeParam},${fanSpeedParam},${powerState}` as Exclude<
        AirConditionerCommand,
        TurnOnOff
      >["parameter"],
      commandType: "command",
    });
  }
}
