import { Injectable, NotFoundException } from "@nestjs/common";
import { encrypt } from "./encryptation/encryptation";
import { urls } from "./db/urls";
import { MaskedUrlData, RequestUrlBody } from "./dto/requestUrl.dto";
const port = process.env.PORT || 8080;
@Injectable()
export class AppService {
  redirectFromMasked(maskedUrl: string, password: string) {
    const dataEntry = urls.find(
      (url) => url.link === `http://localhost:${port}/l/${maskedUrl}`
    );
    if (!dataEntry || dataEntry.valid === false) {
      throw new NotFoundException("Link inexistente o no válido");
    } else if (password !== dataEntry.password) {
      throw new NotFoundException("Contraseña incorrecta");
    } else if (dataEntry.expiresAt && dataEntry.expiresAt < new Date()) {
      dataEntry.valid = false;
      throw new NotFoundException("CLink inexistente o no válido");
    } else {
      dataEntry.redirections++;
    }

    return { url: dataEntry.target };
  }

  maskUrl(requestBody: RequestUrlBody): MaskedUrlData {
    const maskedUrl = encrypt(requestBody.url);
    const dataEntry: MaskedUrlData = {
      target: requestBody.url,
      link: `http://localhost:${port}/l/${maskedUrl}`,
      valid: true,
      redirections: 0,
      password: requestBody.password,
    };
    if (requestBody.expiresIn) {
      const creationDate = new Date();
      const expiration = new Date(
        creationDate.getTime() + Number(requestBody.expiresIn) * 60000
      );

      dataEntry.expiresAt = expiration;
    }
    console.log(dataEntry);
    urls.push(dataEntry);
    return dataEntry;
  }

  invalidateUrl(maskedUrl: string): string {
    const dataEntry = urls.find(
      (url) => url.link === `http://localhost:${port}/l/${maskedUrl}`
    );
    if (!dataEntry || dataEntry.valid === false) {
      throw new NotFoundException("Link inexistente o no válido");
    } else {
      dataEntry.valid = false;
    }
    return "invalidated";
  }

  getStats(maskedUrl: string): number {
    const dataEntry = urls.find(
      (url) => url.link === `http://localhost:${port}/l/${maskedUrl}`
    );
    if (!dataEntry || dataEntry.valid === false) {
      throw new NotFoundException("Link inexistente o no válido");
    } else {
      return dataEntry.redirections;
    }
  }

  getAll(): MaskedUrlData[] {
    return urls;
  }
}
