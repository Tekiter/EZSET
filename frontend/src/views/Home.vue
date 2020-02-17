<template>
    <div class="home">
        <DefaultMainPage></DefaultMainPage>
    </div>
</template>

<script>
import DefaultMainPage from '../components/manage/DefaultMainPage.vue'

export default {
    name: 'home',
    components: { DefaultMainPage },
    methods: {
        async dialogTest() {
            const res = await this.$action.showConfirmDialog(
                'hello',
                'world!',
                { yesButton: '확인' }
            )
            console.log(res)
        },
    },
}
</script>
