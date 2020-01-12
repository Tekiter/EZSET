<template>
    <v-card>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">state</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in statusData.status" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.state }}</td>
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
}
</script>
