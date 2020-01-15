<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="posts"
            :page.sync="page"
            :items-per-page="10"
            hide-default-footer
            class="elevation-1"
            @page-count="pageCount = $event"
            @click:row="read"
        >
            <template v-slot:top>
                <v-divider class="mx-4" inset vertical></v-divider>

                <v-toolbar-title class="d-flex justify-center"
                    ><h1>
                        <strong class="blue--text text--darken-2">{{
                            board.title
                        }}</strong>
                    </h1></v-toolbar-title
                >
            </template>
        </v-data-table>
        <div class="row">
            <div class="col"></div>
            <div class="col">
                <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
            <div class="col">
                <div class="d-flex flex-row-reverse">
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        color="blue darken-3"
                        :to="'/write/' + curid"
                    >
                        <v-icon left>mdi-pencil</v-icon> 글쓰기
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'

export default {
    mounted() {
        axios
            .get('/simple/boards/' + this.$route.params.board_id)
            .then(res => {
                this.posts = res.data.posts.map(post => {
                    post.created_date = moment(post.created_date).format(
                        'YYYY/MM/DD HH:MM'
                    )
                    return post
                })
                this.posts = res.data.posts.map(post => {
                    post.number = post._id + 1
                    return post
                })
                this.board = res.data.board
                //console.log(res.data.posts)
            })
            .catch(e => {
                console.error(e.message)
            })
    },
    computed: {
        curid() {
            return this.$route.params.board_id
        },
    },
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
            board: '',
            posts: [],
            headers: [
                {
                    text: '번호',
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
                { text: '작성일', value: 'created_date' },
                { text: '추천', value: 'like' },
                { text: '조회', value: 'view' },
            ],
        }
    },
    methods: {
        read(evt) {
            console.log(evt._id)
            console.log(evt.title)
            this.$router.push({
                path: '/post/' + evt._id,
            })
        },
    },
}
</script>
