
<script lang="ts" setup>
import { inject } from 'vue';

  const serverUrl = inject('serverUrl');

</script>

<template>
  <div class="mt-10">
    <h1 class="text-indigo-500">
      Conexión con el servidor
    </h1>
    <div class="bg-gray-200 p-5 rounded-lg flex flex-col mt-5">
      <input class="py-2 px-5 rounded-md w-96 text-center shadow-md" v-model="serverUrl" type="text"
        placeholder="Introduce la dirección del servidor">
      <button class="mt-5 transition hover:shadow-lg bg-indigo-500 rounded-md text-white px-5 py-2"
        @click="$emit('connectSocket')">Conectar</button>
    </div>
  </div>
</template>