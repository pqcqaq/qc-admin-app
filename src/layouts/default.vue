<template>
  <wd-config-provider :themeVars="theme">
    <slot />
    <wd-toast />
    <wd-message-box />
    <privacy-popup />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { theme } from '@/data/theme'
</script>
