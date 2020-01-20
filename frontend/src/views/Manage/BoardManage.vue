<template>
    <div class="pa-10">
        <v-card outlined>
            <v-card-title class="pb-5">게시판 이름</v-card-title>
            <v-col v-for="board in boards" :key="board._id">
                <v-card class="row pl-5" flat>
                    <v-card class="col" flat>{{ board.title }}</v-card>
                    <v-btn
                        icon
                        small
                        @click="
                            deleteDialog.show = true
                            fetch_id(board._id)
                        "
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </v-card>
            </v-col>
        </v-card>

        <div class="col">
            <div class="d-flex flex-row-reverse">
                <v-btn
                    class="ma-2"
                    tile
                    outlined
                    color="blue darken-3"
                    @click="createBoardDialog.show = true"
                >
                    <v-icon left>mdi-pencil</v-icon> 게시판 생성
                </v-btn>
            </div>
        </div>
        <v-dialog v-model="createBoardDialog.show" max-width="300">
            <v-card>
                <v-card-title class="headline">게시판 생성</v-card-title>
                <v-form>
                    <v-textarea
                        v-model="title"
                        label="Title"
                        counter
                        maxlength="100"
                        full-width
                        single-line
                    ></v-textarea>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            title = title
                            createBoard()
                            createBoardDialog.title = ' '
                            createBoardDialog.show = false
                        "
                    >
                        Submit
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="createBoardDialog.show = false"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog.show" max-width="290">
            <v-card>
                <v-card-title class="headline"
                    >게시판을 삭제하시겠습니까?</v-card-title
                >

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            delBoard(temp_id)
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
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            boards: {
                _id: ' ',
                title: ' ',
            },
            title: ' ',
            createBoardDialog: {
                show: false,
                title: '',
            },
            deleteDialog: {
                show: false,
                title: '',
            },
        }
    },
    methods: {
        read(evt) {
            console.log(evt._id)
            console.log(evt.title)
            this.$router.push({
                path: '/board/' + evt._id,
            })
        },
        createBoard() {
            axios.post('/simple/boards', {
                title: this.title,
            })
            axios.get('/simple/boards').then(res => {
                this.boards = res.data
            })
        },
        fetch_id(id) {
            this.temp_id = id
        },
        delBoard(id) {
            axios.delete('/simple/boards/' + id)
            axios.get('/simple/boards').then(res => {
                this.boards = res.data
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
