import 'reflect-metadata'
import { OpenDialogOptions, app, dialog, ipcMain } from 'electron'
import { createWindow, restoreOrCreateWindow } from './mainWindow'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('activate', async () => {
  try {
    await restoreOrCreateWindow()
  }
  catch (error) {
    app.quit()
  }
})

app.on('ready', async () => {
  try {
    await createWindow()
    ipcMain.handle('openDialog', async (_event, options: OpenDialogOptions) => {
      return await dialog.showOpenDialog(options)
    })
  }
  catch (error) {
    app.quit()
  }
})

if (!app.isPackaged) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit')
        app.quit()
    })
  }
  else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
