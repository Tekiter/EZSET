<template>
    <v-container>
        <!--출석 시작 카드-->
        <v-card
            class="mx-auto"
            max-width="500"
            max-height="500"
            color="primary lighten-1"
            :dark="isDarkColor('primary')"
            v-if="!flag && this.$perm('attendance').can('update')"
        >
            <v-toolbar flat color="primary">
                <v-icon class="mr-2">mdi-clipboard-check-outline</v-icon>
                <v-toolbar-title class="font-weight-light">
                    출석</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn text small @click="startAttendance">start</v-btn>
            </v-toolbar>
            <v-card-text>
                우측 상단의 버튼을 누르면 출석을 시작합니다.
            </v-card-text>
        </v-card>
        <!-- 출석 끝내는 카드 -->
        <v-card
            class="mx-auto"
            max-width="500"
            max-height="500"
            color="primary lighten-1"
            :dark="isDarkColor('primary')"
            v-if="
                flag &&
                    this.$perm('attendance').can('update') &&
                    this.output_attendance_code != ''
            "
        >
            <v-toolbar flat color="primary">
                <v-icon>mdi-clipboard-check-outline</v-icon>
                <v-toolbar-title class="font-weight-light">
                    출석</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn text small @click="endAttendance"> end</v-btn>
            </v-toolbar>
            <v-card-text>
                <div class="text-center">
                    남은시간
                    <div class="display-3">{{ timer }}</div>

                    <v-divider></v-divider>
                    출석 번호
                    <div class="display-3">
                        {{ output_attendance_code }}
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- 사용자들이 출석하는 카드 -->
        <v-card
            class="mx-auto"
            max-width="500"
            max-height="500"
            color="primary lighten-1"
            :dark="isDarkColor('primary')"
            v-if="flag == true && code == 0 && output_attendance_code == ''"
        >
            <v-toolbar flat color="primary">
                <v-icon>mdi-clipboard-check-outline</v-icon>
                <v-toolbar-title class="font-weight-light">
                    출석</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn color="white" text small @click="endAttendance"> </v-btn>
            </v-toolbar>
            <div class="d-flex justify-center">
                <v-col cols="12" sm="6">
                    <v-text-field
                        v-model="input_attendance_code"
                        autofocus
                    ></v-text-field>
                </v-col>
            </div>
            <div class="d-flex justify-center">
                <v-btn text large @click="attendanceCheck">출석하기</v-btn>
            </div>
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

        <!-- 출석 된 것을 확인 -->
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
            this.remainTime = data.time
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

        if (this.flag == true) this.tick()
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
            remainTime: 0,
            interval: '',
        }
    },
    methods: {
        async startAttendance() {
            const res_code = await axios.post('attendance/startAttendance')
            this.output_attendance_code = res_code.data.code
            this.code = 1
            this.$socket.emit('attendance', {
                flag: true,
            })
            this.$socket.emit('start', {
                flag: true,
            })
            this.flag = true
            this.tick()
        },
        async endAttendance() {
            this.$socket.emit('attendance', {
                flag: false,
            })
            this.flag = false
            this.input_attendance_code = ''
            await axios.post('attendance/attendanceCheckEnd')
            clearInterval(this.interval)
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
        tick() {
            this.interval = setInterval(() => {
                this.remainTime -= 1000
                if (this.remainTime == 0) {
                    this.$socket.emit('attendance', {
                        flag: false,
                    })
                    this.$router.push(
                        `/AttendanceManageDay/${moment().format('YYYYMMDD')}`
                    )
                }
                if (this.flag == false) clearInterval(this.interval)
            }, 1000)
        },
    },
    computed: {
        timer() {
            var tmp = parseInt(this.remainTime / 1000 / 60) + ' : '
            if (parseInt((this.remainTime / 1000) % 60) == 0) return tmp + '00'
            // else return tmp + ((this.remainTime / 1000) % 60)
            else {
                if (parseInt((this.remainTime / 1000) % 60) < 10)
                    return tmp + '0' + ((this.remainTime / 1000) % 60)
                else return tmp + ((this.remainTime / 1000) % 60)
            }
        },
    },
}
</script>
