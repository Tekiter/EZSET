<template>
    <div class="ma-3 pa-3 ">
        <!-- date picker -->

        <v-card
            class="ma-3 pa-3 fill-width font-weight-light"
            flat
            minHeight="95%"
            color="primary lighten-1"
            :dark="isDarkColor('primary')"
        >
            <v-row align="center">
                <v-col cols="12" lg="5">
                    <v-menu
                        v-model="startDayPicker"
                        :close-on-content-click="false"
                        max-width="290"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                :value="computedDateStart"
                                clearable
                                label="Start date"
                                readonly
                                v-on="on"
                                @click:clear="date = null"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="Sdate"
                            @change=";(startDayPicker = false), fetchAll()"
                            locale="ko"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" lg="2" class="text-center">
                    <v-icon x-large>
                        mdi-arrow-right-circle
                    </v-icon>
                </v-col>
                <v-col cols="12" lg="5">
                    <v-menu
                        v-model="endDayPicker"
                        :close-on-content-click="false"
                        max-width="290"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                :value="computedDateEnd"
                                clearable
                                label="End date"
                                readonly
                                v-on="on"
                                @click:clear="date = null"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="Edate"
                            @change=";(endDayPicker = false), fetchAll()"
                            locale="ko"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card>

        <!-- 벌점 정보 카드 출력 -->
        <v-data-iterator
            :items="infoAddedUsers"
            :search="toolbar.search"
            :loading="true"
            :items-per-page="itemsPerPage"
            :page="page"
            hide-default-footer
        >
            <template v-slot:header>
                <v-toolbar flat>
                    <v-text-field
                        v-model="toolbar.search"
                        clearable
                        solo
                        outlined
                        flatS
                        hide-details
                        dense
                        label="검색"
                        prepend-inner-icon="mdi-magnify"
                    ></v-text-field>
                </v-toolbar>
            </template>
            <template v-slot:loading>
                <v-row class="mx-2">
                    <v-col v-for="i in 9" :key="i" cols="12" md="4"
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
                        v-for="user in props.items"
                        :key="user.username"
                        cols="12"
                        md="4"
                    >
                        <v-card outlined>
                            <div class="d-flex align-center mx-4 my-6">
                                <span class="headline">
                                    {{ user.realname }}
                                </span>
                                <span class="subtitle-1 ml-2">
                                    {{ user.username }}
                                </span>
                                <v-spacer></v-spacer>
                                <span
                                    style="color:green"
                                    class="display-1 font-weight-light ma-2"
                                    v-if="
                                        userScore.find(
                                            item =>
                                                item.username == user.username
                                        ).point >= 0
                                    "
                                    >{{
                                        userScore.find(
                                            item =>
                                                item.username == user.username
                                        ).point
                                    }}</span
                                >
                                <span
                                    style="color:red"
                                    class="display-1 font-weight-light ma-2"
                                    v-if="
                                        userScore.find(
                                            item =>
                                                item.username == user.username
                                        ).point < 0
                                    "
                                    >{{
                                        userScore.find(
                                            item =>
                                                item.username == user.username
                                        ).point
                                    }}</span
                                >
                                <span class="headline">{{ '점' }}</span>
                            </div>
                            <v-divider></v-divider>
                            <v-card-text>
                                <div class="d-flex flex-wrap flex-grow-1">
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        @click="showAttendanceUserDialog(user)"
                                        icon
                                        small
                                    >
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:footer>
                <Pagination-footer
                    v-model="page"
                    :item-count="infoAddedUsers.length"
                    :items-per-page.sync="itemsPerPage"
                />
            </template>
        </v-data-iterator>

        <!-- 유저 벌점 정보 Dialog -->
        <v-dialog
            v-model="attendanceUserDialog.show"
            persistent
            max-width="350px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{
                        attendanceUserDialog.user.realname
                    }}</span>
                    <v-card-subtitle>{{
                        attendanceUserDialog.user.username
                    }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    <v-divider></v-divider>
                    <v-skeleton-loader
                        v-if="attendanceUserDialog.isLoading"
                        class="mx-auto"
                        max-width="300"
                        type="list-item-two-line"
                    ></v-skeleton-loader>
                    <v-list v-if="attendanceUserDialog.isExist">
                        <v-list-item
                            v-for="recode in attendanceUserDialog.records"
                            :key="recode.date"
                        >
                            <template>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <div class="d-flex">
                                            <div
                                                class="d-flex flex-wrap flex-grow-1"
                                            >
                                                <v-btn
                                                    @click="
                                                        $router.push(
                                                            `/AttendanceManageDay/${recode.date}`
                                                        )
                                                    "
                                                    text
                                                >
                                                    {{
                                                        changeDateFormat(
                                                            recode.date
                                                        )
                                                    }}
                                                </v-btn>
                                            </div>
                                            <v-spacer></v-spacer>
                                            <div class="d-flex pl-3">
                                                <v-tooltip bottom>
                                                    <template
                                                        v-slot:activator="{
                                                            on,
                                                        }"
                                                    >
                                                        <v-icon
                                                            v-on="on"
                                                            v-if="
                                                                recode.state ==
                                                                    'attendance'
                                                            "
                                                            color="success"
                                                            >mdi-checkbox-blank-circle-outline</v-icon
                                                        >
                                                    </template>
                                                    <span>출석</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                    <template
                                                        v-slot:activator="{
                                                            on,
                                                        }"
                                                    >
                                                        <v-icon
                                                            v-on="on"
                                                            v-if="
                                                                recode.state ==
                                                                    'late'
                                                            "
                                                            color="warning"
                                                            >mdi-triangle-outline</v-icon
                                                        >
                                                    </template>
                                                    <span>지각</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                    <template
                                                        v-slot:activator="{
                                                            on,
                                                        }"
                                                    >
                                                        <v-icon
                                                            v-on="on"
                                                            v-if="
                                                                recode.state ==
                                                                    'absence'
                                                            "
                                                            color="error"
                                                            >mdi-close</v-icon
                                                        >
                                                    </template>
                                                    <span>결석</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                    <template
                                                        v-slot:activator="{
                                                            on,
                                                        }"
                                                    >
                                                        <v-icon
                                                            v-on="on"
                                                            v-if="
                                                                recode.state ==
                                                                    'official_absence'
                                                            "
                                                            color="success"
                                                            >mdi-close-circle-outline</v-icon
                                                        >
                                                    </template>
                                                    <span>공결</span>
                                                </v-tooltip>
                                            </div>
                                            <div class="d-flex pl-3">
                                                <v-tooltip bottom>
                                                    <template
                                                        v-slot:activator="{
                                                            on,
                                                        }"
                                                    >
                                                        <v-btn
                                                            icon
                                                            text
                                                            @click="
                                                                openDeleteItem(
                                                                    recode
                                                                )
                                                            "
                                                        >
                                                            <v-icon v-on="on">
                                                                mdi-trash-can-outline
                                                            </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>삭제</span>
                                                </v-tooltip>
                                            </div>
                                        </div>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
                </v-card-text>
                <v-card-text v-if="!attendanceUserDialog.isExist">
                    정보가 없습니다.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="closeattendanceUserDialog()" text
                        >닫기</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--출석기록삭제-->
        <v-dialog v-model="deleteDialog.show" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">삭제</span
                    ><v-card-subtitle>{{
                        deleteDialog.info.username
                    }}</v-card-subtitle>
                </v-card-title>
                <v-card-text>
                    해당 항목을 삭제하시겠습니까?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="deleteItem(deleteDialog.info)"
                        text
                        color="error"
                        >삭제</v-btn
                    >
                    <v-btn @click="deleteDialog.show = false" text>닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
