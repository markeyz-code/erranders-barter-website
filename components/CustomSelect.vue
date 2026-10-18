<template>
  <div class="relative w-full" :class="isOpen ? 'z-50' : 'z-10'" ref="selectRef">
    <button
      type="button"
      @click="toggle"
      class="flex items-center justify-between gap-1.5 border bg-white font-bold outline-none transition-all text-left"
      :class="[
        variant === 'form'
          ? 'w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm min-h-[38px]'
          : variant === 'filter'
            ? 'w-full rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[40px]'
            : 'w-full sm:w-auto rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm min-w-0 sm:min-w-[150px]',
        isOpen
          ? 'border-brand-600 shadow-md shadow-brand-600/10 ring-2 ring-brand-600/15'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
      ]"
    >
      <div class="flex items-center gap-1.5 min-w-0 flex-1">
        <component
          :is="icon"
          v-if="icon"
          class="w-3.5 h-3.5 flex-shrink-0 text-slate-400"
        />
        <span class="truncate" :class="modelValue ? 'text-slate-900 font-extrabold' : 'text-slate-500 font-medium'">
          {{ currentLabel }}
        </span>
      </div>
      <ChevronDown
        class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-200"
        :class="isOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'"
      />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-[100] top-full mt-1.5 bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 overflow-hidden"
        :class="[
          variant === 'form' 
            ? 'w-full min-w-full rounded-xl' 
            : variant === 'filter'
              ? 'w-auto min-w-full sm:min-w-[190px] max-w-[calc(100vw-32px)] sm:max-w-[280px] rounded-xl'
              : 'w-full sm:w-auto min-w-[200px] rounded-2xl',
          align === 'right' ? 'right-0' : 'left-0'
        ]"
      >
        <!-- Quick search within dropdown if options count > 7 -->
        <div v-if="searchable && normalizedOptions.length > 7" class="p-1.5 border-b border-slate-100">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search..."
            class="w-full text-xs font-semibold px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-600 focus:bg-white text-slate-800"
            @click.stop
          />
        </div>

        <ul class="p-1 max-h-60 overflow-y-auto space-y-0.5">
          <li
            v-for="option in displayedOptions"
            :key="String(option.value)"
            @click="selectOption(option)"
            class="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer transition-colors text-xs sm:text-sm font-bold rounded-lg"
            :class="
              modelValue === option.value
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-700 hover:bg-slate-50 hover:text-brand-600'
            "
          >
            <span class="truncate">{{ option.label }}</span>
            <span
              v-if="modelValue === option.value"
              class="w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 text-white shadow-xs"
            >
              <Check class="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </li>
          <li
            v-if="displayedOptions.length === 0"
            class="px-3 py-3 text-center text-xs text-slate-400 font-medium"
          >
            No matches found
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  options: {
    type: Array,
    required: true,
  },
  placeholder: { type: String, default: 'Select...' },
  align: { type: String, default: 'left' },
  variant: { type: String, default: 'pill' }, // 'pill' | 'form' | 'filter'
  icon: { type: [Object, Function], default: null },
  searchable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)
const searchTerm = ref('')

const normalizedOptions = computed(() => {
  return (props.options || []).map(opt => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return { value: opt.value, label: opt.label || String(opt.value) }
    }
    return { value: opt, label: String(opt) }
  })
})

const displayedOptions = computed(() => {
  if (!searchTerm.value?.trim()) return normalizedOptions.value
  const term = searchTerm.value.trim().toLowerCase()
  return normalizedOptions.value.filter(o => o.label.toLowerCase().includes(term))
})

const currentLabel = computed(() => {
  const found = normalizedOptions.value.find(o => o.value === props.modelValue)
  return found ? found.label : props.placeholder
})

const toggle = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) searchTerm.value = ''
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
  searchTerm.value = ''
}

const handleClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
    searchTerm.value = ''
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
    searchTerm.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
