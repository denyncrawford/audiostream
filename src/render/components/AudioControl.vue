<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { toastOptions } from '@common/configs'
import { useSocketStore } from '@render/stores/socket'
import { useConfigStore } from '@render/stores/config'
import { useControlsStore } from '../stores/audio-controls'
import VolumeMeterVue from './VolumeMeter.vue'

const emit = defineEmits(['disconnectSocket'])

const recorder = ref<MediaRecorder>()
const stream = ref<MediaStream>()
const toast = useToast()
const store = useControlsStore()

const serverUrl = inject('serverUrl') as Ref<string>
const broadcastId = inject('broadcastId') as Ref<string>

const socketStore = useSocketStore()
const configStore = useConfigStore()
const volume = ref(0)

const timer = ref<number>(7199)
const timerInterval = ref()

const timeSecondsToHuman = computed(() => {
  const seconds = timer.value
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const secondsLeft = seconds % 60
  const minutesLeft = minutes % 60
  return `${hours < 10 ? '0' : ''}${hours}:${minutesLeft < 10 ? '0' : ''}${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`
})

const analyze = (stream: MediaStream) => {
  const context = new AudioContext()
  const analyser = context.createAnalyser()
  const source = context.createMediaStreamSource(stream)
  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
  const update = () => {
    analyser.getByteFrequencyData(dataArray)
    volume.value = Math.floor((Math.max(...dataArray) / 255) * 100)
    if (store.isStarted) { requestAnimationFrame(update) }
    else {
      context.close()
      volume.value = 0
    }
  }
  requestAnimationFrame(update)
}

const initMicrophoneStream = async () => {
  try {
    let isFirstTime = true
    stream.value = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: +configStore.audio.sampleRate,
        deviceId: configStore.audio.selectedDevice || undefined,
      },
    })
    recorder.value = new MediaRecorder(stream.value, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: +configStore.audio.bitRate || 128000,
    })
    recorder.value.addEventListener('dataavailable', async (e) => {
      if (isFirstTime) {
        socketStore.socket!.emit('header', e.data)
        isFirstTime = false
      }
      socketStore.socket!.emit('packet', e.data)
    })
    recorder.value.start(1000)
    store.isStarted = true
    store.isBroadcasting = true
    analyze(recorder.value.stream)
  }
  catch (error) {
    store.isStarted = false
    toast.error(error.message, toastOptions)
  }
}

const startRecording = async () => {
  if (timerInterval.value)
    clearInterval(timerInterval.value)
  timerInterval.value = setInterval(() => {
    timer.value++
  }, 1000)
  initMicrophoneStream()
}

const stopRecording = async () => {
  store.isStarted = false
  store.isBroadcasting = false
  recorder.value?.stop()
  stream.value?.getTracks().forEach(track => track.stop())
  clearInterval(timerInterval.value)
  timer.value = 0
  socketStore.socket!.emit('end')
}

const resumeRecording = async () => {
  store.isBroadcasting = true
  timerInterval.value = setInterval(() => {
    timer.value++
  }, 1000)
  recorder.value!.resume()
}

const pauseRecording = async () => {
  store.isBroadcasting = false
  clearInterval(timerInterval.value)
  recorder.value!.pause()
}

const disconnect = () => {
  if (store.isStarted)
    stopRecording()
  emit('disconnectSocket')
}

watch(() => store.disabledBroadcast, (disabled) => {
  if (!disabled)
    startRecording()
})

watch(() => socketStore.socket, (socket) => {
  if (!socket)
    stopRecording()
})
</script>

<template>
  <div>
    <h1 class="text-indigo-500">
      Audio controls
    </h1>
    <div class="bg-gray-200 p-5 rounded-lg mt-5 flex flex-col">
      <div class="grid grid-cols-5 gap-2 bg-white p-5 rounded-md">
        <button
          :disabled="store.isBroadcasting || !store.isStarted || store.disabledBroadcast" class="common-button col-span-2"
          @click="resumeRecording"
        >
          <Icon name="bi-play-fill" />
        </button>
        <button
          :disabled="!store.isBroadcasting || !store.isStarted || store.disabledBroadcast" class="common-button"
          @click="pauseRecording"
        >
          <Icon name="bi-pause-fill" />
        </button>
        <button :disabled="!store.isStarted || store.disabledBroadcast" class="common-button" @click="stopRecording">
          <Icon name="bi-stop-fill" />
        </button>
        <button
          :disabled="store.isStarted || store.disabledBroadcast" class="p-2 px-3 rounded-md bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="startRecording"
        >
          <Icon name="bi-record-circle" />
        </button>
      </div>
    </div>
    <div v-if="store.isStarted">
      <div class="flex mt-5 w-full justify-center">
        <div
          :class="[store.disabledBroadcast || !store.isBroadcasting ? 'bg-gray-600' : 'bg-red-500']"
          class="rounded-l-md text-white px-2 py-[1px] flex items-center justify-center font-bold text-sm"
        >
          LIVE
        </div>
        <div class="h-full bg-gray-200 rounded-r-md px-2 flex items-center">
          <p class="font-bold text-gray-600">
            {{ timeSecondsToHuman }}
          </p>
        </div>
      </div>
      <div class="flex w-full mt-5 justify-center">
        <div class="h-full px-2 flex items-center">
          <p class="font-bold h-full font-mono text-xs text-gray-400 hover:text-indigo-500 cursor-pointer">
            {{ serverUrl }}/{{ broadcastId }}
          </p>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <VolumeMeterVue class="mt-5" :value="volume" :show-peaks="true" />
      </div>
    </div>
    <button
      class="mt-5 transition hover:shadow-lg w-full
      bg-indigo-500 rounded-md text-white
      px-5 py-2" @click="disconnect"
    >
      Desconectar del
      servidor
    </button>
  </div>
</template>

<style lang="postcss">
.common-button {
  @apply p-2 px-3 rounded-md bg-indigo-500 text-white hover:shadow-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed;
}
</style>
