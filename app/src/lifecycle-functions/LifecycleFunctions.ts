import * as Ably from "ably";
import type { Types } from "ably";

export type ChannelNameAndOptions = { channelName: string; options?: Types.ChannelOptions; }
export type ChannelParameters =  string | ChannelNameAndOptions;

let sdkInstance = null;

export function provideSdkInstance(ablyInstance: Types.RealtimePromise) {
    sdkInstance = ablyInstance;
}

export function configureAbly(ablyConfigurationObject: string | Types.ClientOptions) {
  return sdkInstance || (sdkInstance = new Ably.Realtime.Promise(ablyConfigurationObject));
}

export function assertConfiguration(): Types.RealtimePromise {
  if (!sdkInstance) {
    throw new Error('Ably not configured - please call configureAbly({ key: "your-api-key", clientId: "someid" });');
  }

  return sdkInstance;
}
