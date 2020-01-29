<template>
    <v-container>
        <div>
            <v-text-field
                v-if="loading"
                color="blue darken-2"
                loading
                disabled
            ></v-text-field>
        </div>
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
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text>
                        <!-- {{ post.content }} -->
                        <viewer :value="post.content" />

                        <file-download :files="post.files"></file-download>
                    </v-card-text>
                </v-card>
                <v-card class="mt-2" outlined>
                    <v-list three-lines>
                        <v-list-item
                            v-for="(comment, idx) in post.comment"
                            :key="comment._id"
                        >
                            <template v-if="commentIdx != idx">
                                <v-list-item-content>
                                    <v-list-item-title class="subtitle-2"
                                        >{{ comment.writer
                                        }}<span class="ml-3">{{
                                            comment.created_date
                                        }}</span></v-list-item-title
                                    ><span class="mt-2 subtitle-1">
                                        {{ comment.content }}</span
                                    ></v-list-item-content
                                >
                                <v-btn
                                    icon
                                    small
                                    v-if="del_auth(comment.writer)"
                                    @click="showUpdateComment(comment, idx)"
                                >
                                    <v-icon>mdi-file-edit-outline</v-icon>
                                </v-btn>
                                <v-btn
                                    class="ml-2"
                                    icon
                                    small
                                    v-if="del_auth(comment.writer)"
                                    @click="showDeleteComment(comment)"
                                >
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                </v-btn>
                            </template>
                            <!-- 댓글 수정 -->
                            <template v-else>
                                <v-list-item-content>
                                    <v-list-item-title
                                        >{{ comment.writer
                                        }}<span class="ml-3">{{
                                            comment.created_date
                                        }}</span></v-list-item-title
                                    ><v-text-field
                                        v-model="editContent"
                                    ></v-text-field>
                                </v-list-item-content>
                                <v-btn
                                    icon
                                    small
                                    @click="updateCommentDialog.show = true"
                                >
                                    <v-icon>mdi-check-bold</v-icon>
                                </v-btn>
                                <v-btn
                                    class="ml-2"
                                    icon
                                    small
                                    @click="commentIdx = -1"
                                >
                                    <v-icon>mdi-close-outline</v-icon>
                                </v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
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
        <v-dialog v-model="deleteDialog.show" max-width="330">
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
        <v-dialog v-model="deletePostDialog.show" max-width="330">
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
                        v-model="commentContent"
                        label="Content"
                        counter
                        maxlength="2000"
                        full-width
                        single-line
                    ></v-textarea>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="createComment()">
                        Submit
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            writeCommentDialog.show = false
                            commentContent = ''
                        "
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="updateCommentDialog.show" max-width="330">
            <v-card>
                <v-card-title class="headline"
                    >댓글을 수정하시겠습니까?</v-card-title
                >

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            updateComment()
                            updateCommentDialog.show = false
                            commentIdx = -1
                        "
                    >
                        예
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="updateCommentDialog.show = false"
                    >
                        아니요
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { Viewer } from '@toast-ui/vue-editor'
import FileDownload from '../../components/file/FileDownload.vue'

export default {
    components: {
        Viewer,
        FileDownload,
    },
    data() {
        return {
            loading: true,
            post: {
                _id: '',
                title: '',
                content: '',
                author: '',
                created_date: '',
                comment: '',
                files: [],
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
            updateCommentDialog: {
                show: false,
                title: '',
            },
            temp_id: '',
            commentContent: '',
            flag: true,
            fetchCommentContent: '',
            editContent: '',
            commentIdx: '-1',
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
                    this.loading = false
                })
        },
        del_auth(writer) {
            if (this.$store.state.auth.user.username == writer) {
                return true
            } else {
                return false
            }
        },
        showDeleteComment(comment) {
            this.deleteDialog.show = true
            this.fetch_id(comment._id)
        },
        async del_comment(id) {
            await axios.delete(
                '/simple/posts/' + this.post._id + '/comment/' + id
            )
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

        async createComment() {
            await axios.post(
                '/simple/posts/' + this.$route.params.post_id + '/comment',
                {
                    content: this.commentContent,
                }
            )
            this.fetch_data()
            this.commentContent = ''
            this.writeCommentDialog.show = false
        },
        showUpdateComment(comment, idx) {
            this.commentIdx = idx
            this.fetchComment(comment.content)
            this.fetch_id(comment._id)
        },
        async updateComment() {
            this.fetchCommentContent = this.editContent
            await axios.patch(
                'simple/posts/' +
                    this.$route.params.post_id +
                    '/comment/' +
                    this.temp_id,
                {
                    content: this.fetchCommentContent,
                }
            )
            this.fetch_data()
            this.fetchCommentContent = ''
            this.updateCommentDialog.show = false
        },
        fetchComment(content) {
            this.editContent = content
        },
    },
}
</script>
