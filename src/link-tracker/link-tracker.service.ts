import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateMaskedUrlDto } from "./dto/createMaskedUrl.dto";
import { RequestUrlBodyDto } from "./dto/requestUrl.dto";
import { InjectModel } from "@nestjs/mongoose";
import { MaskedUrl } from "./schema/maskedUrl.schema";
import { Model } from "mongoose";
import {
  createLink,
  encrypt,
  hashPassword,
  verifyHashedPassword,
} from "src/encryptation/encryptation";

@Injectable()
export class LinkTrackerService {
  constructor(
    @InjectModel("Url") private linkTrackerModule: Model<MaskedUrl>
  ) {}

  async createMaskedLink(
    requestUrlBody: RequestUrlBodyDto
  ): Promise<CreateMaskedUrlDto> {
    const maskedUrl = encrypt(requestUrlBody.url);
    const dataEntry: CreateMaskedUrlDto = {
      target: requestUrlBody.url,
      link: createLink(maskedUrl),
      valid: true,
      redirections: 0,
      password: hashPassword(requestUrlBody.password),
    };

    if (requestUrlBody.expiresIn) {
      const creationDate = new Date();
      const expiration = new Date(
        creationDate.getTime() + Number(requestUrlBody.expiresIn) * 60000
      );
      dataEntry.expiresAt = expiration;
    }

    try {
      await this.linkTrackerModule.create(dataEntry);
      return dataEntry;
    } catch (e) {
      throw new HttpException("Error al crear link", HttpStatus.BAD_REQUEST);
    }
  }

  async redirect(maskedUrl: string, password: string) {
    try {
      const link = await this.linkTrackerModule.findOne({
        link: createLink(maskedUrl),
      });

      if (!link || !link.valid) {
        throw new NotFoundException("Link inexistente o inválido");
      }

      if (!verifyHashedPassword(password, link.password)) {
        throw new HttpException(
          "Contraseña Incorrecta",
          HttpStatus.UNAUTHORIZED
        );
      }

      if (link.expiresAt < new Date()) {
        link.valid = false;
        await link.save();
        throw new NotFoundException("Link inexistente o inválido");
      }
      link.redirections = link.redirections + 1;
      await link.save();
      return { url: link.target };
    } catch (e) {
      throw new HttpException(e.response.message, e.status || 500);
    }
  }

  async invalidateLink(maskedUrl: string) {
    try {
      const link = await this.linkTrackerModule.findOne({
        link: createLink(maskedUrl),
      });

      if (link) {
        link.valid = false;
        await link.save();
      } else {
        throw new NotFoundException("Link inexistente");
      }
    } catch (e) {
      throw new HttpException(
        e.resoponse.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStats(maskedUrl: string): Promise<number> {
    try {
      const link = await this.linkTrackerModule.findOne({
        link: createLink(maskedUrl),
      });

      if (!link) {
        throw new NotFoundException("Link inexistente o inválido");
      }

      return link.redirections;
    } catch (e) {
      throw new HttpException(
        e.resoponse.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllLinks() {
    try {
      return await this.linkTrackerModule.find({});
    } catch (e) {
      throw new HttpException(
        e.resoponse.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAllLinks() {
    try {
      await this.linkTrackerModule.deleteMany({});
    } catch (e) {
      throw new HttpException(
        e.resoponse.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
