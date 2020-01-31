<template>
    <v-container>
        <template v-if="loading">
            <v-skeleton-loader
                type="article, list-item-two-line, list-item-three-line, actions"
            ></v-skeleton-loader>
            <v-list class="mt-3">
                <v-skeleton-loader
                    v-for="i in 3"
                    :key="`loader-${i}`"
                    type="list-item-three-line"
                ></v-skeleton-loader>
            </v-list>
        </template>
        <v-fade-transition>
            <v-row v-if="!loading">
                <v-col>
                    <v-card outlined>
                        <v-card-title>{{ post.title }}</v-card-title>
                        <!-- <v-subheader class="row">
                            <div class="col" v-if="post.isAnonymous == false">
                                작성자 {{ post.author }}
                            </div>
                            <div class="col" v-else>작성자 {{ '익명' }}</div>
                            <div class="col">
                                <p>작성일 {{ post.created_date }}</p>
                            </div>
                        </v-subheader> -->
                        <v-card-subtitle class="mt-0">
                            <v-row no-gutters>
                                <span v-if="post.isAnonymous == false"
                                    ><span class="font-weight-black"
                                        >작성자</span
                                    >
                                    {{ post.author }}</span
                                >
                                <span v-else>익명</span>
                                <v-spacer></v-spacer>
                                <span
                                    ><span class="font-weight-black"
                                        >작성일</span
                                    >
                                    {{ post.created_date }}</span
                                ><v-divider class="mx-4" vertical></v-divider>
                                <span
                                    ><span class="font-weight-black"
                                        >조회수</span
                                    >
                                    {{ post.view }}</span
                                ><v-divider class="mx-4" vertical></v-divider>

                                <span
                                    ><span class="font-weight-black">추천</span>
                                    {{ post.like }}</span
                                >
                            </v-row>
                        </v-card-subtitle>
                        <v-divider></v-divider>
                        <v-card-text>
                            <!-- {{ post.content }} -->
                            <viewer :value="post.content" />

                            <file-download :files="post.files"></file-download>

                            <div class="d-flex flex-row-reverse">
                                <v-btn
                                    class="ma-2"
                                    tile
                                    outlined
                                    color="red darken-1"
                                    v-if="!authorLike"
                                    @click="clickLike()"
                                >
                                    <v-icon>mdi-heart-multiple</v-icon>
                                    좋아요
                                </v-btn>
                                <v-btn
                                    class="ma-2"
                                    tile
                                    outlined
                                    color="black"
                                    v-else
                                    @click="clickLike()"
                                >
                                    <v-icon>mdi-heart-off</v-icon>
                                    취소
                                </v-btn>
                                <v-btn
                                    class="ma-2"
                                    tile
                                    outlined
                                    color="black"
                                    v-if="del_auth(post.author)"
                                    @click="deletePost"
                                >
                                    <v-icon>mdi-trash-can</v-icon> 삭제하기
                                </v-btn>
                                <v-btn
                                    class="ma-2"
                                    tile
                                    outlined
                                    color="green darken-2"
                                    v-if="del_auth(post.author)"
                                    @click="go_modify()"
                                >
                                    <v-icon left>mdi-autorenew</v-icon> 수정하기
                                </v-btn>
                                <v-btn
                                    class="ma-2"
                                    tile
                                    outlined
                                    color="blue darken-3"
                                >
                                    <v-icon left>mdi-post</v-icon>
                                    목록
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card class="mt-2" outlined>
                        <v-list three-lines>
                            <template v-for="(comment, idx) in post.comment">
                                <v-list-item :key="comment._id">
                                    <template v-if="commentIdx != idx">
                                        <v-list-item-content>
                                            <v-list-item-title
                                                v-if="post.isAnonymous == true"
                                                class="subtitle-2"
                                                >{{ '익명'
                                                }}<span class="ml-3">{{
                                                    comment.created_date
                                                }}</span></v-list-item-title
                                            >
                                            <v-list-item-title
                                                v-else
                                                class="subtitle-2"
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
                                            @click="
                                                showUpdateComment(comment, idx)
                                            "
                                        >
                                            <v-icon
                                                >mdi-file-edit-outline</v-icon
                                            >
                                        </v-btn>
                                        <v-btn
                                            class="ml-2"
                                            icon
                                            small
                                            v-if="del_auth(comment.writer)"
                                            @click="showDeleteComment(comment)"
                                        >
                                            <v-icon
                                                >mdi-trash-can-outline</v-icon
                                            >
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
                                            @click="updateComment(comment)"
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
                                <v-divider
                                    :key="`comment-divider-${idx}`"
                                ></v-divider>
                            </template>
                            <v-list-item>
                                <v-list-item-content>
                                    <!-- <v-list-item-title>댓글 작성</v-list-item-title> -->
                                    <v-text-field
                                        v-model="writeComment.content"
                                        :loading="writeComment.isLoading"
                                        class="flex-grow-1"
                                        hide-details
                                        outlined
                                        dense
                                    ></v-text-field>
                                    <div class="d-flex mt-2 align-center">
                                        <v-spacer></v-spacer>
                                        <small
                                            class="red--text mr-2"
                                            v-if="writeComment.isError"
                                            >댓글 작성에 오류가
                                            발생했습니다.</small
                                        >
                                        <v-btn
                                            outlined
                                            @click="createComment()"
                                            :disabled="writeComment.isLoading"
                                            >댓글 작성</v-btn
                                        >
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </v-fade-transition>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { Viewer } from '@toast-ui/vue-editor'
import FileDownload from '../../components/file/FileDownload.vue'
import crypto from 'crypto'

