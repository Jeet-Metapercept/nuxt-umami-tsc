<script setup lang="ts">
import ResetPassword from './components/reset.vue'

const project = useRuntimeConfig().public.PROJECT_NAME
const user = useSupabaseUser()
watchEffect(async () => {
  if (user.value)
    await navigateTo('/auth')
})

const icons = [
  'logos:nuxt-icon',
  'arcticons:quizlet',
  'ic:outline-keyboard-command-key',
  'material-symbols:keyboard-tab-rounded',
  'ic:baseline-keyboard-voice',
  'ic:sharp-keyboard-option-key',
  'mdi:apple-keyboard-shift',
]
const currentIconIndex = ref(0)
const currentIcon = ref(icons[currentIconIndex.value])

function shuffleIcons() {
  const shuffleInterval = setInterval(() => {
    currentIconIndex.value = (currentIconIndex.value + 1) % icons.length
    currentIcon.value = icons[currentIconIndex.value]
  }, 100)

  setTimeout(() => {
    clearInterval(shuffleInterval)
    currentIcon.value = icons[0]
  }, 2000)
}

onMounted(() => {
  shuffleIcons()
})
</script>

<template>
  <div>
    <div
      class="container relative h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen"
    >
      <div
        class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
      >
        <div class="absolute inset-0 bg-zinc-900" />
        <div class="absolute inset-0 flex justify-center items-center">
          <!-- <Icon name="ic:outline-keyboard-command-key" size="8em"></Icon> -->
          <Icon :name="currentIcon" size="8em" />
        </div>
        <div class="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="mr-2 h-6 w-6"
          >
            <path
              d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
            />
          </svg>
          {{ project }}
        </div>
        <div class="relative z-20 mt-auto">
          <blockquote class="space-y-2">
            <p class="text-sm">
              &ldquo;Failure is an option here. If things are not failing, you
              are not innovating enough. If something is important enough, even
              if the odds are stacked against you, you should still do
              it.&rdquo;
            </p>
            <footer class="text-sm">
              - Elon Musk
            </footer>
          </blockquote>
        </div>
      </div>
      <div class="lg:p-8">
        <div
          class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
          <div>
            <div class="flex flex-col space-y-2 text-start mb-6">
              <h1 class="text-2xl font-semibold tracking-tight">
                Reset Password
              </h1>
              <p class="text-sm text-muted-foreground">
                Please reset to your password
              </p>
            </div>
            <ResetPassword />
          </div>

          <p class="px-8 text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our
            <a
              href="/terms"
              class="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>
            and
            <a
              href="/privacy"
              class="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
