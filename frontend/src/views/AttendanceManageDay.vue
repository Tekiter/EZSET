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
                    <v-divider></v-divider>
                    <v-subheader>{{ this.Mdate }} </v-subheader>
                    <v-divider></v-divider>
                    <v-skeleton-loader
                        class="mx-auto"
                        type="table"
                        v-if="!attLoad && this.$perm('attendance').can('read')"
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
                                                updateStateToAttendance(item)
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
                                            @click="updateStateToLate(item)"
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
                                            @click="updateStateToAbsence(item)"
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
                                                updateStateToOfficialAbsence(
                                                    item
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
                        <v-alert type="warning" v-if="statusData == undefind">
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
                        v-if="absenLoad && this.$perm('absence').can('read')"
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
                                        v-if="item.approval == 'Yes'"
                                        class="flex-grow-0"
                                    >
                                        <v-btn text icon color="green">
                                            <v-icon>
                                                mdi-checkbox-blank-circle-outline
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                    <td
                                        v-if="item.approval == 'No'"
                                        class="flex-grow-0"
                                    >
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
                <v-card :loading="userAddDialog.isLoading">
                    <v-card-title>출석 대상 유저 </v-card-title>
                    <v-toolbar flat>
                        <v-btn icon @click="userAddDialog.show = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>유저 추가</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn
                            outlined
                            @click.native="userAddDialog.show = false"
                            color="primary"
                            >추가</v-btn
                        >
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
                                    v-for="user in attable.excludedUsers"
                                    :key="user.username"
                                    v-show="
                                        searchMatches(
                                            user.username,
                                            userAddDialog.search
                                        )
                                    "
                                    cols="12"
                                    lg="3"
                                    md="3"
                                    sm="6"
                                >
                                    <v-checkbox
                                        :label="`${user.username}`"
                                        v-model="userAddDialog.selections"
                                        :value="user.username"
                                        hide-details
                                    ></v-checkbox>
                                </v-col>
                                <v-col
                                    cols="12"
                                    class="text-center mt-5"
                                    v-if="attable.users.length == 0"
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
                            @click="userAddDialog.show = false"
                        >
                            취소
                        </v-btn>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="userAddDialog.show = false"
                        >
                            추가
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    async created() {
        try {
            const res = await axios.get(
                `absencecheck/absenceUsersData/${this.Mdate}`
            )
            this.absenceDate = res.data
            this.absenLoad = true
        } catch (err) {
            console.log(err)
        }
        await this.updateAbsenceState()
        try {
            const res = await axios.get(
                `attendance/attendanceState/${this.date}`
            )
            this.statusData = res.data[0]
            this.attLoad = true
        } catch (err) {
            console.log(err)
        }
        await this.fetchAttableUsers()
    },
    data() {
        return {
            statusData: [],
            absenceDate: [],
            attLoad: false,
            absenLoad: false,
            allUsers: [],
            attable: {
                users: [],
                excludedUsers: [],
                search: '',
                selections: [],
                isLoading: false,
            },
            userAddDialog: {
                show: false,
                search: '',
                isLoading: false,
                selections: [],
                message: '',
            },
        }
    },
    computed: {
        date() {
            return this.$route.params.day
        },
        Mdate() {
            return (
                this.$route.params.day.substr(0, 4) +
                '-' +
                this.$route.params.day.substr(4, 2) +
                '-' +
                this.$route.params.day.substr(6, 2)
            )
        },
    },
    methods: {
        async fetchAttableUsers() {
            this.attable.isLoading = true
            this.attable.selections = []

            const res = await axios.get('attendance/manage/user')
            this.attable.users = res.data.attableUsers
            this.attable.excludedUsers = res.data.excludedUsers

            this.attable.isLoading = false
        },
        async updateStateToAttendance(item) {
            try {
                await axios.post(
                    `attendance/attendancestateupdate/${this.$route.params.day}`,
                    {
                        state: 'attendance',
                        name: item.name,
                    }
                )
                item.state = 'attendance'
            } catch (err) {
                console.log(err)
            }
        },
        async updateStateToLate(item) {
            try {
                await axios.post(
                    `attendance/attendancestateupdate/${this.date}`,
                    {
                        state: 'late',
                        name: item.name,
                    }
                )
                item.state = 'late'
            } catch (err) {
                console.log(err)
            }
        },
        async updateStateToAbsence(item) {
            try {
                await axios.post(
                    `attendance/attendancestateupdate/${this.date}`,
                    {
                        state: 'absence',
                        name: item.name,
                    }
                )
                item.state = 'absence'
            } catch (err) {
                console.log(err)
            }
        },
        async updateStateToOfficialAbsence(item) {
            try {
                await axios.post(
                    `attendance/attendancestateupdate/${this.date}`,
                    {
                        state: 'official_absence',
                        name: item.name,
                    }
                )
                item.state = 'official_absence'
            } catch (err) {
                console.log(err)
            }
        },
        async updateAbsenceState() {
            for (let item of this.absenceDate) {
                if (item.approval == 'Yes') {
                    try {
                        await axios.post(
                            `attendance/attendancestateupdate/${this.date}`,
                            {
                                state: 'official_absence',
                                name: item.name,
                            }
                        )
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        },
        searchMatches(haystack, niddle) {
            return haystack.includes(niddle || '')
        },
    },
}
</script>
