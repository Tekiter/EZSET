<template>
    <div class="">
        <v-data-iterator
            :items="penaltys"
            :search="toolbar.search"
            :loading="true"
            :items-per-page="itemsPerPage"
            :page="page"
            hide-default-footer
        >
            <template v-slot:header>
                <v-toolbar flat>
                    <template>
                        <v-text-field
                            v-model="toolbar.search"
                            clearable
                            solo
                            outlined
                            flat
                            hide-details
                            dense
                            label="검색"
                            prepend-inner-icon="mdi-magnify"
                        ></v-text-field>
                    </template>
                    <template>
                        <v-btn
                            @click="showAddDialog(penalty)"
                            icon
                            color="primary"
                            :small="$vuetify.breakpoint.smAndDown"
                        >
                            <v-icon v-if="$vuetify.breakpoint.xsOnly">
                                mdi-plus
                            </v-icon>
                            <span v-else>
                                추가하기
                            </span>
                        </v-btn>
                    </template>
                </v-toolbar>
            </template>
            <template v-slot:loading>
                <v-row class="mx-2">
                    <v-col v-for="i in 16" :key="i" cols="12" md="3"
                        ><v-skeleton-loader
                            type="article"
                            class="mx-auto"
                        ></v-skeleton-loader
                    ></v-col>
                </v-row>
            </template>
            <template v-slot:default="props">
                <v-row class="mx-2">
                    <v-col
                        v-for="penalty in props.items"
                        :key="penalty.key"
                        cols="12"
                        md="3"
                    >
                        <v-card outlined>
                            <v-card-title>
                                <p class="subheader">
                                    {{ penalty.key }}
                                </p>
                                <v-spacer></v-spacer>
                                <p class="subheader ml-2">
                                    {{ penalty.value }}점
                                </p>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <div class="d-flex">
                                    <v-spacer></v-spacer>
                                    <div class="d-flex pl-3">
                                        <v-btn
                                            @click="showUpdateDialog(penalty)"
                                            icon
                                            color="primary"
                                        >
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn
                                            @click="showDeleteDialog(penalty)"
                                            icon
                                            color="primary"
                                        >
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:footer>
                <Pagination-footer
                    v-model="page"
                    :item-count="penaltys.length"
                    :items-per-page.sync="itemsPerPage"
                />
            </template>
        </v-data-iterator>

        <!-- 항목 삭제 Dialog -->
        <v-dialog v-model="deleteDialog.show" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">벌점 항목 삭제</span
                    ><v-card-subtitle>{{
                        deleteDialog.penalty.key
                    }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    해당 벌점 항목을 삭제하시겠습니까?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="closeDeleteDialog(deleteDialog.penalty)"
                        text
                        color="error"
                        >삭제</v-btn
                    >
                    <v-btn @click="deleteDialog.show = false" text>닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- 항목 수정 Dialog -->
        <v-dialog v-model="updateDialog.show" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">벌점 항목 수정</span
                    ><v-card-subtitle>{{ updateDialog.type }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="updateDialog.point"
                        label="벌점"
                        hide-details
                        outlined
                    ></v-text-field>
                </v-card-text>
                <v-card-text>
                    해당 벌점 항목을 수정 하시겠습니까?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="updatePenaltyProperty(penalty)"
                        text
                        color="success"
                        >수정</v-btn
                    >
                    <v-btn @click="updateDialog.show = false" text>취소</v-btn>
                </v-card-actions>
            </v-card>
            <v-card> </v-card>
        </v-dialog>
        <!-- 항목 추가 Dialog -->
        <v-dialog v-model="addDialog.show" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">벌점 항목 추가</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="addDialog.name"
                        label="벌점 이름"
                        hide-details
                    ></v-text-field>
                    <v-text-field
                        v-model="addDialog.point"
                        label="벌점"
                        hide-details
                    ></v-text-field>
                </v-card-text>
                <v-card-text>
                    해당 벌점 항목을 추가 하시겠습니까?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="addPenaltyProperty()" text color="success"
                        >추가</v-btn
                    >
                    <v-btn @click="addDialog.show = false" text>취소</v-btn>
                </v-card-actions>
            </v-card>
            <v-card> </v-card>
        </v-dialog>
        <!-- snackBar -->
        <v-snackbar
            v-model="snackbar.show"
            :timeout="2000"
            :color="snackbar.color"
        >
            {{ snackbar.text }}
            <v-btn text @click="snackbar = false">
                닫기
            </v-btn>
        </v-snackbar>
    </div>
</template>
<script>
import axios from 'axios'
import PaginationFooter from '../../components/misc/PaginationFooter.vue'

export default {
    components: {
        PaginationFooter,
    },
    data() {
        return {
            penaltys: [],
            fetchingCount: 0,
            totalCount: 0,

            itemsPerPage: 8,
            page: 1,

            toolbar: {
                search: '',
            },
            updateDialog: {
                type: '',
                point: '',
                show: false,
                penalty: {},
            },
            deleteDialog: {
                show: false,
                penalty: {},
            },
            addDialog: {
                type: '',
                point: '',
                show: false,
            },
            snackbar: {
                show: false,
                text: '',
                color: '',
            },
        }
    },
    computed: {
        isFetching() {
            return this.fetchingCount > 0
        },
        isMobileMode() {
            return !this.$vuetify.breakpoint.mdAndUp
        },
    },
    methods: {
        async fetchpenaltys() {
            this.fetchingCount += 1
            try {
                const penaltys = await axios.get('penaltyconfig/read')

                this.totalCount = penaltys.data.total
                this.penaltys = penaltys.data
            } finally {
                this.fetchingCount -= 1
            }
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle)
        },
        showDeleteDialog(penalty) {
            this.deleteDialog.penalty = penalty
            this.deleteDialog.show = true
        },
        async closeDeleteDialog(penalty) {
            this.deleteDialog.penalty = penalty
            try {
                await axios.post('penaltyconfig/delete', {
                    key: this.deleteDialog.penalty.key,
                    value: this.deleteDialog.penalty.value,
                })
                this.openSnackbar('삭제되었습니다', 'success')
            } catch (err) {
                this.openSnackbar(
                    '지각이나 결석은 삭제할 수 없습니다.',
                    'error'
                )
            }
            this.deleteDialog.show = false
            this.fetchpenaltys()
        },
        showUpdateDialog(penalty) {
            this.updateDialog.type = penalty.key
            this.updateDialog.point = penalty.value
            this.updateDialog.show = true
        },
        async updatePenaltyProperty() {
            if (this.updateDialog.point == '') {
                this.openSnackbar('벌점 을 확인해주세요', 'error')
            } else {
                try {
                    await axios.post('penaltyconfig/update', {
                        key: this.updateDialog.type,
                        value: this.updateDialog.point,
                    })
                    this.openSnackbar('수정되었습니다', 'success')
                } catch (err) {
                    this.openSnackbar('수정하지 못했습니다', 'error')
                }
                this.updateDialog.show = false
                this.updateDialog.name = ''
                this.updateDialog.point = ''
                this.fetchpenaltys()
            }
        },
        showAddDialog() {
            this.addDialog.show = true
        },
        async addPenaltyProperty() {
            if (this.addDialog.name == '') {
                this.openSnackbar('벌점 이름을 확인해주세요', 'error')
            } else if (this.addDialog.point == '') {
                this.openSnackbar('벌점 을 확인해주세요', 'error')
            } else {
                try {
                    await axios.post('penaltyconfig/write', {
                        key: this.addDialog.name,
                        value: this.addDialog.point,
                    })
                    this.openSnackbar('추가되었습니다', 'success')
                } catch (err) {
                    this.openSnackbar('추가하지 못했습니다', 'error')
                }
                this.addDialog.show = false
                this.addDialog.name = ''
                this.addDialog.point = ''
                this.fetchpenaltys()
            }
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
    async created() {
        if (!this.$perm('manageUsers').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }

        this.fetchingCount += 1
        await this.fetchpenaltys()
        this.fetchingCount -= 1
    },
}
</script>