import moment from 'moment'
import PaginationFooter from '../../components/misc/PaginationFooter.vue'

export default {
    components: {
        PaginationFooter,
    },
    data() {
        return {
            users: [],
            infoAddedUsers: [],
            attendanceDayData: [],
            fetchingCount: 0,
            totalCount: 0,

            itemsPerPage: 8,
            page: 1,

            toolbar: {
                search: '',
            },
            attendanceUserDialog: {
                show: false,
                user: {},
                search: '',
                records: [],
                isLoading: false,
                isExist: true,
                errorMessage: '',
            },
            penaltyUserDialog: {
                show: false,
                user: {},
                search: '',
                records: [],
                isLoading: false,
                isExist: true,
                errorMessage: '',
            },
            //date-picker
            Sdate: moment()
                .startOf('month')
                .format('YYYY-MM-DD'),
            Edate: moment()
                .endOf('month')
                .format('YYYY-MM-DD'),
            startDayPicker: false,
            endDayPicker: false,
            dataLoading: false,
            deleteDialog: {
                show: false,
                info: {},
                username: '',
            },
            snackbar: {
                show: false,
                text: '',
                color: '',
            },
            penalties: [],
            userScore: [],
        }
    },
    computed: {
        isFetching() {
            return this.fetchingCount > 0
        },
        computedDateStart() {
            return this.Sdate
                ? moment(this.Sdate).format('YYYY 년 MM 월 DD 일')
                : ''
        },
        computedDateEnd() {
            return this.Edate
                ? moment(this.Edate).format('YYYY 년 MM 월 DD 일')
                : ''
        },
    },
    methods: {
        async fetchAll() {
            this.infoAddedUsers = []
            this.fetchingCount += 1
            const res = await axios.get('attendance/attendanceDayList')
            this.attendanceDayData = res.data

            await this.fetchUsers()
            await this.fetchPenalty()
            await this.getUserScore()
            this.fetchingCount -= 1
        },
        async fetchUsers() {
            this.fetchingCount += 1
            try {
                const users = await axios.get('user')
                this.totalCount = users.data.total
                this.users = users.data.users
            } finally {
                this.fetchingCount -= 1
            }
        },
        async fetchPenalty() {
            this.fetchingCount += 1
            try {
                const penalties = await axios.get(`penalty/read`)
                penalties.data.map(item => {
                    if (
                        moment(this.Sdate).format('YYYYMMDD') <=
                            moment(item.date).format('YYYYMMDD') &&
                        moment(this.Edate).format('YYYYMMDD') >=
                            moment(item.date).format('YYYYMMDD')
                    ) {
                        this.penalties.push(item)
                    }
                })
            } finally {
                this.fetchingCount -= 1
            }
        },
        async getUserScore() {
            await this.users.forEach(user => {
                let point = 0
                this.penalties.forEach(item => {
                    if (user.username == item.username) point += item.point
                })
                this.userScore.push({
                    username: user.username,
                    point: point,
                })
            })
        },
        // async addInfoInUsers() {
        //     const res = this.users.map(user => {
        //         return {
        //             username: user.username,
        //             realname: user.realname,
        //             v1: 0,
        //             v2: 0,
        //             v3: 0,
        //             v4: 0,
        //         }
        //     })
        //     res.forEach(user => {
        //         this.attendanceDayData
        //             .filter(val => {
        //                 return (
        //                     parseInt(val.day) >=
        //                         parseInt(
        //                             moment(this.Sdate).format('YYYYMMDD')
        //                         ) &&
        //                     parseInt(val.day) <=
        //                         parseInt(moment(this.Edate).format('YYYYMMDD'))
        //                 )
        //             })
        //             .map(item => {
        //                 item.status.forEach(st => {
        //                     if (st.name == user.username) {
        //                         if (st.state == 'attendance') user.v1 += 1
        //                         else if (st.state == 'late') user.v2 += 1
        //                         else if (st.state == 'absence') user.v3 += 1
        //                         else if (st.state == 'official_absence')
        //                             user.v4 += 1
        //                     }
        //                 })
        //             })
        //     })
        //     this.infoAddedUsers = res
        // },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle)
        },
        async showAttendanceUserDialog(user) {
            this.attendanceUserDialog.isLoading = true
            this.attendanceUserDialog.show = true
            this.attendanceUserDialog.user = user
            const tmp = []
            if (user.v1 == 0 && user.v2 == 0 && user.v3 == 0 && user.v4 == 0) {
                this.attendanceUserDialog.isExist = false
            } else {
                const res = await axios.post('attendance/attendanceUser', {
                    name: user.username,
                })
                for (let i in res.data.status) {
                    if (
                        parseInt(res.data.status[i].date) >=
                            parseInt(moment(this.Sdate).format('YYYYMMDD')) &&
                        parseInt(res.data.status[i].date) <=
                            parseInt(moment(this.Edate).format('YYYYMMDD'))
                    ) {
                        tmp.push(res.data.status[i])
                    }
                }
                this.attendanceUserDialog.isExist = true
            }
            this.attendanceUserDialog.records = tmp
            this.attendanceUserDialog.isLoading = false
        },
        async showPenaltyUserDialog(user) {
            this.penaltyUserDialog.isLoading = true
            this.penaltyUserDialog.show = true
            this.penaltyUserDialog.user = user
            const tmp = []
            if (user.v1 == 0 && user.v2 == 0 && user.v3 == 0 && user.v4 == 0) {
                this.attendanceUserDialog.isExist = false
            } else {
                const res = await axios.post('attendance/attendanceUser', {
                    name: user.username,
                })
                for (let i in res.data.status) {
                    if (
                        parseInt(res.data.status[i].date) >=
                            parseInt(moment(this.Sdate).format('YYYYMMDD')) &&
                        parseInt(res.data.status[i].date) <=
                            parseInt(moment(this.Edate).format('YYYYMMDD'))
                    ) {
                        tmp.push(res.data.status[i])
                    }
                }
                this.attendanceUserDialog.isExist = true
            }
            this.penaltyUserDialog.records = tmp
            this.penaltyUserDialog.isLoading = false
        },
        closeattendanceUserDialog() {
            this.attendanceUserDialog.isExist = true
            this.attendanceUserDialog.records = []
            this.attendanceUserDialog.errorMessage = ''
            this.attendanceUserDialog.show = false
        },
        changeDateFormat(date) {
            return moment(date).format('YYYY년 MM월 DD일')
        },
        async openDeleteItem(info) {
            this.deleteDialog.show = true
            this.deleteDialog.info = info
            this.deleteDialog.username = this.attendanceUserDialog.user.username
        },
        async deleteItem(info) {
            await axios.delete(`attendance/delete`, {
                params: {
                    username: this.attendanceUserDialog.user.username,
                    date: info.date,
                },
            })
            this.openSnackbar('삭제되었습니다', 'success')

            this.deleteDialog.show = false
            this.fetchingCount += 1
            this.fetchAll()
            this.attendanceUserDialog.show = false
            this.fetchingCount -= 1
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
    async created() {
        this.fetchingCount += 1
        await this.fetchAll()
        this.fetchingCount -= 1
    },
}
</script>
