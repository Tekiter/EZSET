<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
                게시글 작성
                <v-spacer></v-spacer>
                <v-btn
                    class="ma-2"
                    tile
                    outlined
                    color="primary darken-2"
                    @click="back()"
                >
                    <v-icon left>mdi-arrow-left-circle</v-icon>
                    목록
                </v-btn>
            </v-card-title>
            <v-card-subtitle> 게시판: {{ curBoardName }}</v-card-subtitle>
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
                        color="primary darken-2"
                        @click="submitClick"
                    >
                        <v-icon left>mdi-pencil</v-icon> 작성
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
        <div>
            <v-dialog v-model="titleAlert" max-width="290">
                <v-card>
                    <v-card-title class="headline"
                        >제목을 입력해주세요.</v-card-title
                    >
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="titleAlert = false"
                        >
                            확인
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="contentAlert" max-width="290">
                <v-card>
                    <v-card-title class="headline"
                        >내용을 입력해주세요.</v-card-title
                    >
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="contentAlert = false"
                        >
                            확인
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="titleLengthAlert" max-width="290">
                <v-card>
                    <v-card-title class="headline"
                        >제목은 60자를 넘을 수 없습니다.</v-card-title
                    >
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="titleLengthAlert = false"
                        >
                            확인
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="backAlert" max-width="290">
                <v-card>
                    <v-card-title class="title"
                        >게시글 작성을 취소하시겠습니까?</v-card-title
                    >
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="red darken-2" text @click="answer = true">
                            예
                        </v-btn>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="backAlert = false"
                        >
                            아니오
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-container>
</template>
<script>
import axios from 'axios'
import { Editor } from '@toast-ui/vue-editor'
import FileUpload from '../../components/file/FileUpload'

export default {
    beforeRouteLeave(to, from, next) {
        if (this.certification) next()
        else this.nextConfirm(next)
    },
    components: {
        Editor,
        FileUpload,
    },
    data() {
        return {
            answer: false,
            backAlert: false,
            certification: false,
            title: '',
            titleAlert: false,
            content: '',
            titleLengthAlert: false,
            contentAlert: false,
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
        async nextConfirm(next) {
            const res = await this.$action.showConfirmDialog(
                '게시글 작성 취소',
                '작성을 취소하시겠습니까?'
            )
            if (res) {
                next()
            } else {
                next(false)
            }
        },
        back() {
            this.$router.push({
                path: '/board/' + this.$route.params.board_id,
            })
        },
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
            if (!this.title) {
                this.titleAlert = true
                return
            }
            if (!this.getMarkdown()) {
                this.contentAlert = true
                return
            }
            if (this.title.length > 60) {
                this.titleLengthAlert = true
                return
            }
            this.certification = true
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
                        onUploadProgress: e => {
                            this.uploadFile.currentProgress += Math.floor(
                                (e.loaded * 100) / e.total
                            )
                        },
                    })
                    this.uploadFile.currentProgress = 0
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
