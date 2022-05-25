
import { defineStore } from "pinia";
import { IConfigState } from "../common.type";

export const useConfigStore = defineStore("config", {
  state: (): IConfigState => {
    const config = localStorage.getItem("config");
    console.log(config)
    if (config) {
      return JSON.parse(config) as IConfigState;
    }
    return {
      serverHistory: [],
      broadcastIdHistory: [],
      lastBroadcastId: null,
      lastServer: null,
    };
  },
  actions: {
    persistData(){
      localStorage.setItem("config", JSON.stringify(this.$state));
    }
  }
});