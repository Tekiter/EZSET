<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="dataItems"
            item-key="day"
            class="elevation-1"
            :search="search"
            :custom-filter="filterOnlyCapsText"
        >
            <template v-slot:item="{ item, headers }">
                <tr>
                    <td v-for="(header, idx) in headers" :key="idx">
                        <template v-if="header.value == 'day'">
                            {{ item[header.value] }}
                        </template>
                        <template v-else>
                            <v-icon v-if="item[header.value] == 'attendance'"
                                >mdi-checkbox-blank-circle-outline</v-icon
                            >
                            <v-icon v-else-if="item[header.value] == 'late'"
                                >mdi-triangle-outline</v-icon
                            >
                            <v-icon v-else-if="item[header.value] == 'absence'"
                                >mdi-close</v-icon
                            >
                            <v-icon
                                v-else-if="
                                    item[header.value] == 'official_absence'
                                "
                                >mdi-close-circle-outline</v-icon
                            >
                        </template>
                    </td>
                </tr>
            </template>
            <!-- <template v-slot:top>
                <v-text-field
                    v-model="search"
                    label="Search (UPPER CASE ONLY)"
                    class="mx-4"
                ></v-text-field>
            </template> -->
            <!-- <template v-slot:body.append>
                <tr>
                    <td></td>
                     <td>
                        <v-text-field
                            v-model="attendanceDayData"
                            type="number"
                            label="Less than"
                        ></v-text-field>
                    </td>
                    <td colspan="4"></td>
                </tr>
            </template> -->
        </v-data-table>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    async created() {
        try {
            const res = await axios.get('attendance/attendanceUserList')
            this.userList = res.data
        } catch (err) {
            console.log(err)
        }
        try {
            const res = await axios.get('attendance/attendanceDayList')
            this.attendanceDayData = res.data
        } catch (err) {
            console.log(err)
        }
    },
    data() {
        return {
            search: '',
            calories: '',
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%',
                },
            ],
            attendanceDayData: [],
            userList: [],
        }
    },
    computed: {
        headers() {
            // return [
            //     {
            //         text: 'Dessert (100g serving)',
            //         align: 'left',
            //         sortable: false,
            //         value: 'day',
            //     },
            // {
            //     text: 'Calories',
            //     value: 'calories',
            //     filter: value => {
            //         if (!this.calories) return true

            //         return value < parseInt(this.calories)
            //     },
            // },
            // { text: 'Fat (g)', value: 'fat' },
            // { text: 'Carbs (g)', value: 'carbs' },
            // { text: 'Protein (g)', value: 'protein' },
            // { text: 'Iron (%)', value: 'iron' },
            //     { text: '아이디', value: 'username' },
            // ]
            // {
            //         text: 'Dessert (100g serving)',
            //         align: 'left',
            //         sortable: false,
            //         value: 'day',
            //     },
            const cols = this.userList.map(user => {
                return { text: user.username, value: user.username }
            })
            return [{ text: '날짜', value: 'day' }, ...cols]
            // return [{ text: '날짜', value: 'day' }].concat(cols)
        },
        dataItems() {
            return this.attendanceDayData.map(item => {
                const output = {
                    day: item.day,
                }

                item.status.forEach(st => {
                    output[st.name] = st.state
                })

                return output
            })
        },
    },
    methods: {
        filterOnlyCapsText(value, search, item) {
            return (
                value != null &&
                search != null &&
                typeof value === 'string' &&
                value
                    .toString()
                    .toLocaleUpperCase()
                    .indexOf(search) !== -1
            )
        },
    },
}
</script>
