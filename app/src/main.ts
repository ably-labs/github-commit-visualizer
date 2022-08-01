import App from './App.svelte';
import { configureAbly } from "./lifecycle-functions/LifecycleFunctions";

configureAbly({ authUrl: "/api/ably-token-request?clientId=someid", clientId: "someid" });

var app = new App({
	target: document.body
});

export default app;
