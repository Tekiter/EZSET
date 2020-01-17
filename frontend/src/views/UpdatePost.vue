<template>
    <v-container fluid>
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
            <v-textarea
                v-model="content"
                label="Content"
                counter
                maxlength="2000"
                full-width
                single-line
            ></v-textarea>
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
export default {
    data() {
        return {
            title: '',
            content: '',
            author: '',
            created_date: '',
            post_id: '',
        }
    },
    methods: {
        clearClick() {
            this.$router.push({
                path: `/post/${this.$route.params.post_id}`,
            })
        },
        updateClick() {
            axios
                .put('/simple/posts/' + this.$route.params.post_id, {
                    title: this.title,
                    content: this.content,
                    created_date: Date.now(),
                })
                .then(res => {
                    console.log(res)
                    this.$router.push(`/post/${this.$route.params.post_id}`)
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    mounted() {
        axios.get('/simple/posts/' + this.$route.params.post_id).then(res => {
            console.log(res.data)
            this.title = res.data.title
            this.content = res.data.content
        })
    },
}
</script>
