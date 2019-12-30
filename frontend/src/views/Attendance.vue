<template>
    <v-form>
        <v-card class="mx-auto" max-width="400" v-if="flag">
            <v-card-title>
                <v-text-field v-model="input_attendance_code"></v-text-field>
            </v-card-title>

            <v-card-actions>
                <v-btn color="purple" text>
                    출석하기
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="mx-auto" max-width="400" v-if="flag">
            <v-card-title>
                <v-text-field v-model="output_attendance_code"></v-text-field>
            </v-card-title>
            <v-card-actions>
                <v-btn color="purple" text v-if="flag" @click="endAttendance">
                    종료
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="mx-auto" max-width="400" text v-if="!flag">
            <v-card-actions>
                <v-btn color="purple" text @click="startAttendance">
                    시작
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>
<script>
// import axios from 'axios'
export default {
    name: 'attendance',
    created() {
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
            console.log('output_attendance_cod:' + this.output_attendance_code)
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
        },
    },
}
</script>
