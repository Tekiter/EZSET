<template>
    <v-container>
        <v-form>
            <v-card class="mx-auto" max-width="400" v-if="flag==true && code==0">
                <v-card-title>
                    <v-text-field v-model="input_attendance_code"></v-text-field>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="purple" text @click="attendanceCheck">출석하기</v-btn>
                </v-card-actions>
            </v-card>
            <v-card class="mx-auto" max-width="400" v-if="flag">
                <v-card-title>{{ output_attendance_code }}</v-card-title>
                <v-card-actions>
                    <v-btn color="purple" text v-if="flag" @click="endAttendance">종료</v-btn>
                </v-card-actions>
            </v-card>

            <v-card class="mx-auto" max-width="400" text v-if="!flag">
                <v-card-actions>
                    <v-btn color="purple" text @click="startAttendance">시작</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>

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
import axios from 'axios'
export default {
    name: 'attendance',
    async created() {
        this.$socket.emit('join', {
            roomName: 'attendance',
        })
        this.$socket.on('attendance', data => {
            this.flag = data.flag
        })
        try {
            const res = await axios.get('attendance/attendanceCheck')
            this.code = parseInt(res.data)
            // console.log(res.data)
            // if (this.code == 1 && this.flag == true) {
            //     this.endCard = false
            //     this.attendanceCard = false
            // }
        } catch (err) {
            console.log(err)
        }
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
                const res_code = await axios.get('attendance/startAttendance')
                this.output_attendance_code = res_code.data.code
            } catch (err) {
                console.log(err)
            }
            this.$socket.emit('attendance', {
                flag: true,
            })
            this.flag = true
        },
        endAttendance() {
            this.$socket.emit('attendance', {
                flag: false,
            })
            this.flag = false
            this.input_attendance_code = ''
        },
        async attendanceCheck() {
            try {
                const res = await axios.post('attendance/attendanceWrite', {
                    code: this.input_attendance_code,
                    name: 'wldbs2043',
                    state: 'attendance',
                })
                if (res.data.result) this.snackbar_c = true
                else this.snackbar_e = true
            } catch (err) {
                console.log(err)
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
