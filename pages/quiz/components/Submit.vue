<script setup lang="ts">
import { useQuizStore } from '~/stores/quiz'
import { Button } from '@/components/ui/button'

const QUIZ_STORE = useQuizStore()
const status = computed(() => QUIZ_STORE.GET_QUIZ_STATUS)

function showScore() {
  QUIZ_STORE.SET_QUIZ_STATUS('result')
}
</script>

<template>
  <div class="complete-form">
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="min-h-[175px]">
          <div class="text-brand flex items-center justify-center">
            <Icon v-if="status === 'submit'" name="line-md:loading-twotone-loop" class="w-24 h-24 text-muted-foreground rounded-full" />
            <Icon v-else-if="status === 'complete'" name="radix-icons:check-circled" class="w-24 h-24 text-green-600 rounded-full" />
            <Icon v-else name="radix-icons:info-circled" class="w-24 h-24 text-red-600 rounded-full" />
          </div>
          <span class="bg-slate-300 mb-[10px] inline-block h-1 w-16 rounded-[100%]" />
          <transition-fade v-if="status === 'complete'" appear>
            <div>
              <label for="result" class="text-heading mb-1.5 block text-base font-semibold leading-6">
                <div class="flex items-center justify-center">That's a wrap!</div>
              </label><label for="result" class="text-muted-foreground block text-sm font-normal leading-6">We appreciate your participation.</label>
            </div>
          </transition-fade>
          <transition-fade v-else appear>
            <div>
              <label for="waiting-for-result" class="text-heading mb-1.5 block text-base font-semibold leading-6">
                <div class="flex items-center justify-center">Analyzing Your Answers</div>
              </label><label for="waiting-for-result" class="text-muted-foreground block text-sm font-normal leading-6">Hold tight - we're preparing your score card.</label>
            </div>
          </transition-fade>
        </div>

        <div class="min-h-[40px]">
          <transition-fade appear>
            <div v-if="status === 'complete'" class="flex items-center justify-center gap-2 mt-4 ">
              <Button variant="outline" class="rounded-full" @click="showScore">
                Score Card
              </Button>

              <Button variant="outline" size="icon" class="rounded-full">
                <Icon name="radix-icons:reload" />
              </Button>
            </div>
          </transition-fade>
        </div>
      </div>
    </div>
  </div>
</template>
