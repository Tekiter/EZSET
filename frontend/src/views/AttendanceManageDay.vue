<template>
    <v-card>
        <v-simple-table>
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
                        <td v-if="item.state == 'absence'" class="flex-grow-0">
                            <v-btn text icon color="red" dark>
                                <v-icon> mdi-close </v-icon>
                            </v-btn>
                        </td>
                        <td v-if="item.state != 'absence'" class="flex-grow-0">
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
    </v-card>
</template>
<script>
import axios from 'axios'
export default {
    async created() {
        try {
            const res = await axios.get(
                `attendance/attendanceState/${this.date}`
            )
            this.statusData = res.data[0]
            console.log(this.statusData)
        } catch (err) {
            console.log(err)
        }
    },
    data() {
        return {
            statusData: '',
        }
    },
    computed: {
        date() {
            return this.$route.params.day
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
    },
}
</script>
