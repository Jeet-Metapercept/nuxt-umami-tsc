<script setup lang="ts">
import UserNav from './components/UserNav.vue'
import Search from './components/Search.vue'
import MainNav from './components/MainNav.vue'
</script>

<template>
  <div class="border-b sticky top-0 bg-white z-50">
    <div class="flex h-16 items-center px-4">
      <MainNav class="mx-6 hidden sm:block" />
      <div class="ml-auto flex items-center space-x-4">
        <Search />
        <UserNav />
      </div>
    </div>
  </div>
</template>
