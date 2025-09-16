<template>
  <div>
    <NavMain>
      <template #left>
        <component :is="leftNavComponent" />
      </template>
      <template #right>
        </template>
    </NavMain>

    <RouterView />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import NavMain from '~/components/nav/NavMain.vue'

import NavLeftHome from '~/components/nav/content/NavLeftHome.vue'
import NavLeftGameDetails from '~/components/nav/content/NavLeftGameDetails.vue'

const route = useRoute()

const leftNavComponent = computed(() => {
  switch (route.name) {
    case 'GameDetails':
      return NavLeftGameDetails
    case 'Home':
    default:
      return NavLeftHome
  }
})
</script>
