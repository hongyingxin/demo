import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getMenus() {
    return [
      {
        title: "控制台",
        icon: "Monitor",
        path: "/",
        app: "main"
      },
      {
        title: "业务管理",
        icon: "Briefcase",
        children: [
          {
            title: "用户管理",
            path: "/sub-system/users",
            icon: "User",
            app: "sub-admin"
          },
          {
            title: "订单管理",
            path: "/sub-system/orders",
            icon: "ShoppingCart",
            app: "sub-admin"
          }
        ]
      },
      {
        title: "混合示例",
        icon: "Menu",
        children: [
          {
            title: "子应用仪表盘",
            path: "/sub-system/",
            icon: "Odometer",
            app: "sub-admin"
          },
          {
            title: "纯 HTML 工具",
            path: "/pure-html/",
            icon: "Document",
            app: "pure-html-app"
          }
        ]
      }
    ];
  }
}
