<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { toastOptions } from '@common/configs'
import { useControlsStore } from '../stores/audio-controls';
import { useSocketStore } from '@render/stores/socket';

const emit = defineEmits(['disconnectSocket']);

const recorder = ref<MediaRecorder>()
const stream = ref<MediaStream>()
const toast = useToast()
const store = useControlsStore();
const socketStore = useSocketStore();

const initMicrophoneStream = async () => {
  try {
    let isFirstTime = true;
    stream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.value = new MediaRecorder(stream.value, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000,
    });
    recorder.value.addEventListener('dataavailable', async (e) => {
      if (isFirstTime) {
        socketStore.socket!.emit('header', e.data);
        isFirstTime = false;
      }
      socketStore.socket!.emit('packet', e.data);
    });
    recorder.value.start(1000);
    store.isStarted = true;
    store.isBroadcasting = true;
  } catch (error) {
    store.isStarted = false;
    toast.error(error.message, toastOptions);
  }
};

const startRecording = async () => {
  initMicrophoneStream();
};

const stopRecording = async () => {
  store.isStarted = false;
  store.isBroadcasting = false;
  recorder.value?.stop();
  stream.value?.getTracks().forEach(track => track.stop());
  socketStore.socket!.emit('end');
};

const resumeRecording = async () => {
  store.isBroadcasting = true;
  recorder.value!.resume()
};

const pauseRecording = async () => {
  store.isBroadcasting = false;
  recorder.value!.pause();
};

const disconnect = () => {
  if ( store.isStarted ) stopRecording();
  emit('disconnectSocket')
}

watch(() => store.disabledBroadcast, (disabled) => {
  if (!disabled) startRecording();
});

watch(() => socketStore.socket, (socket) => {
  if (!socket)
    stopRecording();
})

</script>

<template>
  <div>
    <h1 class="text-indigo-500">
      Audio controls
    </h1>
    <div class="bg-gray-200 p-5 rounded-lg mt-5 flex flex-col">
      <div class="grid grid-cols-5 gap-2 bg-white p-5 rounded-md">
        <button @click="resumeRecording" :disabled="store.isBroadcasting || !store.isStarted || store.disabledBroadcast"
          class="common-button col-span-2">
          <Icon name="bi-play-fill" />
        </button>
        <button @click="pauseRecording" :disabled="!store.isBroadcasting || !store.isStarted || store.disabledBroadcast" class="common-button">
          <Icon name="bi-pause-fill" />
        </button>
        <button @click="stopRecording" :disabled="!store.isStarted || store.disabledBroadcast" class="common-button">
          <Icon name="bi-stop-fill" />
        </button>
        <button @click="startRecording" :disabled="store.isStarted || store.disabledBroadcast"
          class="p-2 px-3 rounded-md bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Icon name="bi-record-circle" />
        </button>
      </div>
    </div>
    <button class="mt-5 transition hover:shadow-lg w-full 
      bg-indigo-500 rounded-md text-white
      px-5 py-2" @click="disconnect">Desconectar del
      servidor</button>
  </div>
</template>

<style>
.common-button {
  @apply p-2 px-3 rounded-md bg-indigo-500 text-white hover:shadow-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed;
}
</style>