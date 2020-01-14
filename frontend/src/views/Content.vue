<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <v-card outlined>
                        <v-card-title class="pb-5"
                            >제목 {{ post.title }}</v-card-title
                        >
                        <v-card-subtitle class="row">
                            <div class="col">작성자 {{ post.author }}</div>
                            <div class="col">
                                <div class="justify-center">
                                    <p>작성일 {{ post.created_date }}</p>
                                </div>
                            </div>
                        </v-card-subtitle>
                        <v-card-text>{{ post.content }}</v-card-text>
                    </v-card>
                    <v-card outlined>
                        <v-col
                            v-for="comment in post.comment"
                            :key="comment._id"
                        >
                            <v-card class="row pl-5" flat>
                                <p class="bold">{{ comment.writer }}</p>
                                <p class="caption">
                                    {{ comment.created_date }}
                                </p>
                            </v-card>
                            <v-card class="row pl-5" flat>
                                <v-card class="col" flat>{{
                                    comment.content
                                }}</v-card>
                                <v-btn
                                    icon
                                    small
                                    v-if="del_comment(comment.writer)"
                                >
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                </v-btn>
                            </v-card>
                        </v-col>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data() {
        return {
            post: {
                title: '',
                content: '',
                author: '',
                created_date: '',
                comment: '',
            },
        }
    },
    mounted() {
        axios.get('/simple/posts/' + this.$route.params.post_id).then(res => {
            this.post = res.data
            console.log(res.data)
            this.post.created_date = moment(res.data.created_date).format(
                'YYYY/MM/DD HH:MM'
            )
            this.comment = res.data.comment.map(comment => {
                comment.created_date = moment(comment.created_date).format(
                    'YYYY/MM/DD HH:MM'
                )
            })
        })
    },
    methods: {
        del_comment(writer) {
            if (this.$store.state.auth.user.username == writer) {
                return true
            } else {
                return false
            }
        },
    },
}
</script>
