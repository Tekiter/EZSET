<template>
    <v-form>
        <v-card class="mx-auto" max-width="400" v-if="flag">
            <v-card-title>
                <v-text-field label="출석번호"></v-text-field>
            </v-card-title>

            <v-card-actions>
                <v-btn color="purple" text>
                    Check me!
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="mx-auto" max-width="400" v-if="flag">
            <v-card-title>
                {{ attnum }}
            </v-card-title>
            <v-card-actions>
                <v-btn color="purple" text>
                    종료
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="mx-auto">
            <v-btn color="purple" text v-if="!flag">
                시작
            </v-btn>
        </v-card>
    </v-form>
</template>
<script>
// import axios from 'axios'
export default {
    name: 'attendence',
    created() {
        this.$socket.on('attendence', data => {
            this.textarea += data.socket_id + ' : ' + data.message + '\n'
        })
    },
    data() {
        return {
            textarea: '',
            message: '',
            socket_id: '',
            admin: '',
            user: '',
            attnum: '399',
            flag: '0',
        }
    },
    methods: {
        sendMessage() {
            this.$socket.emit('attendence', {
                message: this.message,
                socket_id: this.$socket.id,
            })
            this.textarea += this.$socket.id + ' : ' + this.message + '\n'
            this.message = ''
        },
    },
}
</script>
