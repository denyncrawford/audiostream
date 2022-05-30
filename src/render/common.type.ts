export enum DisconnectReasons {
  LOST_CONNECTION = 'transport close',
  TRANSPORT_ERROR = 'transport error',
  SERVER_DISCONNECT = 'io server disconnect',
  CLIENT_DISCONNECT = 'io client disconnect',
  ROOM_ALREADY_EXISTS = 'ROOM_ALREADY_EXISTS',
  NO_ROOM_ID = 'NO_ROOM_ID',
  CANOT_CONNECT_TO_SERVER = 'CANOT_CONNECT_TO_SERVER',
}

export enum DisconnectMessages {
  LOST_CONNECTION = 'Se perdió la conexión con el servidor, reconectando...',
  SERVER_DISCONNECT = 'El servidor ha cerrado la conexión intencionalmente',
  CLIENT_DISCONNECT = 'Se perdió la conexión con el servidor, reconectando...',
  ROOM_ALREADY_EXISTS = 'Este nombre de transmisión ya está en uso',
  NO_ROOM_ID = 'Por favor, especifica un nombre de transmisión',
}

export interface IConfigState {
  serverHistory: string[]
  broadcastIdHistory: string[]
  lastBroadcastId: string | null
  lastServer: string | null
  availableDevices: MediaDeviceInfo[]
  audio: {
    bitRate: string
    sampleRate: string
    selectedDevice: MediaDeviceInfo['deviceId']
  }
  metadata: {
    enabled: boolean
    filename: string
  }
  streamData: {
    name: string
    description: string
    title: string
    genre: string

  }
}

export interface IFilter {
  label: string
  value: string
  show?: boolean
}
