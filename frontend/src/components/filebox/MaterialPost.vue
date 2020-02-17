<template>
    <v-data-iterator :items="items" :loading="isloading">
        <template v-slot:loading>
            <v-row class="mx-2">
                <v-col v-for="i in 6" :key="i" cols="12" md="6">
                    <v-skeleton-loader type="article" class="mx-auto"></v-skeleton-loader>
                </v-col>
            </v-row>
        </template>
        <template v-slot:default="props">
            <v-row class="mx-2">
                <v-col v-for="material in props.items" :key="material.id" cols="12" md="6">
                    <material-post-item :options="material"></material-post-item>
                </v-col>
            </v-row>
        </template>
    </v-data-iterator>
</template>
<script>
import MaterialPostItem from '../../components/filebox/MaterialPostItem.vue'
import Axios from 'axios'
export default {
    name: 'MaterialPost',
    components: {
        MaterialPostItem,
    },
    props: {
        folderId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            items: [],
            isloading: true,
        }
    },
    methods: {
        async patch() {
            this.isloading = true
            const res = await Axios.get('/filebox/folder/' + this.folderId)
            this.items = res.data.materials
            this.isloading = false
        },
    },
    async created() {
        this.patch()
    },
    watch: {
        async folderId(val) {
            this.patch()
        },
    },
}
</script>