
<script lang="ts" setup>
import { ref, computed, toRefs, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'

const props = defineProps<{
  filters: string[],
  modelValue: string,
  placeholder?: string,
}>();

const emit = defineEmits(['update:modelValue']);

const { filters, modelValue } = toRefs(props)

let query = ref('')

let filteredData = computed(() =>
  query.value === ''
    ? filters.value
    : filters.value.filter((filter) =>
      filter
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    )
)

const valueGetter = computed({
  get: () => modelValue.value,
  set: (val) => emit('update:modelValue', val),
})

</script>

<template>
  <div>
    <Combobox v-model="valueGetter" nullable>
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <ComboboxInput :placeholder="placeholder"
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            :displayValue="(filter: string) => filter" @change="query = $event.target.value" />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon name="hi-selector" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
          @after-leave="query = ''">
          <ComboboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white z-10 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div v-if="filteredData.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700">
              No se encontraron valores.
            </div>

            <ComboboxOption v-if="query.length > 0" :value="query">
              <li class="relative cursor-default select-none py-2 pl-10 pr-4 bg-indigo-500 text-white">
                <span class="block truncate font_normal">
                  Usar valor: "{{ query }}"
                </span>
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon name="hi-check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>

            <ComboboxOption v-for="filter in filteredData" as="template" :key="filter" :value="filter"
              v-slot="{ selected, active }">
              <li class="relative cursor-default select-none py-2 pl-10 pr-4" :class="{
                'bg-indigo-500 text-white': active,
                'text-gray-900': !active,
              }">
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ filter }}
                </span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }">
                  <Icon name="hi-check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>