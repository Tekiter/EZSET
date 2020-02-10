<template>
    <div>
        <div>
            <v-text-field
                v-if="loading"
                color="blue darken-2"
                loading
                disabled
            ></v-text-field>
        </div>
        <v-container grid-list-md>
            <div>
                <strong
                    class="font-weight-medium d-flex justify-center display-2"
                    >{{ board.title }}</strong
                >
            </div>
            <v-row class="d-flex flex-row-reverse">
                <v-col cols="3" sm="1">
                    <v-select
                        v-model="select"
                        :items="viewCount"
                        item-text="state"
                        item-value="value"
                        persistent-hint
                        return-object
                    ></v-select> </v-col
            ></v-row>
            <v-card outlined>
                <v-data-table
                    :headers="headers"
                    :items="posts"
                    :page.sync="page"
                    :items-per-page="select.value"
                    hide-default-footer
                    :mobile-breakpoint="NaN"
                    class="hidden-sm-and-down"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }}
                        </a>
                    </template>
                </v-data-table>
                <v-data-table
                    :headers="headersTwo"
                    :items="posts"
                    :page.sync="page"
                    :items-per-page="8"
                    hide-default-footer
                    :mobile-breakpoint="NaN"
                    class="hidden-md-and-up"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }}
                        </a>
                    </template>
                </v-data-table>
            </v-card>
            <div class="row">
                <div class="col"></div>
                <div class="col">
                    <v-pagination
                        v-model="page"
                        :length="pageCount"
                    ></v-pagination>
                </div>
                <div class="col">
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
                </div>
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
                { text: '작성일', value: 'created_date', width: '20%' },
                { text: '추천', value: 'like' },
                { text: '조회', value: 'view' },
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
                { text: '추천', value: 'like' },
                { text: '조회', value: 'view' },
            ],
        }
    },
    methods: {
        changeRowPost() {
            this.itemsPerPage = 2
        },
        read(evt) {
            //console.log(evt._id)
            //console.log(evt.title)
            this.$router.push({
                path: '/board/' + this.$route.params.board_id + '/' + evt._id,
            })
        },
        async fetchPostList() {
            try {
                const res = await axios.get(
                    '/simple/boards/' + this.$route.params.board_id
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
                //console.log(res.data.posts)
                this.loading = false
            } catch (error) {
                //
            }
        },
    },
    async created() {
        await this.fetchPostList()
    },
    watch: {
        async $route(to, from) {
            await this.fetchPostList()
        },
    },
}
</script>
