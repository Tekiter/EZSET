<template>
    <v-container>
        <v-form>
            <v-card class="mx-auto" max-width="400" v-if="flag">
                <v-card-title>
                    <v-text-field
                        v-model="input_attendance_code"
                    ></v-text-field>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="purple" text @click="attendanceCheck"
                        >출석하기</v-btn
                    >
                </v-card-actions>
            </v-card>

            <v-card class="mx-auto" max-width="400" v-if="flag">
                <v-card-title> {{ output_attendance_code }} </v-card-title>
                <v-card-actions>
                    <v-btn
                        color="purple"
                        text
                        v-if="flag"
                        @click="endAttendance"
                        >종료</v-btn
                    >
                </v-card-actions>
            </v-card>

            <v-card class="mx-auto" max-width="400" text v-if="!flag">
                <v-card-actions>
                    <v-btn color="purple" text @click="startAttendance"
                        >시작</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-form>

        <v-snackbar v-model="snackbar_c" multi-line="multiLine" color="success"
            >출석되었습니다.
            <v-btn dark text @click="close"> Close</v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar_e" multi-line="multiLine" color="error"
            >번호가 일치하지 않습니다.
            <v-btn dark text @click="closeSnack"> Close</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
import axios from 'axios'
export default {
    name: 'attendance',
    created() {
        this.$socket.emit('join', {
            roomName: 'attendance',
        })
        this.$socket.on('attendance', data => {
            this.flag = data.flag
            this.output_attendance_code = data.output_attendance_code
        })
    },

    data() {
        return {
            socket_id: '',
            input_attendance_code: '',
            output_attendance_code: '',
            flag: false,
            snackbar_c: false,
            snackbar_e: false,
        }
    },
    methods: {
        checkAttendanceCode() {
            //입력받은 코드와 전달받은 코드 일치 확인
        },
        startAttendance() {
            this.output_attendance_code = Math.floor(
                Math.random() * (999 - 100) + 100
            )
            this.$socket.emit('attendance', {
                flag: true,
                output_attendance_code: this.output_attendance_code,
            })
            this.flag = true
            this.output_attendance_code = this.output_attendance_code
        },
        endAttendance() {
            this.$socket.emit('attendance', {
                flag: false,
            })
            this.flag = false
            this.input_attendance_code = ''
        },
        attendanceCheck() {
            if (this.input_attendance_code == this.output_attendance_code) {
                axios
                    .post('', {
                        //name: ,
                        state: 'attendance',
                    })
                    .then(res => {
                        axios
                            .post('', {
                                state: 'attendance',
                            })
                            .then(res => {
                                this.snackbar_c = true
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else this.snackbar_e = true
        },
        close() {
            this.input_attendance_code = ''
            this.$router.push('/')
        },
        closeSnack() {
            this.snackbar_e = false
            this.input_attendance_code = ''
        },
        /*
        created() {
            try {
                const res = await axios.get(``)
            }
            catch (err) {
                console.log(err)
            }
        },
        */
    },
}
</script>
