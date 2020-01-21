<template>
    <v-container fluid>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-toolbar-title class="d-flex justify-center"
            ><h3>
                <strong class="blue--text text--darken-2">게시글 작성</strong>
            </h3></v-toolbar-title
        >
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-form>
            <v-text-field
                v-model="title"
                label="Title"
                single-line
                full-width
                hide-details
            ></v-text-field>
            <v-divider></v-divider>
            <!-- <v-textarea
                v-model="content"
                label="Content"
                counter
                maxlength="2000"
                full-width
                single-line
            ></v-textarea> -->
            <editor ref="editor" mode="wysiwyg" :options="editor.options" />
        </v-form>
        <div class="row">
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
                        <v-icon left>mdi-keyboard-backspace</v-icon> CLEAR
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
        </div>
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
            editor: {
                options: {
                    language: 'ko',
                },
            },
        }
    },
    methods: {
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
}
</script>