export default {
    components: {
        Viewer,
        FileDownload,
    },
    data() {
        return {
            authorLike: false,
            loading: true,
            post: {
                _id: '',
                title: '',
                content: '',
                author: '',
                isAnonymous: '',
                created_date: '',
                comment: '',
                files: [],
                view: '',
                like: [],
            },
            writeComment: {
                content: '',
                isLoading: false,
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
        clickLike() {
            this.authorLike = !this.authorLike
        },
        go_modify() {
            this.$router.push(`/update/${this.$route.params.post_id}`)
        },
        async fetch_data() {
            const res = await axios.get(
                '/simple/posts/' + this.$route.params.post_id
            )

            this.post = res.data
            this.post.created_date = moment(res.data.created_date).format(
                'YYYY/MM/DD HH:MM'
            )
            console.log(this.post.view)
            console.log(res.data.view)
            this.comment = res.data.comment.map(comment => {
                comment.created_date = moment(comment.created_date).format(
                    'YYYY/MM/DD HH:MM'
                )
            })
            this.loading = false
        },
        del_auth(writer) {
            if (this.post.isAnonymous == true) {
                if (
                    crypto
                        .createHash('sha512')
                        .update(this.$store.state.auth.user.username)
                        .digest('base64') == writer
                ) {
                    return true
                } else {
                    return false
                }
            } else {
                if (this.$store.state.auth.user.username == writer) {
                    return true
                } else {
                    return false
                }
            }
        },
        async showDeleteComment(comment) {
            const res = await this.$action.showConfirmDialog(
                '댓글 삭제',
                '댓글을 삭제하시겠습니까?'
            )
            if (res) {
                await axios.delete(
                    '/simple/posts/' + this.post._id + '/comment/' + comment._id
                )
                this.fetch_data()
            }
        },
        async deletePost() {
            const res = await this.$action.showConfirmDialog(
                '게시글 삭제',
                '게시글을 삭제하시겠습니까?'
            )
            if (res) {
                axios.delete('/simple/posts/' + this.post._id)
                this.$router.push({
                    path: `/`,
                })
            }
        },
        delPost() {
            axios.delete('/simple/posts/' + this.post._id)
            this.$router.push({
                path: `/`,
            })
        },
        fetch_id(id) {
            this.temp_id = id
        },

        async createComment() {
            this.writeComment.isLoading = true
            try {
                await axios.post(
                    '/simple/posts/' + this.$route.params.post_id + '/comment',
                    {
                        content: this.writeComment.content,
                    }
                )
                await this.fetch_data()
                this.writeComment.content = ''
            } catch (error) {
                this.writeComment.isError = true
            } finally {
                this.writeComment.isLoading = false
            }
        },
        showUpdateComment(comment, idx) {
            this.commentIdx = idx
            this.fetchComment(comment.content)
            this.fetch_id(comment._id)
        },
        async updateComment(comment) {
            await axios.patch(
                'simple/posts/' +
                    this.$route.params.post_id +
                    '/comment/' +
                    comment._id,
                {
                    content: this.editContent,
                }
            )
            this.fetch_data()
        },
        fetchComment(content) {
            this.editContent = content
        },
    },
}
</script>
