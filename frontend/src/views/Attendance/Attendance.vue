<template>
    <v-container>
        <v-card
            class="mx-auto"
            max-width="500"
            max-height="500"
            v-if="flag == true && code == 0 && output_attendance_code == ''"
        >
            <v-card-title>
                <v-text-field v-model="input_attendance_code"></v-text-field>
            </v-card-title>

            <v-card-actions>
                <v-btn color="purple" text @click="attendanceCheck"
                    >출석하기</v-btn
                >
            </v-card-actions>
        </v-card>
        <v-card
            class="mx-auto"
            max-width="500"
            max-height="500"
            v-if="
                flag &&
                    this.$perm('attendance').can('update') &&
                    this.output_attendance_code != ''
            "
        >
            <v-card-text>
                <div class="d-flex justify-center">
                    <span class="display-3">{{ output_attendance_code }}</span>
                </div>
                <div class="d-flex justify-center">
                    <v-btn
                        color="purple"
                        text
                        v-if="flag"
                        @click="endAttendance"
                        large
                        >종료</v-btn
                    >
                </div>
            </v-card-text>
        </v-card>

        <v-card
            class="mx-auto"
            max-width="500"
            max-height="500"
            text
            v-if="!flag && this.$perm('attendance').can('update')"
        >
            <v-card-actions>
                <v-btn color="purple" text @click="startAttendance" large
                    >시작</v-btn
                >
            </v-card-actions>
        </v-card>
        <div>
            <v-alert
                type="warning"
                v-if="!this.$perm('attendance').can('update') && flag == false"
            >
                출석중이 아닙니다.
            </v-alert>
            <v-alert
                type="success"
                v-if="
                    !this.$perm('attendance').can('update') &&
                        flag == true &&
                        code == 1
                "
            >
                이미 출석하셨습니다!
            </v-alert>
        </div>

        <v-snackbar v-model="snackbar_c" color="success">
            출석되었습니다.
            <v-btn dark text @click="close">Close</v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar_e" color="error">
            번호가 일치하지 않습니다.
            <v-btn dark text @click="closeSnack">Close</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
export default {
    name: 'attendance',
    async created() {
        await this.$socket.emit('join', {
            roomName: 'attendance',
        })
        await this.$socket.on('attendance', data => {
            this.flag = data.flag
        })
        try {
            const res = await axios.get('attendance/attendanceCheck')
            this.code = parseInt(res.data)
        } catch (err) {
            //
        }
        const res = await axios.get('attendance/attendanceCheckAdmin')
        if (res.data != 0) this.output_attendance_code = parseInt(res.data)
        else this.output_attendance_code = 0
    },

    data() {
        return {
            socket_id: '',
            input_attendance_code: '',
            output_attendance_code: '',
            flag: false,
            snackbar_c: false,
            snackbar_e: false,
            attendanceCard: true,
            code: 0,
        }
    },
    methods: {
        async startAttendance() {
            try {
                const res_code = await axios.post('attendance/startAttendance')
                this.output_attendance_code = res_code.data.code
                this.code = 1
            } catch (err) {
                //
            }
            this.$socket.emit('attendance', {
                flag: true,
            })
            this.$socket.emit('start', {
                flag: true,
            })
            this.flag = true
        },
        async endAttendance() {
            this.$socket.emit('attendance', {
                flag: false,
            })
            this.flag = false
            this.input_attendance_code = ''
            await axios.post('attendance/attendanceCheckEnd')
            this.$router.push(
                `/AttendanceManageDay/${moment().format('YYYYMMDD')}`
            )
        },
        async attendanceCheck() {
            try {
                const res = await axios.post('attendance/attendanceWrite', {
                    code: this.input_attendance_code,
                    state: 'attendance',
                })
                if (res.data.result) {
                    this.snackbar_c = true
                    setTimeout(() => {
                        this.$router.push('/')
                    }, 2000)
                } else this.snackbar_e = true
            } catch (err) {
                //
            }
        },
        close() {
            this.input_attendance_code = ''
            this.$router.push('/')
        },
        closeSnack() {
            this.snackbar_e = false
            this.input_attendance_code = ''
        },
    },
}
</script>
