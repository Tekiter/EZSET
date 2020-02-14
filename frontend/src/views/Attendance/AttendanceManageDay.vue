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
                        <v-spacer></v-spacer>
                        <v-btn icon @click="userAddDialog.show = true">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-toolbar flat>
                        <v-subheader>{{ this.Mdate }} </v-subheader>
                        <v-spacer></v-spacer>
                        <v-subheader v-if="attLoad"
                            >총원: {{ this.total.sum }}명, 출석:
                            {{ this.total.attendance }}명, 지각:
                            {{ this.total.late }}명, 결석:
                            {{ this.total.absence }}명, 공결:
                            {{ this.total.official_absence }}명
                        </v-subheader>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-skeleton-loader
                        class="mx-auto"
                        type="table"
                        v-if="!attLoad"
                    ></v-skeleton-loader>
                    <v-simple-table
                        v-if="attLoad && this.$perm('attendance').can('read')"
                    >
                        <template v-slot:default>
                            <tbody>
                                <tr class="pa-2 d-flex">
                                    <td class="flex-grow-1">이름</td>
                                    <td class="flex-grow-0">출석</td>
                                    <td class="flex-grow-0">지각</td>
                                    <td class="flex-grow-0">결석</td>
                                    <td class="flex-grow-0">공결</td>
                                </tr>
                                <tr
                                    v-for="item in statusData.status"
                                    :key="item.name"
                                    class="d-flex"
                                >
                                    <td class="flex-grow-1">{{ item.name }}</td>
                                    <td
                                        v-if="item.state == 'attendance'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn text icon color="green" dark>
                                            <v-icon>
                                                mdi-checkbox-blank-circle-outline
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.state != 'attendance'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn
                                            text
                                            icon
                                            color="gray"
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
                                    </td>

                                    <td
                                        v-if="item.state == 'late'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn text icon color="orange" dark>
                                            <v-icon>
                                                mdi-triangle-outline
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.state != 'late'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn
                                            text
                                            icon
                                            color="gray"
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
                                    </td>
                                    <td
                                        v-if="item.state == 'absence'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn text icon color="red" dark>
                                            <v-icon> mdi-close </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.state != 'absence'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn
                                            text
                                            icon
                                            color="gray"
                                            @click="
                                                changeAttendanceState(
                                                    item,
                                                    'absence'
                                                )
                                            "
                                        >
                                            <v-icon> mdi-close </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.state == 'official_absence'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn text icon color="green" dark>
                                            <v-icon>
                                                mdi-close-circle-outline
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.state != 'official_absence'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn
                                            text
                                            icon
                                            color="gray lighten-2"
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
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                    <div>
                        <v-alert type="warning" v-if="statusData.length == 0">
                            출석정보가 없습니다.
                        </v-alert>
                    </div>
                    <div>
                        <v-alert
                            type="error"
                            v-if="!$perm('attendance').can('read')"
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
                        v-if="!absenLoad && this.$perm('absence').can('read')"
                    ></v-skeleton-loader>
                    <v-simple-table
                        v-if="
                            absenLoad &&
                                this.$perm('absence').can('read') &&
                                absenceDate.length != 0
                        "
                    >
                        <template v-slot:default>
                            <tbody>
                                <tr class="pa-2 d-flex">
                                    <td class="flex-grow-1">이름</td>
                                    <td class="flex-grow-0">사유</td>
                                    <td class="flex-grow-0">승인여부</td>
                                </tr>
                                <tr
                                    v-for="item in absenceDate"
                                    :key="item.name"
                                    class="d-flex"
                                >
                                    <td class="flex-grow-1">{{ item.name }}</td>
                                    <td class="flex-grow-0">
                                        {{ item.reason }}
                                    </td>
                                    <td
                                        v-if="item.approval == true"
                                        class="flex-grow-0"
                                    >
                                        <v-btn text icon color="green">
                                            <v-icon>
                                                mdi-checkbox-blank-circle-outline
                                            </v-icon>
                                        </v-btn>
                                        <v-btn
                                            text
                                            icon
                                            @click="changeAbsenceState(item)"
                                        >
                                            <v-icon> mdi-close </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.approval == false"
                                        class="flex-grow-0"
                                    >
                                        <v-btn
                                            text
                                            icon
                                            @click="changeAbsenceState(item)"
                                        >
                                            <v-icon>
                                                mdi-checkbox-blank-circle-outline
                                            </v-icon>
                                        </v-btn>
                                        <v-btn text icon color="red">
                                            <v-icon> mdi-close </v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                    <div>
                        <v-alert type="warning" v-if="absenceDate.length == 0">
                            공결정보가 없습니다.
                        </v-alert>
                    </div>
                    <div>
                        <v-alert
                            type="error"
                            v-if="!$perm('attendance').can('read')"
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
                <!-- <v-card>
                    <v-card-title class="headline">출석 정보 추가</v-card-title>
                    <v-card-text>
                        출석대상이 설정으로 누락된 유저의 출석 정보를
                        추가합니다.
                    </v-card-text> -->
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
                                    ></v-checkbox>
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
                            color="green darken-1"
                            text
                            @click="cancelUserAdd()"
                        >
                            취소
                        </v-btn>

                        <v-btn
                            color="green darken-1"
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
        if (!this.$perm('manageRoles').can('access')) {
            this.$router.push({ name: 'error403' })
            return
        }
        await this.fetchAttUsers()
    },
    data() {
        return {
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
        }
    },
    computed: {
        date() {
            return this.$route.params.day
        },
        Mdate() {
            return moment(this.$route.params.day).format('YYYY-MM-DD')
        },
        total() {
            const cols = {
                sum: 0,
                attendance: 0,
                late: 0,
                absence: 0,
                official_absence: 0,
            }
            if (this.statusData.length != 0) {
                this.statusData.status.forEach(element => {
                    cols.sum += 1
                    if (element.state == 'attendance') cols.attendance += 1
                    else if (element.state == 'late') cols.late += 1
                    else if (element.state == 'absence') cols.absence += 1
                    else if (element.state == 'official_absence')
                        cols.official_absence += 1
                })
            }
            return cols
        },
    },
    methods: {
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
                this.state = res1.status
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
                console.log(err)
            }
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
                console.log(err)
                this.openSnackbar('error', 'error')
            }
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
}
</script>
