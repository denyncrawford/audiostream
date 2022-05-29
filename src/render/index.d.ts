import type { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron'

declare global {
  interface Window {
    castLabs: {
      openDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>
      ipcRenderer: IpcRenderer
    }
  }
}

export { }
