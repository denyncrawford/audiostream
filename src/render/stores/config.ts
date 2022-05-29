import { defineStore } from 'pinia'
import type { IConfigState } from '../common.type'

export const useConfigStore = defineStore('config', {
  state: (): IConfigState => {
    const configObj: IConfigState = {
      serverHistory: [],
      broadcastIdHistory: [],
      lastBroadcastId: null,
      lastServer: null,
      availableDevices: [],
      audio: {
        bitRate: '128',
        sampleRate: '44100',
        selectedDevice: '',
      },
      metadata: {
        enabled: false,
        filename: '',
      },
      streamData: {
        name: 'My Radio Name',
        description: 'Cool radio',
        title: 'Radio Stream Title',
        genre: 'Various',
      },
    }
    const config = localStorage.getItem('config')
    if (config)
      Object.assign(configObj, JSON.parse(config))

    return configObj
  },
  actions: {
    persistData() {
      localStorage.setItem('config', JSON.stringify(this.$state))
    },
    async setAvailableDevices() {
      this.availableDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
        device => device.kind === 'audioinput',
      )
    },
  },
})

export const useConfigStoreController = defineStore('configController', {
  state() {
    return {
      isConfigOpen: false,
    }
  },
})
