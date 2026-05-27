import { Controller, Get, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("login")
  login(@Body() body: any) {
    return {
      uid: "9527",
      ticket: "TICKET_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      username: body.username || "admin",
    };
  }

  @Get("menus")
  getMenus() {
    return this.appService.getMenus();
  }
}
