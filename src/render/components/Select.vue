<script lang="ts" setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import type { IFilter } from '@render/common.type'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'

const props = defineProps<{
  filters: IFilter[]
  modelValue: string
  placeholder?: string
  combobox?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const { filters, modelValue } = toRefs(props)

const query = ref('')

const filteredData = computed(() =>
  query.value === ''
    ? filters.value
    : filters.value.filter(filter =>
      filter.label
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)

const selectedFilter = ref<IFilter>(
  filters.value.find(i => i.value === modelValue.value)
  || filters.value[0]
  || { label: '', value: '' },
)

watch(selectedFilter, (filter: IFilter) => {
  if (filter)
    emit('update:modelValue', selectedFilter.value.value)
})

onMounted(() => {
  emit('update:modelValue', selectedFilter.value.value)
})
</script>

<template>
  <div>
    <Combobox v-model="selectedFilter" :nullable="combobox">
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default border border-gray-200 overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        >
          <ComboboxInput
            :placeholder="placeholder"
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            :display-value="(filter: IFilter) => filter.label" @change="query = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon name="hi-selector" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base border shadow-lg border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredData.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700"
            >
              No se encontraron valores.
            </div>

            <ComboboxOption v-if="query.length > 0 && combobox" :value="{ label: query, value: query }">
              <li class="relative cursor-default select-none py-2 pl-10 pr-4 bg-indigo-500 text-white">
                <span class="block truncate font_normal">
                  Usar valor: "{{ query }}"
                </span>
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon name="hi-check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>

            <ComboboxOption
              v-for="filter in filteredData" :key="filter.value" v-slot="{ selected, active }" as="template"
              :value="filter"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4" :class="{
                  'bg-indigo-500 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ filter.label }}
                </span>
                <span
                  v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
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
