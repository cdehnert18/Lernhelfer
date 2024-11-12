<template>
    <div class="navbar rounded-3 mb-2 d-flex p-1">
        <button @click="changePage('timer')" :class="{ 'btn-outline-primary': page === 'timer' }" class="btn flex-fill">Timer</button>
        <button @click="changePage('lernplan')" :class="{ 'btn-outline-primary': page === 'lernplan' }" class="btn flex-fill">Lernplan</button>
        <button @click="changePage('pruefungsplan')" :class="{ 'btn-outline-primary': page === 'pruefungsplan' }" class="btn flex-fill">Prüfungsplan</button>
        <button @click="changePage('add')" :class="{ 'btn-outline-primary': page === 'add' }" class="btn flex-fill">Hinzufügen</button>
    </div>
</template>

<script>
    export default {
        name: 'Navigation',
        data() {
            return {
                page: 'timer'
            };
        },
        methods: {
            changePage(page) {
                this.page = page;
                switch (page) {
                    case 'timer':
                        this.$router.push({ name: 'timer' });
                        break;
                    case 'lernplan':
                        this.$router.push({ name: 'learn' });
                        break;
                    case 'pruefungsplan':
                        this.$router.push({ name: 'pruefung' });
                        break;
                    case 'add':
                        this.$router.push({ name: 'hinzufuegen' });
                        break;
                }
            }
        }
    }
</script>

<style scoped>
    .navbar {
        height: 50px;
    }
</style>