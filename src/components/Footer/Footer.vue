<template>
  <footer class="footer">
    <div class="container">
      <p>{{ $t('footer.copyright') }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped src="./Footer.css"></style>
