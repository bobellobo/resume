<template>
  <footer class="footer">
    <div class="container">
      <p>{{ $t('footer.copyright') }}</p>
      <div class="social-links">
        <a href="#">{{ $t('footer.links.linkedin') }}</a>
        <a href="#">{{ $t('footer.links.github') }}</a>
        <a href="#">{{ $t('footer.links.twitter') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped src="./Footer.css"></style>
