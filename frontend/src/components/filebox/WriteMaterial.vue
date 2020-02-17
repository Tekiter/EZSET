<template>
    <v-container>
        <v-card outlined>
            <v-card-title>게시물 작성</v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="newMaterial.title"
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
                        >게시물 작성에 실패했습니다.</small
                    >
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        :disabled="isLoading"
                        color="red"
                        @click="closeButtonClick"
                    >
                        <v-icon left>mdi-close</v-icon>작성 취소
                    </v-btn>
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        :disabled="isLoading"
                        color="blue darken-3"
                        @click="submitClick"
                    >
                        <v-icon left>mdi-pencil</v-icon>작성
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
    props: {
        parent_id: String,
    },
    data() {
        return {
            newMaterial: {
                title: '',
                content: '',
                author: '',
                created_date: '',
            },
            uploadFile: {
                selected: [],
                isUploading: false,
                currentProgress: 0,
                fileProgress: 0,
            },
            isLoading: false,
            isError: false,
            editor: {
                options: {
                    language: 'ko',
                },
            },
        }
    },
    methods: {
        async submitClick() {
            try {
                this.isLoading = true

                const content = this.getMarkdown()

                // 첨부파일 업로드
                const fileIds = await this.uploadFiles()

                await axios.post('/filebox/folder/' + this.parent_id, {
                    title: this.newMaterial.title,
                    content: content,
                    files: fileIds,
                    parent_id: this.parent_id,
                })
                this.$emit('close')
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
        closeButtonClick() {
            this.$emit('close')
        },
    },
}
</script>
