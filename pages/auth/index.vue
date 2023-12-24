<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const isLoading = ref(false)
const user = useSupabaseUser()
const { auth } = useSupabaseClient()

async function logout() {
  isLoading.value = true
  const { error } = await auth.signOut()
  if (error) {
    isLoading.value = false

    toast({
      title: 'Uh oh! Something went wrong.',
      variant: 'destructive',
      duration: 4000,
    })
  }
  else { navigateTo('/') }
}
</script>

<template>
  <div class="relative w-full">
    <h1>HELLO</h1>
    <div class="">
      <p v-if="user" class="fVeafc in">
        Hi {{ user.email }}
      </p>
      <p v-else class="fVeafc">
        unauthenticated
      </p>
      <h1
        class="py-4 text-7xl font-semibold text-primary"
        style="line-height: 4.5rem; letter-spacing: -0.03em"
      >
        Nuxt3 + Supabase
      </h1>

      <p class="kRTmDC">
        Authentication with Google and email and password, using Supabase. Nuxt3
        app
      </p>
      <div v-if="user" class="uQxNj">
        <button class="ieMfVH" :disabled="isLoading" @click="logout">
          <span class="fKlELC" :class="{ isLoading }"> Log out </span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="jjoFVh"
            :class="{ isLoading }"
          >
            <g
              fill="none"
              stroke-width="1.5"
              stroke-linecap="round"
              class="faEWLr"
              style="stroke: var(--icon-color)"
            >
              <circle stroke-opacity=".2" cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="6" class="VFMrX" />
            </g>
          </svg>
        </button>

        <button class="btn" onclick="my_modal_5.showModal()">
          open modal
        </button>
      </div>
      <div v-else class="uQxNj">
        <NuxtLink class="bQRHNT" to="/auth/login">
          <span class="fKlELC">
            Login
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="taKtSf"
            >
              <path
                class="chevron"
                d="M8 13L13 8L8 3"
                stroke-width="1.5"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <path class="stem" d="M12 8L2 8" stroke-width="1.5" />
            </svg>
          </span>
        </NuxtLink>
        <!-- <NuxtLink to="/auth/register"> -->
        <button class="ieMfVH">
          <span class="fKlELC"> Sign up </span>
        </button>
        <!-- </NuxtLink> -->
      </div>
    </div>

    <!-- Open the modal using ID.showModal() method -->
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
      <form method="dialog" class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          <Icon name="tabler-x" />
        </button>

        <h3 class="font-bold text-lg">
          Hello!
        </h3>
        <p class="py-4">
          Press ESC key or click the button below to close
        </p>
        <div class="modal-action">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">
            Close
          </button>
        </div>
      </form>
    </dialog>

    <ul class="my-8 menu bg-base-200 rounded-box">
      <li>
        <!-- <NuxtLink to="/form"> -->
        <Icon name="tabler-api" size="1.5rem" />
        Forms
        <!-- </NuxtLink> -->
        <!-- <NuxtLink to="/form/import"> -->
        <Icon name="tabler-database-import" size="1.5rem" />
        Import
        <!-- </NuxtLink> -->
        <!-- <NuxtLink to="/form/quicktest"> -->
        <Icon name="tabler-award" size="1.5rem" />
        Quick Test
        <!-- </NuxtLink> -->
      </li>
    </ul>
  </div>
</template>
