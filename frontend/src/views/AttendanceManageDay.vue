<template>
    <v-card>
        <v-card-title
            v-if="this.$perm('attendance').can('read')"
            class="font-weight-thin display-3"
        >
            Daily attendance management
            <blockquote class="blockquote">
                하루의 출결 현황을 수정 및 확인하실 수 있습니다. 변경하실 내용이
                있다면, 변경할 내용을 나타내는 아이콘을 선택하시면 됩니다.
            </blockquote>
        </v-card-title>
        <v-card>
            <v-card-title
                v-if="this.$perm('attendance').can('read')"
                class=" text-center font-weight-thin display-2"
            >
                {{ this.Mdate }}
            </v-card-title>
            <v-simple-table v-if="this.$perm('attendance').can('read')">
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
                                    @click="updateStateToAttendance(item)"
                                >
                                    <v-icon>
                                        mdi-checkbox-blank-circle-outline
                                    </v-icon>
                                </v-btn>
                            </td>

                            <td v-if="item.state == 'late'" class="flex-grow-0">
                                <v-btn text icon color="orange" dark>
                                    <v-icon> mdi-triangle-outline </v-icon>
                                </v-btn>
                            </td>
                            <td v-if="item.state != 'late'" class="flex-grow-0">
                                <v-btn
                                    text
                                    icon
                                    color="gray"
                                    @click="updateStateToLate(item)"
                                >
                                    <v-icon> mdi-triangle-outline </v-icon>
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
                                <v-btn text icon color="red" dark>
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
                                    @click="updateStateToOfficialAbsence(item)"
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
                <v-alert type="error" v-if="!$perm('attendance').can('read')">
                    권한이 없습니다.
                </v-alert>
            </div>
        </v-card>
        <v-card>
            <v-card-title
                v-if="this.$perm('attendance').can('read')"
                class=" text-center font-weight-thin display-1"
            >
                공결신청내역
            </v-card-title>
            <v-simple-table v-if="this.$perm('attendance').can('read')">
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
                <v-alert type="warning" v-if="absenceDate == []">
                    공결정보가 없습니다.
                </v-alert>
            </div>
            <div>
                <v-alert type="error" v-if="!$perm('attendance').can('read')">
                    권한이 없습니다.
                </v-alert>
            </div>
        </v-card>
    </v-card>
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
        } catch (err) {
            console.log(err)
        }
        await this.updateAbsenceState()
        try {
            const res = await axios.get(
                `attendance/attendanceState/${this.date}`
            )
            this.statusData = res.data[0]
        } catch (err) {
            console.log(err)
        }
    },
    data() {
        return {
            statusData: [],
            absenceDate: [],
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
    },
}
</script>
