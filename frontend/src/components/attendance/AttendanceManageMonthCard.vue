<template>
    <div>
        <v-card outlined>
            <div class="d-flex align-center mx-4 my-6">
                <span class="headline">
                    {{ realname }}
                </span>
                <span class="subtitle-1 ml-2">
                    {{ username }}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="$perm('attendance').can('update')"
                    @click="changeDialogstate(true)"
                    icon
                    small
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>
            <v-divider></v-divider>
            <v-card-text>
                <div class="d-flex">
                    <div class="d-flex flex-wrap flex-grow-1">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="success" v-on="on"
                                    >mdi-checkbox-blank-circle-outline</v-icon
                                >
                            </template>
                            <span>출석</span>
                        </v-tooltip>
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1 headline">
                        {{ attendance.attendance }}
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="warning" v-on="on"
                                    >mdi-triangle-outline</v-icon
                                >
                            </template>
                            <span>지각</span>
                        </v-tooltip>
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1 headline">
                        {{ attendance.late }}
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="error" v-on="on"
                                    >mdi-close</v-icon
                                >
                            </template>
                            <span>결석</span>
                        </v-tooltip>
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1 headline">
                        {{ attendance.absence }}
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon color="success" v-on="on"
                                    >mdi-close-circle-outline</v-icon
                                >
                            </template>
                            <span>공결</span>
                        </v-tooltip>
                    </div>
                    <div class="d-flex flex-wrap flex-grow-1 headline">
                        {{ attendance.official_absence }}
                    </div>
                </div>
            </v-card-text>
        </v-card>
        <!-- 유저 출결 정보 Dialog -->
        <v-dialog
            v-model="attendanceUserDialog.show"
            persistent
            max-width="350px"
        >
            <AttendanceManageMonthDialog
                v-bind:username="username"
                :realname="realname"
                :Sdate="Sdate"
                :Edate="Edate"
                :attendanceInfo="attendance.info"
                @closeDialog="changeDialogstate"
                @fetchDialog="getAttendanceInfo"
            ></AttendanceManageMonthDialog>
        </v-dialog>
    </div>
</template>

<script>
import AttendanceManageMonthDialog from '../../components/attendance/AttendanceManageMonthDialog'
import { AttendanceService } from '../../service/attendance.service'
export default {
    name: 'AttendanceManageMonthCard',
    props: ['username', 'realname', 'Sdate', 'Edate'],
    components: {
        AttendanceManageMonthDialog,
    },
    data: function() {
        return {
            attendance: {
                info: [],
                attendance: 0,
                late: 0,
                absence: 0,
                official_absence: 0,
            },
            attendanceUserDialog: {
                show: false,
            },
        }
    },
    async created() {
        await this.getAttendanceInfo()
    },
    watch: {
        Sdate() {
            this.getAttendanceInfo()
        },
        Edate() {
            this.getAttendanceInfo()
        },
    },
    methods: {
        async getAttendanceInfo() {
            this.attendance.info = []
            this.attendance.info = await AttendanceService.getAttendanceByUsernameAndDateBetweenStartDateAndEndDate(
                this.username,
                this.Sdate,
                this.Edate
            )
            this.attendance.attendance = 0
            this.attendance.late = 0
            this.attendance.absence = 0
            this.attendance.official_absence = 0

            this.attendance.info.forEach(attendance => {
                if (attendance.state == 'attendance')
                    this.attendance.attendance += 1
                else if (attendance.state == 'late') this.attendance.late += 1
                else if (attendance.state == 'absence')
                    this.attendance.absence += 1
                else if (attendance.state == 'official_absence')
                    this.attendance.official_absence += 1
            })
        },
        async changeDialogstate(value) {
            this.attendanceUserDialog.show = value
            // this.$emit('fetch', true)
            this.getAttendanceInfo()
        },
    },
}
</script>
