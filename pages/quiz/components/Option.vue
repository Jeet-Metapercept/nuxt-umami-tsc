<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { UserAnswer } from '~/stores/quiz/types'

export interface Props {
  index: number
  option: UserAnswer
  icon: string
}
const props = defineProps<Props>()
const emit = defineEmits(['selected'])

function selectOption() {
  const updatedOption = { ...props, is_selected: !props.option.is_selected, index: props.index }
  emit('selected', updatedOption)
}
</script>

<template>
  <div>
    <label
      :tabindex="props.index" class="border-border-highlight z-10 text-heading flex cursor-pointer flex-col rounded-md border focus:outline-none"
    >
      <Button
        size="lg" class="justify-start h-auto px-4 py-2"
        :variant="option.is_selected ? 'default' : 'ghost'"
        :class="option.is_selected ? 'hover:bg-primary text-white' : ''"
        @click="selectOption()"
      >
        <span class="flex items-center gap-4">
          <Avatar :class="option.is_selected ? 'bg-primary text-white' : ''">
            <AvatarFallback>
              <Icon :name="props.icon" class="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span class="select-none text-start">{{ option.text }}</span>
        </span>
      </Button>
    </label>
  </div>
</template>
