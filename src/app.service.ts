import { HttpCode, Injectable } from "@nestjs/common";
import { decrypt, encrypt } from "./encryptation/encryptation";
import { urls } from "./db/urls";

@Injectable()
export class AppService {
  getTest(id: string) {
    const dataEntryIndex = urls.find((url) => (url.target = id));
    return urls[dataEntryIndex];
  }

  redirectFromMasked(maskedUrl: string) {
    const decrypted = decrypt(maskedUrl);
    return { url: decrypted };
  }

  maskUrl(requestBody: RequestUrlBody): MaskedUrlData {
    const maskedUrl = encrypt(requestBody.url);
    const dataEntry: MaskedUrlData = {
      target: requestBody.url,
      link: maskedUrl,
      valid: true,
    };
    urls.push(dataEntry);
    return dataEntry;
  }

  invalidateUrl(maskedUrl: string): string {
    const dataEntryIndex = urls.find((url) => (url.link = maskedUrl));
    dataEntryIndex.valid = false;
    return "invalidated";
  }

  getAll() {
    return urls;
  }
}
