<script lang="ts" setup>
import { ref, provide, watch } from 'vue';
import { useSocketStore } from '../stores/socket';
import { useToast } from "vue-toastification";
import ConnectHandlerVue from '../components/ConnectHandler.vue';
import AudioControlVue from '../components/AudioControl.vue';
import io from 'socket.io-client';
import { toastOptions } from '@common/configs'

const store = useSocketStore();
const serverUrl = ref('');
const showConnecHandler = ref(true);
const isShowingConnectHandler = ref(true);

const isLoading = ref(false);
const isLoadingTransitionDelay = ref(false);
const showAudioControls = ref(false);
const isShowingAudioControls = ref(false);

const toast = useToast();

const connectSocket = async () => {
  if (serverUrl.value) {
    store.socket = io(serverUrl.value);
    isLoading.value = true;
    showConnecHandler.value = false;
    const connectionTimeout = setTimeout(() => {
      store.socket.close();
      store.socket = null;
      isLoading.value = false;
      showConnecHandler.value = true;
      toast.error("No se pudo conectar con el servidor", toastOptions);
    }, 5000);
    store.socket.on('connect', async () => {
      isLoading.value = false;
      showAudioControls.value = true;
      clearTimeout(connectionTimeout);
      toast.success("Conectado con el servidor", toastOptions);
    });
    return;
  }
  toast.error("No se ha introducido la dirección del servidor", toastOptions);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

watch(isLoading, async (isLoading) => {
  if (isLoading) { isLoadingTransitionDelay.value = true; }
  else {
    await delay(500);
    isLoadingTransitionDelay.value = false;
  }
});
watch(showConnecHandler, async (isServerUrl) => {
  if (isServerUrl) { isShowingConnectHandler.value = true; }
  else {
    await delay(500);
    isShowingConnectHandler.value = false;
  }
});

watch(showAudioControls, async (isShowing) => {
  if (isShowing) { isShowingAudioControls.value = true; }
  else {
    await delay(500);
    isShowingAudioControls.value = false;
  }
});

watch(store.socket, async (socket) => {
  if (socket) {
    
  }
});

provide('serverUrl', serverUrl);

</script>
<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center text-center">
    <h1 class="text-3xl">
      Cliente de la transmisión
    </h1>
    <ConnectHandlerVue v-show="isShowingConnectHandler"
      :class="[showConnecHandler ? 'fade-enter-active' : 'fade-leave-active']" @connectSocket="connectSocket" />
    <div v-show="isLoadingTransitionDelay" :class="[isLoading ? 'fade-enter-active' : 'fade-leave-active']"
      class="mt-10">
      <Icon class="text-indigo-500 animate-spin-slow w-8 h-8" name="ri-loader-2-fill" />
    </div>
    <div v-show="isShowingAudioControls" :class="[showAudioControls ? 'fade-enter-active' : 'fade-leave-active']"
      class="mt-10">
      <AudioControlVue />
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