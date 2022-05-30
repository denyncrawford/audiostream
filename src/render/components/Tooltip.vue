<script lang="ts" setup>
defineProps<{
  position: 'top' | 'bottom' | 'left' | 'right'
  color: 'light' | 'dark'
}>()
</script>

<template>
  <div class="relative group cursor-help">
    <div
      class="absolute z-10 invisible transition-all duration-500
      opacity-0 group-hover:block group-hover:visible
      group-hover:opacity-70 group-focus:block  group-focus:visible
      group-focus:opacity-70 rounded-md py-1 px-4 shadow
      h-auto w-auto min-w-min group-hover:delay-1000 ease-in-out"
      :class="[
        color === 'light' ? 'bg-gray-50 text-current' : 'bg-black text-white',
        position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-4' : '',
        position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 translate-y-4' : '',
        position === 'left' ? 'right-full top-1/2 transform -translate-x-1 -translate-y-1/2' : '',
        position === 'right' ? 'left-full top-1/2 transform translate-x-1 -translate-y-1/2' : '',
      ]" role="tooltip"
    >
      <span class="text-xs whitespace-nowrap">
        <slot name="content" />
      </span>
    </div>
    <slot />
  </div>
</template>
