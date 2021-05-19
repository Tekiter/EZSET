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
                            @change="changeDate()"
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
                            @change="changeDate()"
                            locale="ko"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card>

        <!-- 출석 정보 카드 출력 -->
        <v-data-iterator
            :items="users"
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
                        <AttendanceManageMonthCard
                            v-bind:username="user.username"
                            :realname="user.realname"
                            :Sdate="Sdate"
                            :Edate="Edate"
                            @fetch="fetchAll"
                        ></AttendanceManageMonthCard>
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
import AttendanceManageMonthCard from '../../components/attendance/AttendanceManageMonthCard.vue'

export default {
    components: {
        PaginationFooter,
        AttendanceManageMonthCard,
    },
    data() {
        return {
            users: [],
            infoAddedUsers: [],
            attendanceDayData: [],
            fetchingCount: 0,
            totalCount: 0,

            itemsPerPage: 9,
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
        }
    },
    async created() {
        if (!this.$perm('attendance').can('update')) {
            this.$router.push({ name: 'error403' })
            return
        }

        this.fetchAll()
        console.log(this.users)
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
            await this.fetchUsers()
            this.fetchingCount -= 1
        },
        async fetchUsers() {
            this.fetchingCount += 1
            try {
                const result = await axios.get('/user')
                this.users = result.data.users
            } finally {
                this.fetchingCount -= 1
            }
        },

        searchMatches(haystack, niddle) {
            return haystack.includes(niddle)
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
        changeDate() {
            this.startDayPicker = false
            this.endDayPicker = false
            this.fetchAll()
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
}
</script>
