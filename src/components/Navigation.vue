<template>
  <nav class="navbar navbar-expand">
    <ul class="navbar-nav d-flex justify-content-around w-100">
      <li class="nav-item" v-for="link in navLinks" :key="link.to">
        <RouterLink :to="link.to" class="nav-link" active-class="active">
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
export default {
  name: 'NavigationComponent',
  data() {
    return {
      navLinks: [
        { to: '/', label: 'Timer' },
        { to: '/learn', label: 'Lernplan' },
        { to: '/pruefung', label: 'Prüfungen' },
        { to: '/add', label: 'Hinzufügen' },
      ],
    }
  },
}
</script>
