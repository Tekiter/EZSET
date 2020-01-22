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
                <div class="d-flex mt-3">
                    <v-spacer></v-spacer>
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        color="blue darken-3"
                        @click="submitClick"
                    >
                        <v-icon left>mdi-pencil</v-icon> 작성
                    </v-btn>
                </div>
                <!-- <div class="row">
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col">
                        <div class="d-flex flex-row-reverse">
                            <v-btn
                                class="ma-2"
                                tile
                                outlined
                                color="blue darken-3"
                                @click="clearClick"
                            >
                                <v-icon left>mdi-keyboard-backspace</v-icon>
                                CLEAR
                            </v-btn>
                            <v-btn
                                class="ma-2"
                                tile
                                outlined
                                color="blue darken-3"
                                @click="submitClick"
                            >
                                <v-icon left>mdi-pencil</v-icon> SUBMIT
                            </v-btn>
                        </div>
                    </div>
                </div> -->
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import axios from 'axios'
import { Editor } from '@toast-ui/vue-editor'

export default {
    components: {
        Editor,
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
            editor: {
                options: {
                    language: 'ko',
                },
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
                const content = this.getMarkdown()

                await axios.post(
                    '/simple/boards/' + this.$route.params.board_id,
                    {
                        title: this.title,
                        content: content,
                        author: this.author,
                        created_date: this.created_date,
                        like: 0,
                        view: 0,
                        comment: '',
                        _id: this._id,
                    }
                )
                this.$router.push({
                    path: `/board/${this.$route.params.board_id}`,
                })
            } catch (error) {
                //
            }
        },
        getMarkdown() {
            return this.$refs.editor.invoke('getMarkdown')
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
