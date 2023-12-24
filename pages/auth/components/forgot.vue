<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const { auth } = useSupabaseClient()

auth.signOut()

const email = ref('')
const isLoading = ref(false)

async function resetPassword(event: Event) {
  event.preventDefault()
  isLoading.value = true
  const { error } = await auth.resetPasswordForEmail(email.value,
    {
      redirectTo: `${window.location.origin}/auth/forgot-password`,
    })
  if (error) {
    isLoading.value = false
    toast({
      title: 'Invalid Email',
      description: error.message,
      variant: 'destructive',
      duration: 4000,
    })
  }
  else {
    isLoading.value = false
    toast({
      title: 'Password Reset',
      description: 'We\'ve sent your an email',
      duration: 4000,
    })
  }
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="resetPassword">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="not-sr-only" for="email"> Email </Label>
          <Input
            id="email"
            v-model="email"
            placeholder="user@example.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <Button class="mt-4" :disabled="isLoading">
          <Icon
            v-if="isLoading"
            name="svg-spinners:180-ring"
            class="mr-2 h-4 w-4"
          />
          Reset Password
        </Button>
      </div>
    </form>
  </div>
</template>
