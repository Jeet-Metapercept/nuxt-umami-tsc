<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const { auth } = useSupabaseClient()
const route = useRoute()

const email = ref('')
const password = ref('')

const isLoading = ref(false)

// const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`;

async function login(event: Event) {
  event.preventDefault()
  isLoading.value = true
  const { error } = await auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    isLoading.value = false
    toast({
      title: 'Uh oh! Authentication failed',
      description: 'Invalid login credentials',
      variant: 'destructive',
    })
  }
}

async function loginWithGoogle() {
  const { error } = await auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: route.query?.redirect ? `${window.location.origin}${route.query.redirect}` : `${window.location.origin}/auth/confirm`,
    },
  })
  if (error) {
    isLoading.value = false
    toast({
      title: 'Uh oh! Authentication failed',
      description: 'Failed to login with Google',
      variant: 'destructive',
    })
  }
}

function goToRegistration() {
  window.location.href = '/auth/login?v=register-user'
}
function goToForgotPassword() {
  window.location.href = '/auth/login?v=forgot-password'
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="login">
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
        <div class="grid gap-1">
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
        </div>

        <p class="text-end">
          <!-- <a class="text-sm ">Forgot Password v2</a> -->
          <Button variant="link" type="button" size="sm" class="px-0 text-xs" @click="goToForgotPassword">
            Forgot Password?
          </Button>
        </p>
        <Button :disabled="isLoading">
          <Icon
            v-if="isLoading"
            name="svg-spinners:180-ring"
            class="mr-2 h-4 w-4"
          />
          Sign In
        </Button>

        <p class="text-center text-xs">
          New on our platform? <Button variant="link" type="button" size="sm" class="px-1 text-xs" @click="goToRegistration">
            Create an account
          </Button>
        </p>
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
