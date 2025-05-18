import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/reset.less";
import "@/assets/iconfont/iconfont.less";
import "@/assets/fonts-input/font.less";
import "@/styles/common.less";
import ReactApp from "./App";
// import '../../../test/dist/myMonitor.js'
import { createSDK } from "@monito-project/monito-sdk/src"

createSDK({
  dbName: 'monito_admin',
  maxCount: 5,
  reportInterval: 15000,
  enableHardwareMonitor: true,
  hardwareMonitorInterval: 5000
})

console.log("env环境:\n", import.meta.env);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ReactApp />,
  // </React.StrictMode>
);
