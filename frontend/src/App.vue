<template>
    <div v-if="!isLoading">
        <general-layout v-if="!$route.meta.layout"></general-layout>

        <empty-layout v-else-if="$route.meta.layout == 'empty'"></empty-layout>

        <router-view v-else></router-view>
    </div>
    <v-app v-else>
        <v-content>
            <div class="d-flex justify-center align-center" style="height: 100%">
                <v-progress-circular indeterminate color="blue" size="50"></v-progress-circular>
            </div>
        </v-content>
    </v-app>
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
        return {
            isLoading: true,
        }
    },
    async created() {
        this.isLoading = true

        if (this.$store.getters['auth/isLoggedIn']) {
            await this.$store.dispatch('role/fetchPermission')
        }
        // 권한 목록 가져오기

        this.isLoading = false
    },
}
</script>
