<template>
    <div>
        <div class="text-center" v-if="canUpload()">
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
        <v-data-iterator
            :items="items"
            :loading="isloading"
            :page="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
        >
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
            <template v-slot:no-data>
                <v-row>
                    <v-col>
                        <v-container class="text-center">
                            게시글이 존재하지 않습니다
                        </v-container>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:footer>
                <pagination-footer
                    v-model="page"
                    :item-count="items.length"
                    :items-per-page.sync="itemsPerPage"
                    :itemsPerPageExample="[6, 20, 60, 100]"
                />
            </template>
        </v-data-iterator>
    </div>
</template>
<script>
import MaterialPostItem from '../../components/filebox/MaterialPostItem.vue'
import PaginationFooter from '../../components/misc/PaginationFooter.vue'
import Axios from 'axios'
export default {
    name: 'MaterialPost',
    components: {
        MaterialPostItem,
        PaginationFooter,
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
            page: 1,
            itemsPerPage: 6,
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
        canUpload() {
            if (
                this.$perm('fileBox').can('manage') ||
                this.$perm('fileBox').can('upload')
            )
                return true
            else return false
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
