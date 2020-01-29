<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
                게시글 수정
            </v-card-title>
            <!-- <v-card-subtitle> 게시판: {{ curBoardName }} </v-card-subtitle> -->
            <v-card-text>
                <v-text-field
                    v-model="title"
                    label="제목"
                    hide-details
                    class="mb-4"
                ></v-text-field>
                <editor
                    ref="editor"
                    mode="wysiwyg"
                    :options="editor.options"
                    :value="content"
                />
                <file-upload
                    v-model="uploadFile.selected"
                    :uploaded="uploadFile.uploaded"
                    :currentProgress="uploadFile.currentProgress"
                    :fileProgress="uploadFile.fileProgress"
                    :uploading="uploadFile.isUploading"
                    class="mt-3"
                ></file-upload>
                <div class="d-flex mt-3">
                    <v-spacer></v-spacer>
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        color="blue darken-3"
                        @click="updateClick"
                    >
                        <v-icon left>mdi-pencil</v-icon> 수정
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import axios from 'axios'
import { Editor } from '@toast-ui/vue-editor'
import fileUpload from '../../components/file/FileUpload.vue'

export default {
    components: {
        Editor,
        fileUpload,
    },
    data() {
        return {
            title: '',
            content: '',
            author: '',
            created_date: '',
            post_id: '',
            loading: true,
            curBoardName: '',
            editor: {
                options: {
                    language: 'ko',
                },
            },
            uploadFile: {
                selected: [],
                uploaded: [],
                isLoading: false,
                isUploading: false,
                currentProgress: 0,
                fileProgress: 0,
            },
        }
    },
    methods: {
        async getBoards() {
            const res = await axios.get('simple/boards')
            return res.data
        },
        async fetchPost() {
            const res = await axios.get(
                '/simple/posts/' + this.$route.params.post_id
            )
            this.title = res.data.title
            this.content = res.data.content

            this.uploadFile.uploaded = res.data.files.map(file => {
                return {
                    filename: file.filename,
                    id: file.id,
                }
            })

            this.loading = false
        },
        clearClick() {
            this.$router.push({
                path: `/post/${this.$route.params.post_id}`,
            })
        },
        async updateClick() {
            const content = this.getMarkdown()

            const fileIds = await this.uploadFiles()

            await axios.patch('/simple/posts/' + this.$route.params.post_id, {
                title: this.title,
                content: content,
                files: fileIds,
            })
            this.$router.push(`/post/${this.$route.params.post_id}`)
        },
        getMarkdown() {
            return this.$refs.editor.invoke('getMarkdown')
        },
        async uploadFiles() {
            const fileIds = []

            const fileCount = this.uploadFile.selected.length

            if (fileCount > 0) {
                this.uploadFile.isUploading = true
                this.uploadFile.fileProgress = 0

                for (let file of this.uploadFile.selected) {
                    if (file.uploaded) {
                        fileIds.push(file.id)
                        // this.uploadFile.fileProgress += 1
                        continue
                    }
                    let form = new FormData()
                    form.append('file', file.file)
                    this.uploadFile.currentProgress = 0

                    const res = await axios.post('file/upload', form, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        // 진행상황 반영
                        onUploadProgress(e) {
                            this.uploadFile.currentProgress += Math.floor(
                                (e.loaded * 100) / e.total
                            )
                        },
                    })
                    this.uploadFile.fileProgress += 1
                    fileIds.push(res.data.id)
                }
                this.uploadFile.isLoading = false
            }
            return fileIds
        },
    },
    async created() {
        await this.fetchPost()
    },
    watch: {
        async $route(to, from) {
            await this.fetchPost()
        },
    },
}
</script>
