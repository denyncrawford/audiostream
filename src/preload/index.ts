import type { OpenDialogOptions } from 'electron'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('castLabs', {
  openDialog: (options: OpenDialogOptions) => {
    return ipcRenderer.invoke('openDialog', options)
  },
  ipcRenderer: {
    invoke: ipcRenderer.invoke.bind(ipcRenderer),
    on: ipcRenderer.on.bind(ipcRenderer),
    removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer),
  },
})
