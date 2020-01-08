<template>
    <v-data-table
        :headers="header"
        :items="boards"
        :items-per-page="5"
        class="elevation-1"
        @click:row="read"
    ></v-data-table>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            header: [
                {
                    text: '게시판 이름',
                    value: 'title',
                },
            ],
            boards: [],
        }
    },
    methods: {
        makeBoard() {},
        read(evt) {
            console.log(evt._id)
            console.log(evt.title)
            this.$router.push({
                path: '/board/' + evt._id + '/' + evt.title,
            })
        },
    },
    mounted() {
        axios.get('/simple/boards').then(res => {
            this.boards = res.data
        })
    },
}
</script>
