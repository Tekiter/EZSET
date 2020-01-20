<template>
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
                    <v-col v-for="comment in post.comment" :key="comment._id">
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
                                v-if="del_auth(comment.writer)"
                                @click="
                                    deleteDialog.show = true
                                    fetch_id(comment._id)
                                "
                            >
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </v-card>
                    </v-col>
                </v-card>
            </v-col>
        </v-row>
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
                        v-if="del_auth(post.author)"
                        @click="deletePostDialog.show = true"
                    >
                        <v-icon>mdi-trash-can</v-icon> 삭제하기
                    </v-btn>
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        color="blue darken-3"
                        @click="go_modify()"
                    >
                        <v-icon left>mdi-autorenew</v-icon> 수정하기
                    </v-btn>
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        color="blue darken-3"
                        @click="writeCommentDialog.show = true"
                    >
                        <v-icon>mdi-comment-outline</v-icon> 댓글작성
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="deleteDialog.show" max-width="290">
            <v-card>
                <v-card-title class="headline"
                    >댓글을 삭제하시겠습니까?</v-card-title
                >

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            del_comment(temp_id)
                            deleteDialog.show = false
                        "
                    >
                        예
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="deleteDialog.show = false"
                    >
                        아니요
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deletePostDialog.show" max-width="290">
            <v-card>
                <v-card-title class="headline"
                    >글을 삭제하시겠습니까?</v-card-title
                >

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            delPost()
                            deletePostDialog.show = false
                        "
                    >
                        예
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="deletePostDialog.show = false"
                    >
                        아니요
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="writeCommentDialog.show" max-width="450">
            <v-card>
                <v-card-title class="headline">댓글 작성</v-card-title>
                <v-form>
                    <v-textarea
                        v-model="content"
                        label="Content"
                        counter
                        maxlength="2000"
                        full-width
                        single-line
                    ></v-textarea>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            comment.content = content
                            writeComment()
                            writeCommentDialog.show = false
                        "
                    >
                        Submit
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="writeCommentDialog.show = false"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data() {
        return {
            post: {
                _id: '',
                title: '',
                content: '',
                author: '',
                created_date: '',
                comment: '',
            },
            deleteDialog: {
                show: false,
                title: '',
            },
            deletePostDialog: {
                show: false,
                title: '',
            },
            writeCommentDialog: {
                show: false,
                title: '',
            },
            temp_id: '',
            comment: {
                content: '',
            },
        }
    },
    mounted() {
        this.fetch_data()
    },

    methods: {
        go_modify() {
            this.$router.push(`/update/${this.$route.params.post_id}`)
        },
        fetch_data() {
            axios
                .get('/simple/posts/' + this.$route.params.post_id)
                .then(res => {
                    this.post = res.data
                    console.log(res.data)
                    this.post.created_date = moment(
                        res.data.created_date
                    ).format('YYYY/MM/DD HH:MM')
                    this.comment = res.data.comment.map(comment => {
                        comment.created_date = moment(
                            comment.created_date
                        ).format('YYYY/MM/DD HH:MM')
                    })
                })
        },
        del_auth(writer) {
            if (this.$store.state.auth.user.username == writer) {
                return true
            } else {
                return false
            }
        },
        del_comment(id) {
            axios.delete('/simple/posts/' + this.post._id + '/comment/' + id)
            this.fetch_data()
        },
        delPost() {
            axios.delete('/simple/posts/' + this.post._id)
            this.$router.push({
                path: `/board`,
            })
        },
        fetch_id(id) {
            this.temp_id = id
        },
        writeComment() {
            axios.post(
                '/simple/posts/' + this.$route.params.post_id + '/comment',
                {
                    content: this.comment.content,
                }
            )
            this.fetch_data()
        },
    },
}
</script>
