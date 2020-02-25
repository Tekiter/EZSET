<template>
    <div>
        <div class="text-center">
            <v-btn
                class="mx-2"
                block
                dark
                large
                color="cyan"
                @click="showCreateMaterial()"
            >
                Upload
                <v-icon right dark>mdi-cloud-upload</v-icon>
            </v-btn>
        </div>
        <v-data-iterator :items="items" :loading="isloading">
            <template v-slot:loading>
                <v-row class="mx-2">
                    <v-col v-for="i in 6" :key="i" cols="12" md="6">
                        <v-skeleton-loader
                            type="article"
                            class="mx-auto"
                        ></v-skeleton-loader>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:default="props">
                <v-row class="mx-2">
                    <v-col
                        v-for="material in props.items"
                        :key="material.id"
                        cols="12"
                        md="6"
                    >
                        <material-post-item
                            :options="material"
                            @delete="fetch()"
                            @editMaterial="editMaterial"
                        ></material-post-item>
                    </v-col>
                </v-row>
            </template>
        </v-data-iterator>
    </div>
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
        async fetch() {
            this.isloading = true
            const res = await Axios.get('/filebox/folder/' + this.folderId)
            this.items = res.data.materials
            this.isloading = false
        },
        async editMaterial(options) {
            console.log(options)
            try {
                this.$router.push({
                    name: 'fileBoxEditMaterial',
                    params: {
                        folder_id: this.$route.params.folder_id,
                        material_id: options.id,
                    },
                })
            } catch {
                //
            }
        },
        async showCreateMaterial() {
            this.$router.push({
                name: 'fileBoxWriteMaterial',
                params: {
                    folder_id: this.$route.params.folder_id,
                },
            })
        },
    },
    async created() {
        await this.fetch()
    },
    watch: {
        async folderId(val) {
            await this.fetch()
        },
    },
}
</script>
