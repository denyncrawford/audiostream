<script lang="ts" setup>
import { onMounted, provide, ref, watch } from 'vue'
import { DisconnectMessages, DisconnectReasons } from '@render/common.type'
import { useToast } from 'vue-toastification'
import io from 'socket.io-client'
import { toastOptions } from '@common/configs'
import { useSocketStore } from '../stores/socket'
import { useControlsStore } from '../stores/audio-controls'
import { useConfigStore, useConfigStoreController } from '../stores/config'
import ConnectHandlerVue from '../components/ConnectHandler.vue'
import AudioControlVue from '../components/AudioControl.vue'

const store = useSocketStore()
const controlsStore = useControlsStore()
const configStore = useConfigStore()
const serverUrl = ref('')
const broadcastId = ref('')

const showConnecHandler = ref(true)
const isShowingConnectHandler = ref(true)

const isLoading = ref(false)
const isLoadingTransitionDelay = ref(false)
const showAudioControls = ref(false)
const isShowingAudioControls = ref(false)

const toast = useToast()

const connectSocket = async () => {
  if (serverUrl.value) {
    store.socket = io(serverUrl.value, {
      query: {
        id: broadcastId.value,
      },
    })
    isLoading.value = true
    showConnecHandler.value = false
    const connectionTimeout = setTimeout(() => {
      store.socket!.close()
      store.socket = null
      isLoading.value = false
      showConnecHandler.value = true
      toast.error('No se pudo conectar con el servidor', toastOptions)
    }, 5000)
    store.socket.on('connect', async () => {
      controlsStore.disabledBroadcast = false
      isLoading.value = false
      showAudioControls.value = true
      clearTimeout(connectionTimeout)
      toast.success('Conectado con el servidor', toastOptions)
    })
    store.socket.on('close_reason', (reason: keyof typeof DisconnectReasons) => {
      if (reason in DisconnectReasons)
        toast.error(DisconnectMessages[reason], toastOptions)
    })
    store.socket.on('disconnect', async (reason) => {
      switch (reason) {
        case DisconnectReasons.SERVER_DISCONNECT:
          isLoading.value = false
          showConnecHandler.value = true
          showAudioControls.value = false
          toast.error(DisconnectMessages.SERVER_DISCONNECT, toastOptions)
          break
        case DisconnectReasons.CLIENT_DISCONNECT:
          isLoading.value = false
          showConnecHandler.value = true
          showAudioControls.value = false
          break
        case DisconnectReasons.TRANSPORT_ERROR:
        case DisconnectReasons.LOST_CONNECTION:
          isLoading.value = true
          controlsStore.disabledBroadcast = true
          toast.error(DisconnectMessages.LOST_CONNECTION, toastOptions)
          break
        default:
          toast.error(DisconnectMessages.LOST_CONNECTION, toastOptions)
          break
      }
    })
    return
  }
  toast.error('No se ha introducido la dirección del servidor', toastOptions)
}

const disconnectSocket = async () => {
  if (store.socket) {
    store.socket.close()
    store.socket = null
    controlsStore.disabledBroadcast = true
    showAudioControls.value = false
    showConnecHandler.value = true
    isLoading.value = false
    toast.success('Desconectado del servidor', toastOptions)
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

watch(isLoading, async (isLoading) => {
  if (isLoading) { isLoadingTransitionDelay.value = true }
  else {
    await delay(500)
    isLoadingTransitionDelay.value = false
  }
})
watch(showConnecHandler, async (isServerUrl) => {
  if (isServerUrl) { isShowingConnectHandler.value = true }
  else {
    await delay(500)
    isShowingConnectHandler.value = false
  }
})

watch(showAudioControls, async (isShowing) => {
  if (isShowing) { isShowingAudioControls.value = true }
  else {
    await delay(500)
    isShowingAudioControls.value = false
  }
})

provide('serverUrl', serverUrl)
provide('broadcastId', broadcastId)

onMounted(async () => {
  await configStore.setAvailableDevices()
})
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center text-center">
    <h1 class="text-3xl">
      Cliente de la transmisión
    </h1>
    <ConnectHandlerVue
      v-if="isShowingConnectHandler"
      :class="[showConnecHandler ? 'fade-enter-active' : 'fade-leave-active']" @connectSocket="connectSocket"
    />
    <div
      v-show="isLoadingTransitionDelay" :class="[isLoading ? 'fade-enter-active' : 'fade-leave-active']"
      class="mt-10"
    >
      <Icon class="text-indigo-500 animate-spin-slow w-8 h-8" name="ri-loader-2-fill" />
    </div>
    <div
      v-if="isShowingAudioControls" :class="[showAudioControls ? 'fade-enter-active' : 'fade-leave-active']"
      class="mt-10"
    >
      <AudioControlVue @disconnectSocket="disconnectSocket" />
    </div>
  </div>
</template>

<style>
.fade-enter-active {
  animation: fadeInUp;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s;
  /* don't forget to set a duration! */
}

.fade-leave-active {
  animation: fadeOutDown;
  animation-duration: 1s;
}
</style>
