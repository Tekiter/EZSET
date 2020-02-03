<template>
    <v-container class="fill-height">
        <v-row class="fill-height">
            <v-col cols="6" class="fill-height">
                <v-card class="fill-height">
                    <v-card-title>
                        출석 설정
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="6" class="fill-height">
                <v-card class="fill-height">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            출석 대상 유저
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-row no-gutters>
                        <v-col cols="4">유저1 </v-col>
                        <v-col cols="4">유저2 </v-col>
                        <v-col cols="4">유저3 </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<style scoped>
.fill-screen {
    min-height: 95%;
}
</style>
<script>
export default {}
</script>
