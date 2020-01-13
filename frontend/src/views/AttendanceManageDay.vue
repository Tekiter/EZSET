<template>
    <v-card>
        <v-simple-table>
            <template v-slot:default>
                <!-- <thead>
                    <tr>
                        <th class="text-left">이름</th>
                        <th></th>
                        <th class="text-left">출석현황</th>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <th><div style="min-width: 300px"></div></th>
                        <th>출석</th>
                        <th>지각</th>
                        <th>결석</th>
                        <th>인정결석</th>
                    </tr>
                </thead> -->
                <thead>
                    <tr class="d-flex">
                        <th class="flex-grow-1">이름</th>
                        <th class="flex-grow-0">출석</th>
                        <th class="flex-grow-0">지각</th>
                        <th class="flex-grow-0">결석</th>
                        <th class="flex-grow-0">인정결석</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in desserts"
                        :key="item.name"
                        class="d-flex"
                    >
                        <td class="flex-grow-1">{{ item.calories }}</td>
                        <td class="flex-grow-0">출석</td>
                        <td class="flex-grow-0">지각</td>
                        <td class="flex-grow-0">결석</td>
                        <td class="flex-grow-0">ㅇㅈ</td>
                        <!-- <th class="text-left">Name</th>
                        <th class="text-left">state</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in statusData.status" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.state }}</td>
                    </tr> -->
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
