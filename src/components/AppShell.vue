<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <div>
    <header style="position:sticky;top:0;z-index:40;border-bottom:1px solid var(--header-border);
                   backdrop-filter:saturate(180%) blur(8px); background:var(--header-bg)">
      <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;">
        <div class="h1">Мои проекты</div>
        <nav class="row">
          <RouterLink class="btn btn--outline" to="/">Список проектов</RouterLink>
          <RouterLink class="btn btn--solid" to="/projects/add">Добавить проект</RouterLink>
          <ThemeToggle/>
        </nav>
      </div>
    </header>

    <main class="container sp-8">
      <slot/>
    </main>
  </div>
</template>
