<script lang="ts" setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
const props = defineProps<{
  value: number
  showPeaks?: boolean
}>()

const { value, showPeaks } = toRefs(props)
const peak = ref(0)

const invertedValue = computed(() => 100 - value.value)

watch(() => value.value, (val) => {
  peak.value = peak.value !== 0 ? peak.value - 1 : 0
  if (val > peak.value)
    peak.value = val
})
</script>

<template>
  <div class="relative w-full h-2 rounded-lg overflow-hidden">
    <div class="absolute h-full w-full top-0 left-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
      <div class="w-full h-full bg-gray-100 float-right" :style="{ width: `${invertedValue}%` }" />
      <div>
        <div v-show="showPeaks" class="w-[1px] h-full top-0 bg-gray-400 absolute" :style="{ left: `${peak}%` }" />
      </div>
    </div>
  </div>
</template>
