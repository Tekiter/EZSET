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
                    flag == true &&
                    starter == this.$store.state.auth.user.username
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
                        {{ code }}
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
            v-if="
                flag == true &&
                    starter != this.$store.state.auth.user.username &&
                    result == 0
            "
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
                <v-btn
                    text
                    large
                    @click="attendanceCheck(input_attendance_code)"
                    >출석하기</v-btn
                >
            </div>
        </v-card>
        <div>
            <v-alert
                type="warning"
                v-if="!this.$perm('attendance').can('update') && flag == false"
            >
                출석 체크가 진행 중이지 않습니다.
            </v-alert>
            <v-alert
                type="success"
                v-if="
                    flag == true &&
                        result == 1 &&
                        starter != this.$store.state.auth.user.username
                "
            >
                출석하셨습니다!
            </v-alert>
        </div>
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
    </v-container>
</template>
<script>
import moment from 'moment'
import socket from './../../utils/socket.io/socket.service'

export default {
    name: 'attendance',
    data() {
        return {
            input_attendance_code: '',
            flag: false,
            code: 0,
            starter: '',
            remainTime: 0,
            result: 0,
            interval: '',
            snackbar: {
                show: false,
                text: '',
                color: '',
            },
        }
    },
    async created() {
        await socket.emit('join', {
            roomName: 'attendance',
            user: this.$store.state.auth.user.username,
        })
        await socket.on('admin', data => {
            this.code = data.code
            this.tick()
        })
        await socket.on('init', data => {
            this.flag = data.flag
            this.remainTime = data.time
            this.starter = data.starter
            this.result = data.result
        })
        await socket.on('state', data => {
            this.flag = data.flag
            this.starter = data.starter

            if (
                this.starter != this.$store.state.auth.user.username &&
                this.flag == true
            ) {
                this.attendanceCheck(-1)
            }

            if (data.flag == false) {
                this.code = 0
                this.result = 0
                this.remainTime = 0
                this.input_attendance_code = ''
                clearInterval(this.interval)
            }
        })
        await socket.on('result', data => {
            if (data === 'fail')
                this.openSnackbar('번호가 일치하지 않습니다', 'error')
            else if (data === 'already') {
                this.openSnackbar('이미 오늘 출석하셨습니다.', '#FFA000')
                this.result = 1
            } else if (data === 'prepare')
                this.openSnackbar('출석코드를 입력해주세요.', 'success')
            else {
                this.openSnackbar('출석하셨습니다.', 'success')
                this.result = 1
                this.input_attendance_code = ''
            }
        })
    },
    mounted() {
        if (this.flag == true) this.tick()
    },
    methods: {
        async startAttendance() {
            this.remainTime = 180000
            this.code = Math.floor(Math.random() * (999 - 100 + 1)) + 100
            socket.emit('start', {
                code: this.code,
                starter: this.$store.state.auth.user.username,
            })
            this.tick()
        },
        async endAttendance() {
            socket.emit('stop')
            this.input_attendance_code = ''
            clearInterval(this.interval)
            this.$router.push(
                `/AttendanceManageDay/${moment().format('YYYYMMDD')}`
            )
        },
        async attendanceCheck(code) {
            socket.emit('check', {
                code,
                user: this.$store.state.auth.user.username,
            })
        },
        tick() {
            this.interval = setInterval(() => {
                this.remainTime -= 1000
                if (this.remainTime == 0) {
                    this.$router.push(
                        `/AttendanceManageDay/${moment().format('YYYYMMDD')}`
                    )
                }
                if (this.flag == false) clearInterval(this.interval)
            }, 1000)
        },
        openSnackbar(text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.show = true
        },
    },
    computed: {
        timer() {
            var tmp = parseInt(this.remainTime / 1000 / 60) + ' : '
            if (parseInt((this.remainTime / 1000) % 60) == 0) return tmp + '00'
            else {
                if (parseInt((this.remainTime / 1000) % 60) < 10)
                    return tmp + '0' + ((this.remainTime / 1000) % 60)
                else return tmp + ((this.remainTime / 1000) % 60)
            }
        },
    },
}
</script>
