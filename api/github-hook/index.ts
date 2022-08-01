import * as dotenv from "dotenv";
import * as Ably from "ably/promises";
import { isValidWebhook } from "./ValidateHmac";
import { Context, HttpRequest } from "@azure/functions";
import { HandlerEvent, HandlerContext } from "@netlify/functions";

dotenv.config();
const sigHeaderName = "X-Hub-Signature-256";

export async function run(context: Context, req: HttpRequest): Promise<void> {
  const sig = req.headers[sigHeaderName.toLowerCase()] || '';
  const { responseCode, responseMessage } = await execute(sig, req.rawBody);

  context.res = {
    status: responseCode,
    headers: { "content-type": "application/json" },
    body: `{ text: \"${responseMessage}\" }`
  };
}

// Netlify
export async function handler(event: HandlerEvent, context: HandlerContext) {
  const sig = event.headers[sigHeaderName.toLowerCase()] || '';
  const { responseCode, responseMessage } = await execute(sig, event.body);
  return { 
    statusCode: responseCode,    
    headers: { "content-type": "application/json" },
    body: responseMessage 
  };
}

async function execute(sig: string, body: string) {  
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  const isValid = isValidWebhook(sig, body, secret);
  const responseCode = isValid ? 200 : 401;
  const responseMessage = isValid ? "{ status: \"OK\" }" : "{ status: \"Request body digest did not match.\" }";

  if (isValid) {
    const client = new Ably.Rest(process.env.ABLY_API_KEY);
    const channel = client.channels.get("github-events");
    const asObject = JSON.parse(body);
    await channel.publish("push", asObject);
  }

  return {
    responseCode, 
    responseMessage
  }
}
