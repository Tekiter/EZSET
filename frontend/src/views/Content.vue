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
                            <v-card outlined>{{ comment.content }}</v-card>
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
                'YY/MM/DD HH:MM'
            )
            return this.post.created_date
        })
    },
}
</script>
