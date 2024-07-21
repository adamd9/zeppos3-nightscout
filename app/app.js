import { BaseApp } from "@zeppos/zml/base-app";

App(
  BaseApp({
    globalData: {
    },
    onCreate() {
      console.log("app on create invoke");
    },

    onDestroy() {
      console.log("app on destroy invoke");
    },
  })
);
