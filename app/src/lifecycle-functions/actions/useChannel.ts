import { onMount } from "svelte";
import { assertConfiguration } from "../LifecycleFunctions";
import type { ChannelParameters } from "../LifecycleFunctions";
import type { Types } from "ably";

export type AblyMessageCallback = (message: Types.Message) => void;
export type ChannelAndClient = [channel: Types.RealtimeChannelCallbacks, message: Types.RealtimePromise];

export function useChannel(channelNameOrNameAndOptions: ChannelParameters, callbackOnMessage: AblyMessageCallback): ChannelAndClient;
export function useChannel(channelNameOrNameAndOptions: ChannelParameters, event: string, callbackOnMessage: AblyMessageCallback): ChannelAndClient;

export function useChannel(channelNameOrNameAndOptions: ChannelParameters, ...channelSubscriptionArguments: any[]): ChannelAndClient {
    const ably = assertConfiguration();

    const channelName = typeof channelNameOrNameAndOptions === 'string'
        ? channelNameOrNameAndOptions 
        : channelNameOrNameAndOptions.channelName;

    const channel = typeof channelNameOrNameAndOptions === 'string'
        ? ably.channels.get(channelName) 
        : ably.channels.get(channelName, channelNameOrNameAndOptions.options);

    const onMountAction = () => {
        channel.subscribe.apply(channel, channelSubscriptionArguments);
    };

    const onUnmountAction = () => {
        channel.unsubscribe.apply(channel, channelSubscriptionArguments);
        
        if (channel.state == "attached") {
            channel.detach();
        }
    };

    const useEffectHook = () => {
        onMountAction();
        return () => {
            onUnmountAction();
        };
    };

    onMount(useEffectHook);

    return [channel, ably];
}
