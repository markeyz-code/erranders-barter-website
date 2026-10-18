<template>
  <div class="relative w-full" :class="isOpen ? 'z-50' : 'z-10'" ref="selectRef">
    <button
      type="button"
      @click="toggle"
      class="flex items-center justify-between gap-2 border bg-white font-bold outline-none transition-all text-left"
      :class="[
        variant === 'form'
          ? 'w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm min-h-[38px]'
          : 'rounded-full px-5 py-2.5 text-sm min-w-[160px]',
        isOpen
          ? 'border-brand-600 shadow-md shadow-brand-600/10 ring-2 ring-brand-600/15'
          : 'border-slate-200 hover:border-slate-300'
      ]"
    >
      <span class="truncate" :class="modelValue ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'">
        {{ currentLabel }}
      </span>
      <ChevronDown
        class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
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
          variant === 'form' ? 'w-full min-w-full rounded-xl' : 'w-full min-w-[200px] rounded-2xl',
          align === 'right' ? 'right-0' : 'left-0'
        ]"
      >
        <ul class="p-1 max-h-60 overflow-y-auto space-y-0.5">
          <li
            v-for="option in normalizedOptions"
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
    // Can be ['A', 'B'] or [{ value: 'A', label: 'Option A' }]
  },
  placeholder: { type: String, default: 'Select...' },
  align: { type: String, default: 'left' },
  variant: { type: String, default: 'pill' } // 'pill' | 'form'
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const normalizedOptions = computed(() => {
  return (props.options || []).map(opt => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return { value: opt.value, label: opt.label || String(opt.value) }
    }
    return { value: opt, label: String(opt) }
  })
})

const currentLabel = computed(() => {
  const found = normalizedOptions.value.find(o => o.value === props.modelValue)
  return found ? found.label : props.placeholder
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
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
