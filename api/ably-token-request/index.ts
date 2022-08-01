import * as dotenv from "dotenv";
import * as Ably from "ably/promises";
import { Context, HttpRequest } from "@azure/functions";
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

dotenv.config();

export async function run(context: Context, req: HttpRequest): Promise<void> {
    const { statusCode, responseMessage } = await execute(req.query.clientId);
    context.res = {
      status: statusCode,
      headers: { "content-type": "application/json" },
      body: responseMessage
    };
}

// Netlify
export async function handler(event: HandlerEvent, context: HandlerContext) {
  const { statusCode, responseMessage } = await execute(event.queryStringParameters["clientId"]);
  return { 
    statusCode: statusCode,
    headers: { "content-type": "application/json" },
    body: responseMessage
  };
  
}

async function execute(clientIdFromQuery: string) {  
  if(!process.env.ABLY_API_KEY) {
    return {
      statusCode: 500, 
      responseMessage: `Missing ABLY_API_KEY environment variable.
      If you're running locally, please ensure you have a ./api/.env file with a value for ABLY_API_KEY=your-key.
      If you're running in Azure, make sure you've configured the AppSettings ABLY_API_KEY. 
      Please see README.md for more details on configuring your Ably API Key.`
    }
  }

  const clientId = clientIdFromQuery || process.env.DEFAULT_CLIENT_ID || "NO_CLIENT_ID";
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: clientId});

  return {
    statusCode: 200, 
    responseMessage: JSON.stringify(tokenRequestData)
  }
}
