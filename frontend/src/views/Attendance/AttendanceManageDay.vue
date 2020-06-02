<template>
    <div class="ma-3 fill-height">
        <v-row class="fill-height">
            <!-- 출석 현황 column  -->
            <v-col cols="12" md="6" class="fill-screen">
                <v-card tile minHeight="95%">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            출석현황
                        </v-toolbar-title>
                        <v-subheader>{{ this.Mdate }} </v-subheader>
                        <v-spacer></v-spacer>
                        <v-subheader v-if="attLoad"
                            >총원: {{ this.total.sum }}명, 출석:
                            {{ this.total.attendance }}명, 지각:
                            {{ this.total.late }}명, 결석:
                            {{ this.total.absence }}명, 공결:
                            {{ this.total.official_absence }}명
                        </v-subheader>
                        <v-btn icon @click="userAddDialog.show = true">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-skeleton-loader
                        class="mx-auto"
                        type="table"
                        v-if="!attLoad"
                    ></v-skeleton-loader>
                    <template>
                        <v-row class="mx-3">
                            <v-col cols="12">
                                <v-card flat>
                                    <div class="d-flex align-center mx-2">
                                        <span class="title">
                                            이름
                                        </span>
                                        <span class="subtitle-1 ml-2"> </span>
                                        <v-spacer></v-spacer>
                                        <span class="ma-3">
                                            출석
                                        </span>
                                        <span class="ma-3">
                                            지각
                                        </span>
                                        <span class="ma-3">
                                            결석
                                        </span>
                                        <span class="ma-3">
                                            공결
                                        </span>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                    <v-divider></v-divider>
                    <template>
                        <v-row class="mx-3">
                            <v-col
                                v-for="item in statusData.status"
                                :key="item.name"
                                cols="12"
                            >
                                <v-card flat>
                                    <div class="d-flex align-center mx-2">
                                        <span class="title font-weight-bold">
                                            {{ findUserRealname(item.name) }}
                                        </span>
                                        <span class="subtitle-1 ml-2">
                                            {{ item.name }}
                                        </span>
                                        <v-spacer></v-spacer>
                                        <span
                                            v-if="item.state == 'attendance'"
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="success"
                                                dark
                                            >
                                                <v-icon>
                                                    mdi-checkbox-blank-circle-outline
                                                </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="item.state != 'attendance'"
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="grey darken-1"
                                                @click="
                                                    changeAttendanceState(
                                                        item,
                                                        'attendance'
                                                    )
                                                "
                                            >
                                                <v-icon>
                                                    mdi-checkbox-blank-circle-outline
                                                </v-icon>
                                            </v-btn>
                                        </span>

                                        <span
                                            v-if="item.state == 'late'"
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="warning"
                                                dark
                                            >
                                                <v-icon>
                                                    mdi-triangle-outline
                                                </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="item.state != 'late'"
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="grey darken-1"
                                                @click="
                                                    changeAttendanceState(
                                                        item,
                                                        'late'
                                                    )
                                                "
                                            >
                                                <v-icon>
                                                    mdi-triangle-outline
                                                </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="item.state == 'absence'"
                                            class="ma-2"
                                        >
                                            <v-btn text icon color="error" dark>
                                                <v-icon> mdi-close </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="item.state != 'absence'"
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="grey darken-1"
                                                @click="
                                                    changeAttendanceState(
                                                        item,
                                                        'absence'
                                                    )
                                                "
                                            >
                                                <v-icon> mdi-close </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="
                                                item.state == 'official_absence'
                                            "
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="success"
                                                dark
                                            >
                                                <v-icon>
                                                    mdi-close-circle-outline
                                                </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="
                                                item.state != 'official_absence'
                                            "
                                            class="ma-2"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                color="grey darken-2"
                                                @click="
                                                    changeAttendanceState(
                                                        item,
                                                        'official_absence'
                                                    )
                                                "
                                            >
                                                <v-icon>
                                                    mdi-close-circle-outline
                                                </v-icon>
                                            </v-btn>
                                        </span>
                                    </div>
                                </v-card>
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </template>
                    <div>
                        <v-alert type="warning" v-if="statusData.length == 0">
                            출석정보가 없습니다.
                        </v-alert>
                    </div>
                    <div>
                        <v-alert
                            type="error"
                            v-if="!$perm('attendance').can('update')"
                        >
                            권한이 없습니다.
                        </v-alert>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="6" class="fill-height">
                <v-card tile minHeight="95%">
                    <v-card-title>공결 현황</v-card-title>
                    <v-divider></v-divider>
                    <v-skeleton-loader
                        class="mx-auto"
                        type="table"
                        v-if="!absenLoad && this.$perm('absence').can('update')"
                    ></v-skeleton-loader>
                    <template>
                        <v-row class="mx-3">
                            <v-col cols="12">
                                <v-card flat>
                                    <div class="d-flex align-center mx-2">
                                        <span class="title">
                                            이름
                                        </span>
                                        <span class="subtitle-1 ml-2"> </span>
                                        <v-spacer></v-spacer>
                                        <span class="ma-3">
                                            사유
                                        </span>
                                        <span class="ma-3">
                                            승인여부
                                        </span>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                    <v-divider></v-divider>
                    <template>
                        <v-row class="mx-3">
                            <v-col
                                v-for="item in absenceDate"
                                :key="item.name"
                                cols="12"
                            >
                                <v-card flat>
                                    <div class="d-flex align-center mx-2">
                                        <span class="title font-weight-bold">
                                            {{ findUserRealname(item.name) }}
                                        </span>
                                        <span class="subtitle-1 ml-2">
                                            {{ item.name }}
                                        </span>
                                        <v-spacer></v-spacer>

                                        <span>
                                            {{ item.reason }}
                                        </span>
                                        <span
                                            v-if="item.approval == true"
                                            class="ma-3"
                                        >
                                            <v-btn text icon color="success">
                                                <v-icon>
                                                    mdi-checkbox-blank-circle-outline
                                                </v-icon>
                                            </v-btn>
                                            <v-btn
                                                text
                                                icon
                                                @click="
                                                    changeAbsenceState(item)
                                                "
                                            >
                                                <v-icon> mdi-close </v-icon>
                                            </v-btn>
                                        </span>
                                        <span
                                            v-if="item.approval == false"
                                            class="ma-3"
                                        >
                                            <v-btn
                                                text
                                                icon
                                                @click="
                                                    changeAbsenceState(item)
                                                "
                                            >
                                                <v-icon>
                                                    mdi-checkbox-blank-circle-outline
                                                </v-icon>
                                            </v-btn>
                                            <v-btn text icon color="error">
                                                <v-icon> mdi-close </v-icon>
                                            </v-btn>
                                        </span>
                                    </div>
                                    <v-divider></v-divider>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <div>
                        <v-alert type="warning" v-if="absenceDate.length == 0">
                            공결정보가 없습니다.
                        </v-alert>
                    </div>
                    <div>
                        <v-alert
                            type="error"
                            v-if="!$perm('attendance').can('update')"
                        >
                            권한이 없습니다.
                        </v-alert>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-dialog
                v-model="userAddDialog.show"
                max-width="800px"
                height="500px"
            >
                <v-card>
                    <v-toolbar flat>
                        <v-card-title>출석 기록 추가 </v-card-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-container>
                            <v-text-field
                                v-model="userAddDialog.search"
                                clearable
                                solo
                                outlined
                                flat
                                hide-details
                                dense
                                label="검색"
                                prepend-inner-icon="mdi-magnify"
                            ></v-text-field>
                            <v-row no-gutters>
                                <v-col
                                    v-for="user in userAddDialog.users"
                                    :key="user"
                                    v-show="
                                        searchMatches(
                                            user,
                                            userAddDialog.search
                                        )
                                    "
                                    cols="12"
                                    lg="3"
                                    md="3"
                                    sm="6"
                                >
                                    <v-checkbox
                                        :label="`${user}`"
                                        v-model="userAddDialog.selections"
                                        :value="user"
                                        hide-details
                                    >
                                    </v-checkbox>
                                </v-col>
                                <v-col
                                    cols="12"
                                    class="text-center mt-5"
                                    v-if="userAddDialog.users.length == 0"
                                >
                                    <p>추가 할 유저가 없습니다.</p>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-spacer></v-spacer>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="success darken-1"
                            text
                            @click="cancelUserAdd()"
                        >
                            취소
                        </v-btn>

                        <v-btn
                            color="success darken-1"
                            text
                            @click="applyUserAdd()"
                        >
                            추가
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
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
import moment from 'moment'
import axios from 'axios'
export default {
    async created() {
        if (!this.$perm('attendance').can('update')) {
            this.$router.push({ name: 'error403' })
            return
        }
        await this.fetchAttUsers()
        await this.getUserName()
        await this.fetchTotal()
    },
    data() {
        return {
            total:{},
            statusData: [],
            absenceDate: [],
            attLoad: false,
            absenLoad: false,
            allUsers: [],
            userAddDialog: {
                users: [],
                show: false,
                search: '',
                isLoading: false,
                selections: [],
                message: '',
            },
            snackbar: {
                show: false,
                text: '',
                color: '',
            },
            state: '',
            userName: '',
        }
    },
    computed: {
        date() {
            return this.$route.params.day
        },
        Mdate() {
            return moment(this.$route.params.day).format('YYYY-MM-DD')
        },
    },
    methods: {
        async getUserName() {
            const res = await axios.get('user/')
            const tmp = res.data.users
            this.userName = tmp.map(user => {
                return { username: user.username, realname: user.realname }
            })
        },
        findUserRealname(username) {
            for (var k in this.userName) {
                if (this.userName[k].username == username) {
                    return this.userName[k].realname
                }
            }
            return ''
        },
        async fetchTotal(){
            const cols = {
                sum: 0,
                attendance: 0,
                late: 0,
                absence: 0,
                official_absence: 0,
            }
            if (this.statusData.length != 0) {
                await this.statusData.status.forEach(element => {
                    cols.sum += 1
                    if (element.state == 'attendance') cols.attendance += 1
                    else if (element.state == 'late') cols.late += 1
                    else if (element.state == 'absence') cols.absence += 1
                    else if (element.state == 'official_absence')
                        cols.official_absence += 1
                })
            }
            this.total = cols
        },
        async fetchAttUsers() {
            this.attLoad = false
            this.absenLoad = false
            const res = await axios.get(
                `absencecheck/absenceUsersData/${this.Mdate}`
            )
            this.absenceDate = res.data
            this.absenLoad = true

            await this.updateAbsenceState()

            try {
                const res1 = await axios.get(
                    `attendance/attendanceState/${this.date}`
                )
                this.state = res1.data.status
                this.statusData = res1.data
                this.attLoad = true
            } catch (err) {
                this.attLoad = true
            }
            const res2 = await axios.post('attendance/attendanceNUserData', {
                day: this.date,
            })
            this.userAddDialog.users = res2.data
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle || '')
        },
        async applyUserAdd() {
            await axios.put('attendance/addUsersRecords', {
                users: this.userAddDialog.selections,
                day: this.date,
            })
            this.userAddDialog.show = false
            this.fetchAttUsers()
            this.openSnackbar('추가했습니다!')
        },
        async cancelUserAdd() {
            this.userAddDialog.selections = []
            this.userAddDialog.show = false
        },
        async updateAbsenceState() {
            for (let item of this.absenceDate) {
                if (item.approval == true) {
                    await axios.post(
                        `attendance/attendancestateupdate/${this.date}`,
                        {
                            state: 'official_absence',
                            name: item.name,
                        }
                    )
                }
            }
        },
        async changeAttendanceState(item, to) {
            try {
                await axios.post(
                    `attendance/attendancestateupdate/${this.date}`,
                    {
                        state: to,
                        name: item.name,
                    }
                )
                item.state = to
                this.openSnackbar('변경되었습니다!', 'success')
            } catch (err) {
                //console.log(err)
            }
            await this.fetchTotal()
        },
        async changeAbsenceState(item) {
            try {
                await axios.post('absencecheck/officialAbsenceAccept', {
                    name: item.name,
                    day: item.day,
                    approval: !item.approval,
                })
                item.approval = !item.approval

                if (item.approval) {
                    await axios.post(
                        `attendance/attendancestateupdate/${this.date}`,
                        {
                            state: 'absence',
                            name: item.name,
                        }
                    )
                } else {
                    await axios.post(
                        `attendance/attendancestateupdate/${this.date}`,
                        {
                            state: 'absence',
                            name: item.name,
                        }
                    )
                }
                this.fetchAttUsers()
                this.openSnackbar('변경되었습니다!', 'success')
            } catch (err) {
                //console.log(err)
                this.openSnackbar('error', 'error')
            }
            await this.fetchTotal()
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
}
</script>
