<template>
  <footer class="footer">
    <div class="container">
      <p>{{ profileContent.footerCopyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProfileContent } from '../../content/data/profile'
import { getSupportedLocale } from '../../content/locale'

const { locale } = useI18n()
const currentLocale = computed(() => getSupportedLocale(locale.value))
const profileContent = computed(() => getProfileContent(currentLocale.value))
</script>

<style scoped src="./Footer.css"></style>
