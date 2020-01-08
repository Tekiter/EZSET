<template>
    <v-data-table
        :headers="headers"
        :items="boards"
        :items-per-page="10"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-toolbar-title class="d-flex justify-center"
                >-{board.title}-</v-toolbar-title
            >
            <v-divider class="mx-2" inset vertical></v-divider>
        </template>
    </v-data-table>
</template>
<script>
import axios from 'axios'
export default {
    mounted() {
        axios
            .get(`http://localhost:5000/api/v1/simple/boards/${this.board._id}`)
            .then(r => {
                console.log(r), (this.board = r.board), (this.posts = r.posts)
            })
            .catch(e => {
                console.error(e.message)
            })
    },
    data() {
        return {
            board: '',
            posts: '',
            headers: [
                {
                    text: '번호',
                    align: 'left',
                    sortable: false,
                    value: 'number',
                },
                {
                    text: '제목',
                    value: 'posts.title',
                    sortable: false,
                    width: '50%',
                },
                { text: '작성자', value: 'posts.author', sortable: false },
                { text: '작성일', value: 'posts.created_date' },
                { text: '추천', value: 'posts.like' },
                { text: '조회', value: 'posts.view' },
            ],
        }
    },
}
</script>
