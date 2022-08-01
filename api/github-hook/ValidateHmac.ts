import * as crypto from "crypto";
import { HttpRequest } from "@azure/functions";

const algo = "sha256";

export function isValidWebhook(sig: string, body: string, secret: string): boolean {
    const sigBuffer = Buffer.from(sig); 
    
    const hmac = crypto.createHmac(algo, secret);
    const rawHmacPrint = hmac.update(body).digest('hex');
    const expectedHmacValue = `${algo}=${rawHmacPrint}`;
    const digest = Buffer.from(expectedHmacValue);
  
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sigBuffer)) {
      return false;
    }

    return true;
}
