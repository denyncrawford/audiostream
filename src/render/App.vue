<script setup lang="ts">
import SettingsVue from './components/Settings.vue'
import { useConfigStoreController } from './stores/config'
const configController = useConfigStoreController()

const toggleIsOpen = () => {
  configController.isConfigOpen = !configController.isConfigOpen
}
</script>

<template>
  <div
    class="group hover:bg-gray-300 hover:scale-110 cursor-pointer absolute mt-20 mr-20 duration-500 p-1 flex transition justify-center items-center rounded-full right-0"
    @click="toggleIsOpen"
  >
    <Icon
      class="h-8 w-8 duration-500 group-hover:text-indigo-500 group-hover:rotate-45 transition"
      name="hi-solid-cog"
    />
  </div>
  <router-view />
  <SettingsVue />
</template>
