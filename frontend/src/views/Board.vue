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
        <v-data-table
            :headers="header"
            :items="boards"
            :items-per-page="5"
            class="elevation-1"
            @click:row="read"
        ></v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            loading: true,
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
        read(evt) {
            //evt라는 임의의 변수안에 board 정보 들어가있음
            console.log(evt._id)
            console.log(evt.title)
            this.$router.push({
                path: '/board/' + evt._id,
            })
        },
    },
    mounted() {
        axios.get('/simple/boards').then(res => {
            this.boards = res.data
            this.loading = false
        })
    },
}
</script>
