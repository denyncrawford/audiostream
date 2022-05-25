import { defineStore } from "pinia";

export const useControlsStore = defineStore("controls", {
  state: () => ({
    isStarted: false,
    isBroadcasting: false,
    disabledBroadcast: false,
  }),
});
