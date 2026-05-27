import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getMenus() {
    return [
      {
        id: "main",
        name: "主系统",
        icon: "🏠",
        menus: [{ title: "控制台", path: "/", icon: "📈" }]
      },
      {
        id: "sub",
        name: "业务系统",
        icon: "📊",
        menus: [
          { title: "用户管理", path: "/sub-system/users", icon: "👥" },
          { title: "订单管理", path: "/sub-system/orders", icon: "📦" },
          { title: "仪表盘", path: "/sub-system/", icon: "📊" }
        ]
      },
      {
        id: "pure",
        name: "外部工具",
        icon: "📄",
        menus: [{ title: "纯 HTML 页面", path: "/pure-html/", icon: "📄" }]
      }
    ];
  }
}
