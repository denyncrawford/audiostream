import { defineStore } from 'pinia'
import { Socket } from 'socket.io-client'
import { Socket as SocketStream } from '@dpxmaximus/socket-stream'

interface ISocketState {
  socket: null | Socket
  socketStream: null | SocketStream
}

export const useSocketStore = defineStore('socket', {
  state: (): ISocketState => {
    return {
      socket: null,
      socketStream: null,
    }
  },
  actions: {
    emit: (event: string, data?: Blob) => (state: ISocketState) => {
      if (state.socket) {
        state.socket.emit(event, data)
      }
    },
  }
});

