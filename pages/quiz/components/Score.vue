<script setup lang="ts">
import { getRandomResponse } from '../helper'
import RadialProgress from '~/components/RadialProgress.vue'
import { useQuizStore } from '~/stores/quiz'
import { Badge } from '@/components/ui/badge'

const QUIZ_STORE = useQuizStore()

const result = computed(() => QUIZ_STORE.GET_RESULT)

function formatTime(time: number | null | undefined) {
  if (time === null || time === undefined)
    return '?'

  if (time < 1)
    return `${Math.round(time * 60)}s`

  else
    return `${time}min`
}

const radialVariant = computed(() => {
  if (result.value?.percentage && result.value?.percentage) {
    if (result.value?.percentage >= 70)
      return 'green'

    else if (result.value?.percentage >= 30)
      return 'orange'

    else
      return 'red'
  }
  return 'red'
})
</script>

<template>
  <div class="complete-form">
    <div class="flex items-center justify-center h-full">
      <div class="text-center p-6">
        <div class="flex flex-col items-center justify-center mx-auto">
          <label for="congratulations" class="text-heading mb-6 block text-base font-semibold leading-6">
            <div class="text-muted-foreground">{{ getRandomResponse(result?.percentage ?? 0) }}</div>
          </label>
          <!-- <label for="error" class="text-muted-foreground block text-sm font-normal leading-6">Your Score</label> -->
        </div>

        <div class="text-brand flex flex-col items-center justify-center gap-3">
          <RadialProgress
            :variant="radialVariant"
            :text="`${result?.correct ?? '?'}/${result?.max_q ?? '?'}`"
            :completed-steps="result?.correct ?? 0"
            :total-steps="result?.max_q ?? 0"
          />

          <div class="flex items-center gap-2 justify-center">
            <Badge variant="secondary" class="text-green-500">
              <Icon name="tabler:check" class="me-1 w-4 h-4" /> Correct {{ result?.correct ?? '?' }}
            </Badge>
            <Badge variant="secondary" class="text-red-500">
              <Icon name="radix-icons:cross-2" class="me-1 w-4 h-4" /> Wrong {{ result?.incorrect ?? '?' }}
            </Badge>
          </div>
        </div>

        <div class="w-full my-4">
          <label class="block font-mono text-xs text-slate-400 border-t border-dashed">
            <div class="flex items-center justify-between pt-2.5 text-center">
              <span>Score</span>
              <span>{{ result?.percentage ?? '?' }}%</span>
            </div>
            <div class="flex items-center justify-between pt-1.5 text-center">
              <span>Time</span>
              <span>{{ formatTime(result?.time_taken) }}</span>
            </div>
          </label>
        </div>

        <div class="flex flex-col items-center justify-center mx-auto mt-6">
          <label for="error" class="text-heading mb-1.5 block text-base font-semibold leading-6">
            <!-- <div class="flex items-center justify-center">You have missed {{ result?.incorrect || '?' }} out of {{ result?.max_q || '?' }} questions</div> -->

            <!-- Perfect Score Message -->
            <div v-if="result?.percentage === 100" class="flex items-center justify-center">
              {{ `${getRandomResponse(result?.percentage ?? 0)} You've hit the perfect score. ${result?.correct || '?'} out of ${result?.max_q || '?'}!` }}
            </div>

            <!-- Green Score Message -->
            <div v-else-if="radialVariant === 'green'" class="flex items-center justify-center">
              {{ `${getRandomResponse(result?.percentage ?? 0)} You've correctly answered ${result?.correct || '?'} out of ${result?.max_q || '?'}.` }}
            </div>

            <!-- Orange Score Message -->
            <div v-else-if="radialVariant === 'orange'" class="flex items-center justify-center">
              {{ `${getRandomResponse(result?.percentage ?? 0)} You've missed ${result?.incorrect || '?'} out of ${result?.max_q || '?'}` }} questions.
            </div>

            <!-- Red Score Message -->
            <div v-else class="flex items-center justify-center">
              {{ `${getRandomResponse(result?.percentage ?? 0)} You've missed ${result?.incorrect || '?'} out of ${result?.max_q || '?'}` }} questions. Keep practicing!
            </div>
          </label>
          <label for="error" class="text-muted-foreground block text-xs font-normal leading-6">You did a good job, Learn more by taking another quizze.</label>
        </div>

        <!-- <div class="w-fit">
          <RadialProgress
            variant="orange"
            text="4/10"
            :completed-steps="completedSteps"
            :total-steps="totalSteps"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>
