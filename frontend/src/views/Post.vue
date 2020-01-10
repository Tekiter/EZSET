<template>
    <v-data-table
        :headers="headers"
        :items="posts"
        :items-per-page="10"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-toolbar-title class="d-flex justify-center"
                >-{{ board.title }}-</v-toolbar-title
            >
            <v-divider class="mx-2" inset vertical></v-divider>
        </template>
    </v-data-table>
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
                        'YY/MM/DD'
                    )
                    return post
                })
                this.posts = res.data.posts.map(post => {
                    post.number = post._id + 1
                    return post
                })
                this.board = res.data.board
                console.log(res.data.posts)
            })
            .catch(e => {
                console.error(e.message)
            })
    },

    data() {
        return {
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
                path: '/post/' + evt._id + '/' + evt.title,
            })
        },
    },
}
</script>
