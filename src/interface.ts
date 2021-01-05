type DeviceType =
  | "Hub"
  | "Hub Mini"
  | "Hub Plus"
  | "Bot"
  | "Curtain"
  | "Plug"
  | "Meter"
  | "Humidifier"
  | "Smart Fan";

type DeviceId = string;

interface DeviceGeneric {
  deviceId: DeviceId;
  deviceName: string;
  deviceType: Exclude<DeviceType, "Curtain">;
  enableCloudService: boolean;
  hubDeviceId: string;
}

interface Curtain extends Omit<DeviceGeneric, "deviceType"> {
  deviceType: "Curtain";
  curtainDevicesIds: Array<DeviceId>;
  calibrate: boolean;
  group: boolean;
  master: boolean;
  openDirection: string;
}

type Device = DeviceGeneric | Curtain;

type RemoteType =
  | "Air Conditioner"
  | "TV"
  | "Light"
  | "IPTV/Streamer"
  | "Set Top Box"
  | "DVD"
  | "Fan"
  | "Projector"
  | "Camera"
  | "Air Purifier"
  | "Speaker"
  | "Water Heater"
  | "Vacuum Cleaner"
  | "Others";

interface InfraredRemote {
  deviceId: string;
  deviceName: string;
  remoteType: RemoteType;
  hubDeviceId: string;
}

export interface DeviceList {
  deviceList: Array<Device>;
  infraredRemoteList: Array<InfraredRemote>;
}

interface DeviceStatusGeneric {
  deviceId: DeviceId;
  deviceType: Exclude<
    DeviceType,
    "Bot" | "Plug" | "Humidifier" | "Meter" | "Curtain" | "Smart Fan"
  >;
  hubDeviceId: DeviceId;
}

type DeviceStatusWithoutType = Omit<DeviceStatusGeneric, "deviceType">;

interface BotOrPlugStatus extends DeviceStatusWithoutType {
  deviceType: "Bot" | "Plug";
  power: string;
}

interface HumidifierStatus extends DeviceStatusWithoutType {
  deviceType: "Humidifier";
  power: string;
  humidity: number;
  temperature: number;
  nebulizationEfficiency: number;
  auto: boolean;
  childLock: boolean;
  sound: boolean;
}

interface MeterStatus extends DeviceStatusWithoutType {
  deviceType: "Meter";
  humidity: number;
  temperature: number;
}

interface CurtainStatus extends DeviceStatusWithoutType {
  deviceType: "Curtain";
  calibrate: boolean;
  group: boolean;
  moving: boolean;
  slidePosition: number;
}

interface SmartFanStatus extends DeviceStatusWithoutType {
  deviceType: "Smart Fan";
  mode: number;
  speed: number;
  shaking: boolean;
  shakeCenter: number;
  shakeRange: number;
}

export type DeviceStatus =
  | DeviceStatusGeneric
  | BotOrPlugStatus
  | HumidifierStatus
  | MeterStatus
  | CurtainStatus
  | SmartFanStatus;

type BuildControlCommand<
  T extends string,
  U extends string | number = "default",
  V extends "command" | "customize" = "command"
> = { command: T; parameter?: U; commandType?: V };

type TurnOnOff = BuildControlCommand<"turnOn" | "turnOff">;

type BotCommand = TurnOnOff | BuildControlCommand<"press">;

type PlugCommand = TurnOnOff;

type CurtainCommand =
  | TurnOnOff
  | BuildControlCommand<"setPosition", `${number},${0 | 1 | "ff"},${number}`>;

type HumidifierCommand =
  | TurnOnOff
  | BuildControlCommand<"setMode", "auto" | "101" | "102" | "103" | number>;

type SmartFanCommand =
  | TurnOnOff
  | BuildControlCommand<
      "setAllStatus",
      `${"on" | "off"},${1 | 2},${1 | 2 | 3 | 4},${number}`
    >;

type PhysicalCommand =
  | BotCommand
  | PlugCommand
  | CurtainCommand
  | HumidifierCommand
  | SmartFanCommand;

type AirConditionerCommand =
  | TurnOnOff
  | BuildControlCommand<
      "setAll",
      `${number},${1 | 2 | 3 | 4 | 5},${1 | 2 | 3 | 4},${"on" | "off"}`
    >;

// TV means TV, IPTV/Streamer, and Set Top Box here.
type TvCommand =
  | TurnOnOff
  | BuildControlCommand<"SetChannel", number>
  | BuildControlCommand<`${"volume" | "channel"}${"Add" | "Sub"}`>;

type DvdCommand =
  | TurnOnOff
  | BuildControlCommand<
      | "setMute"
      | "FastForward"
      | "Rewind"
      | "Next"
      | "Previous"
      | "Pause"
      | "Play"
      | "Stop"
    >;

type SpeakerCommand =
  | DvdCommand
  | BuildControlCommand<"volumeAdd" | "volumeSub">;

type FanCommand =
  | TurnOnOff
  | BuildControlCommand<
      "swing" | "timer" | "lowSpeed" | "middleSpeed" | "highSpeed"
    >;

type LightCommand =
  | TurnOnOff
  | BuildControlCommand<"brightnessUp" | "brightnessDown">;

type InfraredCommand =
  | AirConditionerCommand
  | TvCommand
  | DvdCommand
  | SpeakerCommand
  | FanCommand
  | LightCommand;

export type DeviceCommand = PhysicalCommand | InfraredCommand;

export type CommandResponseBody = Record<string, never>;

interface ResponseSuccess<
  T extends DeviceList | DeviceStatus | CommandResponseBody
> {
  statusCode: 100;
  message: "success";
  body: T;
}

interface ResponseUnauthorized {
  message: "Unauthorized";
}

interface ResponseSystemError {
  statusCode: 190;
  message: "System error";
}

export type Response<
  T extends DeviceList | DeviceStatus | CommandResponseBody
> =
  | ResponseSuccess<T>
  | ResponseUnauthorized
  | ResponseSystemError
  | (T extends CommandResponseBody
      ?
          | { statusCode: 151 | 152 | 161 | 171; message: string; body: T }
          | { statusCode: 160; message: "No this command"; body: T }
      : never);
