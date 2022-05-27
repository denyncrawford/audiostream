import { defineStore } from "pinia";
import { IConfigState } from "../common.type";

export const useConfigStore = defineStore("config", {
  state: (): IConfigState => {
    const configObj: IConfigState = {
      serverHistory: [],
      broadcastIdHistory: [],
      lastBroadcastId: null,
      lastServer: null,
      availableDevices: [],
      selectedDevice: '',
    };
    const config = localStorage.getItem("config");
    if (config) {
      Object.assign(configObj, JSON.parse(config));
    }
    return configObj;
  },
  actions: {
    persistData() {
      localStorage.setItem("config", JSON.stringify(this.$state));
    },
    async setAvaliableDevices() {
      this.availableDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (device) => device.kind === "audioinput"
      );
    }
  },
});
