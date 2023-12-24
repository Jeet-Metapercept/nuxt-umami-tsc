<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const { auth } = useSupabaseClient()
const email = ref('')
// const password = ref('')
const isLoading = ref(false)

// async function signUp(event: Event) {
//   event.preventDefault()
//   isLoading.value = true

//   if (email.value) {
//     isLoading.value = false
//     toast({
//       title: 'Uh oh! Something went wrong.',
//       description: 'Invalid email format',
//       variant: 'destructive',
//       duration: 4000,
//     })

//     const { error } = await auth.signUp({
//       email: email.value,
//       password: password.value,
//     })

//     if (error) {
//       isLoading.value = false
//       toast({
//         title: 'Uh oh! Something went wrong.',
//         description: 'Failed to SignUp',
//         variant: 'destructive',
//         duration: 4000,
//       })
//     }
//   }
//   else {
//     toast({
//       description: 'Please provide valid Email Address',
//       variant: 'destructive',
//       duration: 4000,
//     })
//   }
// }

async function signInWithOtp(event: Event) {
  event.preventDefault()
  isLoading.value = true
  const { error } = await auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  })
  if (error) {
    toast({
      title: 'Uh oh! Something went wrong.',
      description: error.message,
      variant: 'destructive',
      duration: 4000,
    })
    isLoading.value = false
    return
  }

  toast({
    title: email.value,
    description: 'We\'ve sent your an email',
    duration: 4000,
  })
  isLoading.value = false
}

async function loginWithGoogle() {
  const { error } = await auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/confirm`,
    },
  })
  if (error) {
    isLoading.value = false
    toast({
      title: 'Uh oh! Authentication failed',
      description: 'Failed to login with Google',
      variant: 'destructive',
      duration: 4000,
    })
  }
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="signInWithOtp">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="email"> Email </Label>
          <Input
            id="email"
            v-model="email"
            placeholder="user@example.com" type="email" auto-capitalize="none" auto-complete="email"
            auto-correct="off" :disabled="isLoading"
          />
        </div>
        <!-- <div class="grid gap-1">
          <Label class="not-sr-only" for="password"> Password </Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="password"
            auto-capitalize="none"
            auto-complete="password"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div> -->
        <Button class="mt-2" :disabled="isLoading">
          <Icon v-if="isLoading" name="svg-spinners:180-ring" class="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
    <Button variant="outline" type="button" :disabled="isLoading" @click="loginWithGoogle">
      <Icon name="logos:google-icon" class="mr-2 h-4 w-4" />
      Google
    </Button>
  </div>
</template>
