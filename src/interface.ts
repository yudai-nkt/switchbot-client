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

interface DeviceGeneric {
  deviceId: string;
  deviceName: string;
  deviceType: Exclude<DeviceType, "Curtain">;
  enableCloudService: boolean;
  hubDeviceId: string;
}

interface Curtain extends Omit<DeviceGeneric, "deviceType"> {
  deviceType: "Curtain";
  curtainDevicesIds: Array<Device["deviceId"]>;
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
  deviceId: Device["deviceId"];
  deviceType: Exclude<
    DeviceType,
    "Bot" | "Plug" | "Humidifier" | "Meter" | "Curtain" | "Smart Fan"
  >;
  hubDeviceId: Device["deviceId"];
}

interface BotOrPlugStatus extends Omit<DeviceStatusGeneric, "deviceType"> {
  deviceType: "Bot" | "Plug";
  power: string;
}

interface HumidifierStatus extends Omit<DeviceStatusGeneric, "deviceType"> {
  deviceType: "Humidifier";
  power: string;
  humidity: number;
  temperature: number;
  nebulizationEfficiency: number;
  auto: boolean;
  childLock: boolean;
  sound: boolean;
}

interface MeterStatus extends Omit<DeviceStatusGeneric, "deviceType"> {
  deviceType: "Meter";
  humidity: number;
  temperature: number;
}

interface CurtainStatus extends Omit<DeviceStatusGeneric, "deviceType"> {
  deviceType: "Curtain";
  calibrate: boolean;
  group: boolean;
  moving: boolean;
  slidePosition: number;
}

interface SmartFanStatus extends Omit<DeviceStatusGeneric, "deviceType"> {
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

interface ResponseSuccess<T> {
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

export type Response<T> =
  | ResponseSuccess<T>
  | ResponseUnauthorized
  | ResponseSystemError;
