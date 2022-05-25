
<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { useConfigStore } from '@render/stores/config';
import { nanoid } from 'nanoid';
import SelectVue from './Select.vue';

const serverUrl = inject('serverUrl') as Ref<string>;
const broadcastId = inject('broadcastId') as Ref<string>;
const configStore = useConfigStore();
const emit = defineEmits(['connectSocket']);

const saveServerHistory = () => {
  if (!serverUrl.value) return;
  const history = configStore.serverHistory;
  const indexOfHistory = history.indexOf(serverUrl.value);
  if (indexOfHistory === 1) return;
  if (indexOfHistory === -1) {
    history.unshift(serverUrl.value);
    if (history.length > 10) history.pop();
    configStore.serverHistory = history;
    configStore.lastServer = serverUrl.value;
  }
  if (indexOfHistory > 1) {
    history.splice(indexOfHistory, 1);
    history.unshift(serverUrl.value);
    configStore.serverHistory = history;
  }
  configStore.persistData();
};

const saveBroadcastIdHistory = () => {
  if (!broadcastId.value) return;
  const history = configStore.broadcastIdHistory;
  const indexOfHistory = history.indexOf(broadcastId.value);
  if (indexOfHistory === 0) return;
  if (indexOfHistory === -1) {
    history.unshift(broadcastId.value);
    if (history.length > 10) history.pop();
    configStore.broadcastIdHistory = history;
    configStore.lastBroadcastId = broadcastId.value;
  }
  if (indexOfHistory > 0) {
    history.splice(indexOfHistory, 1);
    history.unshift(broadcastId.value);
    configStore.broadcastIdHistory = history;
  }
  configStore.persistData();
};

const connect = () => {
  if (!broadcastId.value) broadcastId.value = nanoid();
  saveServerHistory();
  saveBroadcastIdHistory();
  emit('connectSocket')
};

</script>

<template>
  <div class="mt-10">
    <h1 class="text-indigo-500">
      Conexión con el servidor
    </h1>
    <div class="bg-gray-200 p-5 rounded-lg flex flex-col mt-5">
      <SelectVue :filters="configStore.serverHistory" class="w-96 text-center"
        v-model="serverUrl" type="text" placeholder="Introduce la dirección del servidor" />
      <SelectVue :filters="configStore.broadcastIdHistory" class="w-96 mt-2 text-center"
        v-model="broadcastId" type="text" placeholder="Introduce la identificación del stream" />
      <button class="mt-5 transition hover:shadow-lg bg-indigo-500 rounded-md text-white px-5 py-2"
        @click="connect">Conectar</button>
    </div>
  </div>
</template>