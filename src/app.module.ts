import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LinkTrackerModule } from "./link-tracker/link-tracker.module";
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), LinkTrackerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
