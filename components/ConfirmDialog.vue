<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  icon?: string
  title?: string
  description?: string
  action?: (payload?: object) => void
}
const props = withDefaults(defineProps<Props>(), {
  icon: 'tabler:info-circle',
  title: 'Are you absolutely sure?',
  description: 'This action cannot be undone. This will permanently delete your accountand remove your data from our servers.',
})

const emit = defineEmits(['close'])

function Cancel() {
  emit('close')
}
</script>

<template>
  <AlertDialog :open="props.open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ props.description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="Cancel">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction @click="() => props.action">
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
