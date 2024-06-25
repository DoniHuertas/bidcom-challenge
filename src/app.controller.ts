import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Put,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/all")
  getAll() {
    return this.appService.getAll();
  }

  @Get("/l/:maskedUrl")
  @Redirect()
  redirect(@Param("maskedUrl") maskedUrl: string) {
    const originalUrl = this.appService.redirectFromMasked(maskedUrl);
    return originalUrl;
  }

  @Get("/:id/stats")
  getTest(@Param("id") id: string) {
    return this.appService.getTest(id);
  }

  @Post("/create")
  maskUrl(@Body() requestBody: RequestUrlBody): MaskedUrlData {
    return this.appService.maskUrl(requestBody);
  }

  @Put("/l/:maskedUrl")
  invalidateLink(@Param("maskedUrl") maskedUrl: string) {
    return this.appService.invalidateUrl(maskedUrl);
  }
}
