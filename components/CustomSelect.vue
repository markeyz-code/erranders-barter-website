<template>
  <div class="relative" ref="selectRef">
    <button
      type="button"
      @click="toggle"
      class="flex items-center justify-between gap-2 border rounded-full px-5 py-2.5 bg-white font-bold text-sm outline-none transition-all min-w-[160px]"
      :class="isOpen ? 'border-brand-600 shadow-lg shadow-brand-600/10 ring-2 ring-brand-600/10' : 'border-slate-200 hover:border-slate-300'"
    >
      <span class="truncate" :class="modelValue ? 'text-slate-900' : 'text-slate-400'">
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
        class="absolute z-50 top-full right-0 mt-2 w-full min-w-[200px] bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        <ul class="py-2 max-h-60 overflow-y-auto">
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm font-semibold"
            :class="
              modelValue === option.value
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              :class="
                modelValue === option.value
                  ? 'border-brand-600 bg-brand-600'
                  : 'border-slate-300'
              "
            >
              <Check v-if="modelValue === option.value" class="w-2.5 h-2.5 text-white" />
            </span>
            <span class="truncate">{{ option.label }}</span>
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
    // Each option: { value: string, label: string }
  },
  placeholder: { type: String, default: 'Select...' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const currentLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
