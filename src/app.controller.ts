import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { MaskedUrlData, RequestUrlBody } from "./dto/requestUrl.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/all")
  getAll() {
    return this.appService.getAll();
  }

  @Get("/l/:maskedUrl")
  @Redirect()
  redirect(
    @Param("maskedUrl") maskedUrl: string,
    @Query("password") password: string
  ) {
    return this.appService.redirectFromMasked(maskedUrl, password);
  }

  @Get("/:maskedUrl/stats")
  getStats(@Param("maskedUrl") maskedUrl: string) {
    return this.appService.getStats(maskedUrl);
  }

  @Post("/create")
  @UsePipes(new ValidationPipe())
  maskUrl(@Body() requestBody: RequestUrlBody): MaskedUrlData {
    return this.appService.maskUrl(requestBody);
  }

  @Put("/l/:maskedUrl")
  invalidateLink(@Param("maskedUrl") maskedUrl: string) {
    return this.appService.invalidateUrl(maskedUrl);
  }
}
