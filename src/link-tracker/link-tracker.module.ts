import { Module } from "@nestjs/common";
import { LinkTrackerService } from "./link-tracker.service";
import { LinkTrackerController } from "./link-tracker.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MaskedUrlSchema } from "./schema/maskedUrl.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Url",
        schema: MaskedUrlSchema,
      },
    ]),
  ],
  controllers: [LinkTrackerController],
  providers: [LinkTrackerService],
})
export class LinkTrackerModule {}
