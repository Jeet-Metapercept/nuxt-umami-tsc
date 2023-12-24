<script setup lang="ts">
import RadialProgress from 'vue3-radial-progress'

type ColorVariant = 'grey' | 'green' | 'orange' | 'red'
interface Props {
  variant?: ColorVariant
  text?: string
  completedSteps?: number
  totalSteps?: number
}
interface ColorVariants {
  [key: string]: {
    start: string
    stop: string
    bg: string
    text: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'grey',
  completedSteps: 0,
  totalSteps: 10,
})

const completeStep = computed(() => props.completedSteps >= props.totalSteps ? props.totalSteps : props.completedSteps)

// startColor	string	'#00C58E'	Sets the start color of the inner stroke (gradient).
// stopColor	string	'#00E0A1'	Sets the end color of the inner stroke (gradient).
// innerStrokeColor	string	'#2F495E'	Sets the color of the inner stroke to be applied to the shape.

const colorVariants: ColorVariants = {
  grey: {
    start: 'rgb(107 114 128)', // Tailwind gray-500
    stop: 'rgb(156 163 175)', // Tailwind gray-400
    bg: 'bg-grey-100',
    text: 'text-grey-800',
  },
  green: {
    start: 'rgb(34 197 94)', // Tailwind green-500
    stop: 'rgb(74 222 128)', // Tailwind green-400
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  orange: {
    start: 'rgb(249 115 22)', // Tailwind orange-500
    stop: 'rgb(251 146 60)', // Tailwind orange-400
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
  red: {
    start: 'rgb(239 68 68)', // Tailwind red-500
    stop: 'rgb(248 113 113)', // Tailwind red-400
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
  // ... Add more colors if needed
}

const getVariantColors = (variant: ColorVariant) => colorVariants[variant]

const startColor = computed(() => getVariantColors(props.variant).start)
// const stopColor = computed(() => getVariantColors(props.variant).stop)
const stopColor = computed(() => getVariantColors(props.variant).start)
const circleBgClass = computed(() => getVariantColors(props.variant).bg)
const textColorClass = computed(() => getVariantColors(props.variant).text)
const percentage = computed(() => Math.round((completeStep.value / props.totalSteps) * 100))
</script>

<template>
  <div id="RefRadialProgress" class="flex flex-col justify-center items-center gap-2">
    <RadialProgress
      :diameter="110"
      :completed-steps="completeStep"
      :total-steps="props.totalSteps"
      :stroke-width="5"
      inner-stroke-color="transparent"
      :start-color="startColor"
      :stop-color="stopColor"
      timing-func="ease-in-out"
    >
      <div :class="circleBgClass" class="rounded-full h-24 w-24 -z-10 flex items-center justify-center">
        <span class="font-mono text-xl tracking-wide" :class="textColorClass">
          {{ text ? text : `${percentage}%` }}
        </span>
      </div>
    </RadialProgress>
    <span class="bg-slate-300 mb-[10px] inline-block h-1 w-16 rounded-[100%]" />
  </div>
</template>
