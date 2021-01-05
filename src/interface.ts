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

type TurnOnOff = {
  command: "turnOn" | "turnOff";
  parameter?: "default";
  commandType?: "command";
};

type BotCommand =
  | TurnOnOff
  | { command: "press"; parameter?: "default"; commandType?: "command" };

type PlugCommand = TurnOnOff;

type CurtainCommand =
  | TurnOnOff
  | {
      command: "setPosition";
      parameter?: `${number},${0 | 1 | "ff"},${number}`;
      commandType?: "command";
    };

type HumidifierCommand =
  | TurnOnOff
  | {
      command: "setMode";
      parameter?: "auto" | "101" | "102" | "103" | number;
      commandType?: "command";
    };

type SmartFanCommand =
  | TurnOnOff
  | {
      command: "setAllStatus";
      parameter?: `${"on" | "off"},${1 | 2},${1 | 2 | 3 | 4},${number}`;
      commandType?: "command";
    };

type PhysicalCommand =
  | BotCommand
  | PlugCommand
  | CurtainCommand
  | HumidifierCommand
  | SmartFanCommand;

type AirConditionerCommand =
  | TurnOnOff
  | {
      command: "setAll";
      parameter?: `${number},${1 | 2 | 3 | 4 | 5},${1 | 2 | 3 | 4},${
        | "on"
        | "off"}`;
      commandType?: "command";
    };

// TV means TV, IPTV/Streamer, and Set Top Box here.
type TvCommand =
  | TurnOnOff
  | {
      command: "SetChannel";
      parameter?: number;
      commandType?: "command";
    }
  | {
      command: `${"volume" | "channel"}${"Add" | "Sub"}`;
      parameter?: "default";
      commandType?: "command";
    };

type DvdCommand =
  | TurnOnOff
  | {
      command:
        | "setMute"
        | "FastForward"
        | "Rewind"
        | "Next"
        | "Previous"
        | "Pause"
        | "Play"
        | "Stop";
      parameter?: "default";
      commandType?: "command";
    };

type SpeakerCommand =
  | DvdCommand
  | {
      command: "volumeAdd" | "volumeSub";
      parameter?: "default";
      commandType?: "command";
    };

type FanCommand =
  | TurnOnOff
  | {
      command: "swing" | "timer" | "lowSpeed" | "middleSpeed" | "highSpeed";
      parameter?: "default";
      commandType?: "command";
    };

type LightCommand =
  | TurnOnOff
  | {
      command: "brightnessUp" | "brightnessDown";
      parameter: "default";
      commandType: "command";
    };

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
