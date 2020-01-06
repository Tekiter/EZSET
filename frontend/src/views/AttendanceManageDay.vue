<template></template>
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
                    name: '씨발',
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
        /*
        created() {
            try {
                const res = await axios.get('attendance/attendanceCheck')
                if(res.data.result)
                else
            }
            catch (err) {
                console.log(err)
            }
        },
        */
    },
}
</script>
