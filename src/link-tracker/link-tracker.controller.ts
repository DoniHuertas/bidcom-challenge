import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  Redirect,
  Query,
} from "@nestjs/common";
import { LinkTrackerService } from "./link-tracker.service";
import { RequestUrlBodyDto } from "./dto/requestUrl.dto";

@Controller("/")
export class LinkTrackerController {
  constructor(private readonly linkTrackerService: LinkTrackerService) {}

  @Post("create")
  async createLink(@Body() requestUrlBodyDto: RequestUrlBodyDto) {
    try {
      return await this.linkTrackerService.createMaskedLink(requestUrlBodyDto);
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/l/:maskedUrl")
  @Redirect()
  async redirect(
    @Param("maskedUrl") maskedUrl: string,
    @Query("password") password: string
  ) {
    try {
      return await this.linkTrackerService.redirect(maskedUrl, password);
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.NOT_FOUND);
    }
  }

  @Put("/l/:maskedUrl")
  async invalidateLink(@Param("maskedUrl") maskedUrl: string) {
    try {
      await this.linkTrackerService.invalidateLink(maskedUrl);
      return "Link Invalidado";
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":maskedUrl/stats")
  async getStats(@Param("maskedUrl") maskedUrl: string) {
    try {
      return await this.linkTrackerService.getStats(maskedUrl);
    } catch (e) {
      throw new HttpException(
        e.message,
        e.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Endpoints para traer y también para borrar todos los links
   *
   */
  @Get()
  async getAllLinks() {
    return await this.linkTrackerService.getAllLinks();
  }

  @Delete()
  async resetDB() {
    await this.linkTrackerService.deleteAllLinks();
    return "Se borraron todos los links.";
  }
}
