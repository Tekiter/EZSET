<template>
    <v-row class="mt-3 ma-md-3 fill-height" :no-gutters="isMobileMode">
        <v-col v-show="isMobileMode" cols="12">
            <v-tabs v-model="curTab" class="mt-3">
                <v-tab>
                    게시판
                </v-tab>
                <v-tab>
                    게시판 권한
                </v-tab>
            </v-tabs>
        </v-col>

        <v-col
            cols="12"
            md="5"
            v-show="!isMobileMode || curTab == 0"
            class="fill-height"
        >
            <v-card outlined :loading="isLoading">
                <v-toolbar flat>
                    <v-toolbar-title>
                        게시판
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        outlined
                        tile
                        color="primary"
                        @click="showCreateBoardDialog()"
                    >
                        <v-icon left>mdi-pencil</v-icon> 게시판 생성
                    </v-btn>
                </v-toolbar>
                <v-list subheader>
                    <v-list-item v-for="board in boards" :key="board._id">
                        <v-list-item-title
                            >{{ board.title }}
                            <v-chip
                                v-if="board.isAnonymous"
                                class="ma-2"
                                color="deep-purple accent-4"
                                outlined
                                x-small
                            >
                                익명
                            </v-chip></v-list-item-title
                        >
                        <v-list-item-action>
                            <v-btn icon @click="showModifyDialog(board)">
                                <v-icon>mdi-pencil-outline</v-icon>
                            </v-btn>
                        </v-list-item-action>
                        <v-list-item-action>
                            <v-btn icon @click="showDeleteBoardDialog(board)">
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>
        <v-col
            cols="12"
            md="7"
            v-show="!isMobileMode || curTab == 1"
            class="fill-height"
        >
            <board-role-edit ref="roleEdit"></board-role-edit>
        </v-col>

        <v-dialog v-model="createBoardDialog.show" max-width="300">
            <v-card :loading="createBoardDialog.isLoading">
                <v-card-title>게시판 생성</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="createBoardDialog.title"
                        label="게시판 이름"
                        hide-details
                        :error-messages="createBoardDialog.error"
                    ></v-text-field>
                </v-card-text>
                <v-container fluid>
                    <v-switch
                        class="ml-3"
                        v-model="isAnonymous"
                        label="익명게시판"
                    ></v-switch>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="applyCreateBoardDialog()"
                    >
                        생성
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="createBoardDialog.show = false"
                    >
                        취소
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteBoardDialog.show" max-width="400">
            <v-card :loading="deleteBoardDialog.isLoading">
                <v-card-title>게시판을 삭제하시겠습니까? </v-card-title>
                <v-card-text>
                    {{ deleteBoardDialog.curTitle }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="error darken-1"
                        text
                        @click="applyDeleteBoardDialog()"
                    >
                        삭제
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="deleteBoardDialog.show = false"
                    >
                        취소
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="modifyDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">게시판 이름 수정</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="modifyTitle"
                        label="새 이름"
                        hide-details
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="modifyTitle"
                        color="green darken-1"
                        text
                        @click="successPostTitle()"
                        >수정</v-btn
                    >
                    <v-btn v-else color="black darken-1" text>수정</v-btn>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="modifyDialog = false"
                        >취소</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import axios from 'axios'
import BoardRoleEdit from '../../components/manage/BoardRoleEdit.vue'
export default {
    components: {
        BoardRoleEdit,
    },
    data() {
        return {
            modifyBoardCurId: '',
            modifyDialog: false,
            modifyTitle: '',
            curTab: 0,
            boards: [],
            createBoardDialog: {
                show: false,
                title: '',
                isLoading: false,
                error: '',
            },
            deleteBoardDialog: {
                show: false,
                isLoading: false,
                error: '',
                curId: -1,
                curTitle: '',
            },
            isAnonymous: false,
        }
    },
    computed: {
        isMobileMode() {
            return this.$vuetify.breakpoint.smAndDown
        },
    },
    methods: {
        async successPostTitle() {
            axios.patch('simple/boards/' + this.modifyBoardCurId, {
                title: this.modifyTitle,
            })
            this.modifyDialog = false
            this.fetchBoards()
            await this.$store.dispatch('board/fetchBoards')
            await this.$refs.roleEdit.resetChanges()
        },
        fetch_id(id) {
            this.temp_id = id
        },
        showModifyDialog(board) {
            this.modifyTitle = board.title
            this.modifyBoardCurId = board._id
            this.modifyDialog = true
        },
        showDeleteBoardDialog(board) {
            this.deleteBoardDialog.curId = board._id
            this.deleteBoardDialog.curTitle = board.title
            this.deleteBoardDialog.show = true
        },
        async applyDeleteBoardDialog() {
            this.deleteBoardDialog.isLoading = true
            try {
                await axios.delete(
                    'simple/boards/' + this.deleteBoardDialog.curId
                )
                this.deleteBoardDialog.isLoading = false
                this.deleteBoardDialog.show = false

                await this.fetchBoards()
            } catch (error) {
                this.deleteBoardDialog.error = '게시판 삭제에 실패했습니다.'
            }
            await this.$store.dispatch('board/fetchBoards')
        },
        delBoard(id) {
            axios.delete('/simple/boards/' + id)
            axios.get('/simple/boards').then(res => {
                this.boards = res.data
            })
        },
        async fetchBoards() {
            this.isLoading = true
            const res = await axios.get('simple/boards')
            this.boards = res.data
            this.isLoading = false
        },
        showCreateBoardDialog() {
            this.createBoardDialog.title = ''
            this.createBoardDialog.show = true
        },
        async applyCreateBoardDialog() {
            this.createBoardDialog.isLoading = true
            try {
                await axios.post('simple/boards', {
                    title: this.createBoardDialog.title,
                    isAnonymous: this.isAnonymous,
                })
                this.createBoardDialog.isLoading = false
                this.createBoardDialog.show = false
                await this.fetchBoards()
            } catch (error) {
                //
                this.createBoardDialog.error = '게시판 생성에 실패했습니다.'
            }
            this.isAnonymous = false
            await this.$store.dispatch('board/fetchBoards')
        },
    },
    async created() {
        await this.fetchBoards()
    },
}
</script>
