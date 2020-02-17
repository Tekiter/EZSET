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
            await this.$action.showConfirmDialog('hello', 'world!', {
                yesButton: '확인',
            })
            //
        },
    },
}
</script>
