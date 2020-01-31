<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <v-btn @click="dialogTest">test</v-btn>
    </div>
</template>

<script>
export default {
    name: 'home',
    components: {},
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
