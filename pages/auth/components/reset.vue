<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const { auth } = useSupabaseClient()

auth.signOut()

const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)

async function updatepassword(event: Event) {
  event.preventDefault()
  isLoading.value = true

  if (password.value !== passwordConfirm.value) {
    toast({
      title: 'Uh oh!',
      description: 'Password mismatch',
      variant: 'destructive',
      duration: 4000,
    })
    return
  }

  const { error } = await auth.updateUser({
    password: password.value,
  })
  await auth.signOut()
  if (error) {
    isLoading.value = false
    toast({
      title: 'Uh oh!',
      description: error.message,
      variant: 'destructive',
      duration: 4000,
    })
  }
  else {
    isLoading.value = false
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 5000)
  }
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="updatepassword">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="not-sr-only" for="password"> Password </Label>
          <Input
            id="email"
            v-model="password"
            placeholder="New Password"
            type="password"
            auto-capitalize="none"
            auto-complete="password"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <Label class="not-sr-only" for="cpassword"> Confirm Password </Label>
          <Input
            id="cpassword"
            v-model="passwordConfirm"
            placeholder="Repeat Password"
            type="password"
            auto-capitalize="none"
            auto-complete="password"
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
          Submit
        </Button>
      </div>
    </form>
  </div>
</template>
