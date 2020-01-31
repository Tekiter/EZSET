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
        <v-container>
            <div>
                <br />

                <v-toolbar-title class="d-flex justify-center"
                    ><h1>
                        <strong class="font-weight-medium">{{
                            board.title
                        }}</strong>
                    </h1></v-toolbar-title
                >
                <br />
            </div>
            <v-data-table
                :headers="headers"
                :items="posts"
                :page.sync="page"
                :items-per-page="8"
                hide-default-footer
                class="elevation-1"
                @page-count="pageCount = $event"
            >
                <template v-slot:item.title="props">
                    <a @click="read(props.item)">
                        {{ props.item.title }}
                    </a>
                </template>
            </v-data-table>
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
                            color="black"
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
            itemsPerPage: 10,
            board: '',
            posts: [],
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
        }
    },
    methods: {
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
