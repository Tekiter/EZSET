<template>
    <div>
        <!-- <div>
            <v-text-field
                v-if="loading"
                color="blue darken-2"
                loading
                disabled
            ></v-text-field>
        </div> -->
        <v-container grid-list-md>
            <v-row>
                <v-col cols="12" sm="2"></v-col>
                <v-col cols="12" sm="8" class="d-flex justify-center">
                    <strong
                        v-if="$vuetify.breakpoint.mdAndUp"
                        class="font-weight-medium display-2"
                        >{{ board.title }}</strong
                    >
                    <strong v-else class="font-weight-medium title">{{
                        board.title
                    }}</strong>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="select"
                        :items="viewCount"
                        item-text="state"
                        item-value="value"
                        persistent-hint
                        return-object
                        style="width: 100px"
                        @change="clickSelect"
                    ></v-select
                ></v-col>
            </v-row>
            <v-card outlined>
                <v-data-table
                    v-if="$vuetify.breakpoint.mdAndUp"
                    :headers="headers"
                    :items="posts"
                    :page.sync="page"
                    :loading="loading"
                    :server-items-length="totalpage"
                    :options.sync="options"
                    @update:items-per-page="fetchPostList()"
                    :items-per-page.sync="select.value"
                    hide-default-footer
                    :mobile-breakpoint="NaN"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }} [{{
                                props.item.comment_count
                            }}]
                        </a>
                    </template>
                </v-data-table>
                <v-list v-else>
                    <v-list-item v-for="post in posts" :key="post.title">
                        <v-list-item-content>
                            <v-list-item-title
                                ><a @click="read(post)" class="title"
                                    >{{ post.title }} [{{
                                        post.comment_count
                                    }}]</a
                                >
                                <v-spacer></v-spacer>
                                <v-icon x-small color="red darken-3"
                                    >mdi-heart-multiple</v-icon
                                >
                                {{ post.like }}
                            </v-list-item-title>
                            {{ post.author
                            }}<v-divider class="mx-4" vertical></v-divider>
                            {{ post.created_date
                            }}<v-divider class="mx-4" vertical></v-divider> 조회
                            {{ post.view }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
            <v-row v-if="$vuetify.breakpoint.mdAndUp">
                <v-col cols="2"></v-col>
                <v-col cols="8">
                    <v-pagination
                        v-model="page"
                        :length="pageCount"
                        :items-per-page.sync="page"
                    ></v-pagination>
                </v-col>
                <v-col cols="2">
                    <div class="d-flex flex-row-reverse">
                        <v-btn
                            class="ma-2"
                            tile
                            outlined
                            color="primary darken-2"
                            :to="'/searchpost'"
                        >
                            <v-icon left>mdi-magnify</v-icon> 검색
                        </v-btn>
                        <v-btn
                            class="ma-2"
                            tile
                            outlined
                            color="primary darken-2"
                            :to="'/write/' + curid"
                        >
                            <v-icon left>mdi-pencil</v-icon> 글쓰기
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
            <div v-else>
                <v-row>
                    <v-col>
                        <v-pagination
                            v-model="page"
                            :length="pageCount"
                            :items-per-page.sync="page"
                        ></v-pagination>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div class="d-flex flex-row-reverse">
                            <v-btn
                                class="ma-2"
                                tile
                                outlined
                                color="black darken-2"
                                :to="'/searchpost'"
                            >
                                <v-icon left>mdi-magnify</v-icon> 검색
                            </v-btn>
                            <v-btn
                                class="ma-2"
                                tile
                                outlined
                                color="black darken-2"
                                :to="'/write/' + curid"
                            >
                                <v-icon left>mdi-pencil</v-icon> 글쓰기
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'

export default {
    computed: {
        curid() {
            return this.$route.params.board_id
        },
    },
    data() {
        return {
            loading: true,
            page: 1,
            pageCount: 0,
            totalpage: 0,
            options: {},
            board: '',
            posts: [],
            select: { state: '8개', value: 8 },
            viewCount: [
                { state: '8개', value: 8 },
                { state: '20개', value: 20 },
                { state: '50개', value: 50 },
            ],
            headers: [
                {
                    text: '  번호',
                    align: 'left',
                    sortable: false,
                    value: 'number',
                },
                {
                    text: '제목',
                    value: 'title',
                    sortable: false,
                    width: '50%',
                },
                { text: '작성자', value: 'author', sortable: false },
                {
                    text: '작성일',
                    value: 'created_date',
                    width: '20%',
                    sortable: false,
                },
                { text: '추천', value: 'like', sortable: false },
                { text: '조회', value: 'view', sortable: false },
            ],
            headersTwo: [
                {
                    text: '  번호',
                    align: 'left',
                    sortable: false,
                    value: 'number',
                },
                {
                    text: '제목',
                    value: 'title',
                    sortable: false,
                    width: '50%',
                },
                { text: '작성자', value: 'author', sortable: false },
                { text: '추천', value: 'like', sortable: false },
                { text: '조회', value: 'view', sortable: false },
            ],
        }
    },
    watch: {
        'select.value': {
            async handler() {
                await this.fetchPostList()
            },
        },
        page: {
            async handler() {
                await this.fetchPostList()
            },
        },
        async $route(to, from) {
            await this.fetchPostList()
            this.page = 1
        },
    },
    methods: {
        clickSelect() {
            this.page = 1
        },
        changeRowPost() {
            this.itemsPerPage = 2
        },
        read(evt) {
            this.$router.push({
                path: '/board/' + this.$route.params.board_id + '/' + evt._id,
            })
        },
        async fetchPostList() {
            this.loading = true
            try {
                const res = await axios.get(
                    '/simple/boards/' + this.$route.params.board_id,
                    {
                        params: {
                            page: this.page,
                            pagesize: this.select.value,
                        },
                    }
                )
                this.posts = res.data.posts.map(post => {
                    post.created_date = moment(post.created_date).format(
                        'YYYY/MM/DD HH:MM'
                    )
                    return post
                })
                this.posts = res.data.posts.map(post => {
                    post.number = post._id
                    return post
                })
                this.posts = res.data.posts.map(post => {
                    if (post.isAnonymous == true) {
                        post.author = '익명'
                    }
                    return post
                })
                this.board = res.data.board
                this.loading = false
                this.totalpage = res.data.totalpage
                this.pageCount = Math.ceil(
                    res.data.totalpage / this.select.value
                )
            } catch (error) {
                //
            }
            this.loading = false
        },
    },
    async created() {
        await this.fetchPostList()
    },
    // watch: {
    //     async $route(to, from) {
    //         await this.fetchPostList()
    //     },
    // },
}
</script>
