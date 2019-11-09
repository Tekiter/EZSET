<template>
    <general-layout v-if="!$route.meta.layout"></general-layout>

    <empty-layout v-else-if="$route.meta.layout == 'empty'"></empty-layout>

    <router-view v-else></router-view>
</template>

<script>
import GeneralLayout from './components/layout/General.vue'
import EmptyLayout from './components/layout/Empty.vue'

export default {
    name: 'App',
    components: {
        GeneralLayout,
        EmptyLayout,
    },
    data() {
        return {}
    },
}
</script>
