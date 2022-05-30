<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { toastOptions } from '@common/configs'
import type { IFilter } from '@render/common.type'
import type { OpenDialogOptions } from 'electron'
import { Switch, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { useConfigStore, useConfigStoreController } from '@render/stores/config'
import { useControlsStore } from '@render/stores/audio-controls'
import DialogVue from './Dialog.vue'
import SelectVue from './Select.vue'

const store = useConfigStore()
const controller = useConfigStoreController()
const audioControlsStore = useControlsStore()
const toast = useToast()

const supportedBitRates: IFilter[] = [
  {
    label: '24 kbps',
    value: '24000',
  },
  {
    label: '28 kbps',
    value: '28000',
  },
  {
    label: '32 kbps',
    value: '32000',
  },
  {
    label: '64 kbps',
    value: '64000',
  },
  {
    label: '96 kbps',
    value: '96000',
  },
  {
    label: '128 kbps',
    value: '128000',
  },
]

const supportedSampleRates: IFilter[] = [
  {
    label: '32 kHz',
    value: '32000',
  },
  {
    label: '44.1 kHz',
    value: '44100',
  },
  {
    label: '48 kHz',
    value: '48000',
  },
]

const availableDevices = computed(() => store.availableDevices.map(device => ({
  value: device.deviceId,
  label: device.label,
})))

const defaultState = {
  audio: {
    bitRate: '320000',
    sampleRate: '44100',
    selectedDevice: 'default',
  },
  metadata: {
    enabled: false,
    filename: '',
  },
  streamData: {
    name: '',
    description: '',
    title: '',
    genre: '',
  },
}

const state = reactive({ ...defaultState })

const save = () => {
  Object.assign(store.audio, state.audio)
  Object.assign(store.metadata, state.metadata)
  Object.assign(store.streamData, state.streamData)
  store.persistData()
  controller.isConfigOpen = false
  toast.success('Datos guardados exitosamente', toastOptions)
}

const cancel = () => {
  Object.assign(state, { ...defaultState })
  state.audio = { ...store.audio }
  state.metadata = { ...store.metadata }
  state.streamData = { ...store.streamData }
  controller.isConfigOpen = false
}

const dialogOptions: OpenDialogOptions = {
  title: 'Arbir archivo nowOnAir',
  filters: [
    { name: 'Text files', extensions: ['txt'] },
  ],
}

const openFileDialog = async () => {
  const { filePaths, canceled } = await window.castLabs.openDialog(dialogOptions)
  if (!canceled)
    state.metadata.filename = filePaths[0]
}

onMounted(() => {
  state.audio = { ...store.audio }
  state.metadata = { ...store.metadata }
  state.streamData = { ...store.streamData }
})
</script>

<template>
  <div class="relative">
    <DialogVue :is-open="controller.isConfigOpen" @close="cancel">
      <template #title>
        Configuración de la app
      </template>
      <TabGroup>
        <TabList class="mt-5 mb-5 flex">
          <Tab v-slot="{ selected }" as="template">
            <div
              :class="[selected ? 'bg-gray-200 text-indigo-500' : 'bg-white text-gray-600']"
              class="settings-header-button"
            >
              Audio
            </div>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <div
              :class="[selected ? 'bg-gray-200 text-indigo-500' : 'bg-white text-gray-600']"
              class="settings-header-button"
            >
              Datos generales
            </div>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <div
              :class="[selected ? 'bg-gray-200 text-indigo-500' : 'bg-white text-gray-600']"
              class="settings-header-button"
            >
              Metadata
            </div>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600">
                Dispositivo de entrada
              </h1>
              <SelectVue v-model="state.audio.selectedDevice" :filters="availableDevices" />
            </div>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600">
                Bitrate
              </h1>
              <SelectVue v-model="state.audio.bitRate" :filters="supportedBitRates" />
            </div>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600">
                Sample rate
              </h1>
              <SelectVue v-model="state.audio.sampleRate" :filters="supportedSampleRates" />
            </div>
          </TabPanel>
          <TabPanel>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600 mb-2">
                Nombre del stream
              </h1>
              <input
                v-model="state.streamData.name" placeholder="Introduce un nombre" class="settings-input"
                type="text"
              >
            </div>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600 mb-2">
                Descripción del stream
              </h1>
              <input
                v-model="state.streamData.description" placeholder="Descriptción" class="settings-input"
                type="text"
              >
            </div>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600 mb-2">
                Título del stream
              </h1>
              <input v-model="state.streamData.title" placeholder="Título" class="settings-input" type="text">
            </div>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600 mb-2">
                Género del stream
              </h1>
              <input v-model="state.streamData.genre" placeholder="Género" class="settings-input" type="text">
            </div>
          </TabPanel>
          <TabPanel>
            <div class="mb-5 flex items-center">
              <h1 class="font-bold text-gray-600 mr-5 justify-center">
                Activar metadatos
              </h1>
              <Switch
                v-model="state.metadata.enabled" :class="state.metadata.enabled ? 'bg-indigo-500' : 'bg-gray-200'"
                class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Activar metadata</span>
                <span
                  aria-hidden="true" :class="state.metadata.enabled ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>
            <div class="mb-5">
              <h1 class="font-bold text-gray-600 mb-2">
                Seleccionar archivo
              </h1>
              <div class="grid grid-cols-3 gap-2">
                <button
                  :disabled="!state.metadata.enabled"
                  class="col-span-1 border disabled:bg-gray-200 disabled:cursor-not-allowed border-gray-200 rounded-lg font-bold py-1 px-4"
                  @click="openFileDialog"
                >
                  Abrir
                </button>
                <input
                  v-model="state.metadata.filename" disabled placeholder="Archivo"
                  class="settings-input col-span-2 text-sm text-gray-500" type="text"
                >
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <template #footer>
        <div class="text-center">
          <p v-show="audioControlsStore.isStarted" class="text-red-500 mb-5 text-xs">
            No se pueden actulizar estos datos mientras la transmisión esté activa.
          </p>
          <div class="flex justify-end">
            <button class="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg" @click="cancel">
              Cancelar
            </button>
            <button
              :disabled="audioControlsStore.isStarted"
              class="bg-indigo-500 text-white px-4 py-2 rounded-lg ml-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              @click="save"
            >
              Guardar
            </button>
          </div>
        </div>
      </template>
    </DialogVue>
  </div>
</template>

<style scoped lang="postcss">
.settings-header-button {
  @apply mr-1 hover:bg-gray-200 hover:text-indigo-500 rounded-md px-5 py-1 font-bold cursor-pointer transition
}

.settings-input {
  @apply w-full rounded-lg py-2 pl-3 pr-10 border border-gray-200
}
</style>
