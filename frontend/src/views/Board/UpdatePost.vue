<template>
    <v-container fluid>
        <div>
            <v-text-field
                v-if="loading"
                color="blue darken-2"
                loading
                disabled
            ></v-text-field>
        </div>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-toolbar-title class="d-flex justify-center"
            ><h3>
                <strong class="blue--text text--darken-2">게시글 수정</strong>
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
            <editor
                ref="editor"
                mode="wysiwyg"
                :options="editor.options"
                :value="content"
            />
        </v-form>
        <v-row>
            <v-col></v-col>
            <v-col></v-col>
            <v-col>
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
                        @click="updateClick"
                    >
                        <v-icon left>mdi-pencil</v-icon> UPDATE
                    </v-btn>
                </div>
            </v-col>
        </v-row>
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
            post_id: '',
            loading: true,
            editor: {
                options: {
                    language: 'ko',
                },
            },
        }
    },
    methods: {
        async fetchPost() {
            const res = await axios.get(
                '/simple/posts/' + this.$route.params.post_id
            )
            this.title = res.data.title
            this.content = res.data.content
            this.loading = false
        },
        clearClick() {
            this.$router.push({
                path: `/post/${this.$route.params.post_id}`,
            })
        },
        async updateClick() {
            const content = this.getMarkdown()

            await axios.put('/simple/posts/' + this.$route.params.post_id, {
                title: this.title,
                content: content,
                created_date: Date.now(),
            })
            this.$router.push(`/post/${this.$route.params.post_id}`)
        },
        getMarkdown() {
            return this.$refs.editor.invoke('getMarkdown')
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
