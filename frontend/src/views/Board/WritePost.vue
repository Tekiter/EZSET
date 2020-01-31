<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
                게시글 작성
            </v-card-title>
            <v-card-subtitle> 게시판: {{ curBoardName }} </v-card-subtitle>
            <v-card-text>
                <v-text-field
                    v-model="title"
                    label="제목"
                    hide-details
                    class="mb-4"
                ></v-text-field>
                <editor ref="editor" mode="wysiwyg" :options="editor.options" />
                <file-upload
                    v-model="uploadFile.selected"
                    :currentProgress="uploadFile.currentProgress"
                    :fileProgress="uploadFile.fileProgress"
                    :uploading="uploadFile.isUploading"
                    class="mt-3"
                ></file-upload>
                <div class="d-flex align-center mt-3">
                    <v-spacer></v-spacer>
                    <small class="red--text mr-3" v-if="isError"
                        >게시글 작성에 실패했습니다.</small
                    >
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        :disabled="isLoading"
                        color="black"
                        @click="submitClick"
                    >
                        <v-icon left>mdi-pencil</v-icon> 작성
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import axios from 'axios'
import { Editor } from '@toast-ui/vue-editor'
import FileUpload from '../../components/file/FileUpload'

export default {
    components: {
        Editor,
        FileUpload,
    },
    data() {
        return {
            title: '',
            content: '',
            author: '',
            created_date: '',
            like: '',
            view: '',
            comment: '',
            curBoardName: '',
            isLoading: false,
            isError: false,
            editor: {
                options: {
                    language: 'ko',
                },
            },

            uploadFile: {
                selected: [],
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
        clearClick() {
            this.$router.push({
                path: `/board/${this.$route.params.board_id}`,
            })
        },
        async submitClick() {
            try {
                this.isLoading = true

                const content = this.getMarkdown()

                // 첨부파일 업로드
                const fileIds = await this.uploadFiles()

                await axios.post(
                    '/simple/boards/' + this.$route.params.board_id,
                    {
                        title: this.title,
                        content: content,
                        files: fileIds,
                    }
                )
                this.$router.push({
                    path: `/board/${this.$route.params.board_id}`,
                })
            } catch (error) {
                this.isError = true
            } finally {
                this.isLoading = false
            }
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

                this.uploadFile.isUploading = true
            }

            return fileIds
        },
    },
    async created() {
        const boards = await this.getBoards()

        const id = this.$route.params.board_id

        for (let board of boards) {
            if (board._id == id) {
                this.curBoardName = board.title
                break
            }
        }
    },
}
</script>
