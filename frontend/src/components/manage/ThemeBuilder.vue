<template>
    <v-list>
        <v-list-item>
            <v-text-field v-model="asdf" v-color:primary></v-text-field>
        </v-list-item>
    </v-list>
</template>
<script>
export default {
    data: () => ({
        asdf: '',
    }),
    created() {
        console.log(this.$vuetify.theme.themes)
    },
}
</script>
