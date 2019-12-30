<template>
    <v-form>
        <v-card class="mx-auto" max-width="400">
            <v-card-title>
                <v-text-field label="출석번호"></v-text-field>
            </v-card-title>

            <v-card-actions>
                <v-btn color="purple" text>
                    Check me!
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="mx-auto" max-width="400">
            <v-card-title>
                <v-text-field label="출석번호"></v-text-field>
            </v-card-title>

            <v-card-actions>
                <v-btn color="purple" text>
                    시작
                </v-btn>
                <v-btn color="purple" text>
                    종료
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>
<script>
// import axios from 'axios'
export default {
    name: 'attendence',
    data() {},
}
</script>
