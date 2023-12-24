<script setup lang="ts">
import type { QuestionRow } from '../utils/types/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  loading: boolean
  question?: QuestionRow
  editable?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits(['close', 'submit'])

function Close() {
  emit('close')
}

function Confirm() {
  emit('submit')
}
</script>

<template>
  <Dialog :open="props.open">
    <DialogTrigger />

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Preview</DialogTitle>
        <DialogDescription>
          Make changes to your question here. Click Continue when you're done.
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-center space-x-2">
        <div class="flex h-full w-full flex-col justify-between  pb-3 pt-6">
          <div class="my-auto">
            <form class="w-full">
              <Label for="question-label" class="text-heading mb-1.5 block text-base font-semibold leading-6">
                <!-- <div class="my-2"> <Badge variant="secondary">{{ question?.category }}</Badge></div> -->
                <div class="flex items-center ml-1 mr-[1ch] justify-between">{{ question?.question.text }}</div>
              </label><Label for="question-label" class="text-subheading block text-sm font-normal leading-6" />
              <div class="mt-4">
                <fieldset>
                  <legend class="sr-only">
                    Options
                  </legend>

                  <div
                    role="radiogroup"
                    class="bg-survey-bg relative max-h-[42vh] space-y-2 overflow-y-auto rounded-md py-0.5"
                  >
                    <Label
                      v-for="(option, i) in question?.answers"
                      :key="i"
                      :tabindex="i + 1"
                      class="border-border-highlight bg-accent-selected-bg z-10 text-heading focus-within:border-border-highlight focus-within:bg-accent-bg hover:bg-accent-bg relative flex cursor-pointer flex-col rounded-md border p-4 focus:outline-none"
                    >
                      <span class="flex items-center text-sm">
                        <Avatar class="me-4">
                          <Icon :name="`tabler:letter-${String.fromCharCode(97 + i)}`" class="h-4 w-4" />
                        </Avatar>

                        <input
                          :id="`option-${i + 1}`" type="radio" name="question-label" aria-labelledby="option-label"
                          class="border-brand text-brand h-4 w-4 border focus:ring-0 focus:ring-offset-0"
                          :value="option.text"
                        >
                        <span id="option-label" class="ml-3 font-medium">{{ option.text }}</span></span>
                    </label>
                  </div>
                </fieldset>
              </div>
            </form>
          </div>
        </div>
      </div>

      <DialogFooter v-if="editable">
        <Button type="submit" variant="outline" :disabled="loading" class="lg:w-36" @click="Close">
          Edit
        </Button>
        <Button type="submit" class="lg:w-36" :disabled="loading" @click="Confirm">
          <Icon
            v-if="loading"
            name="svg-spinners:180-ring"
            class="mr-2"
          />
          Confirm
        </Button>
      </DialogFooter>
      <DialogFooter v-else>
        <Button type="submit" variant="default" class="lg:w-36" @click="Close">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
