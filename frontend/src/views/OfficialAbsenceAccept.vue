<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card max-width="344">
                    <v-card-title>이름</v-card-title>
                    <v-card-subtitle>날짜</v-card-subtitle>
                    <v-card-text>
                        <div class="text--primary">
                            내용
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="deep-purple accent-4">
                            승인
                        </v-btn>
                        <v-btn text color="deep-purple accent-4">
                            승인취소
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col>
                <v-card max-width="344">
                    <v-card-title>이름</v-card-title>
                    <v-card-subtitle>날짜</v-card-subtitle>
                    <v-card-text>
                        <div class="text--primary">
                            내용
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="deep-purple accent-4">
                            승인
                        </v-btn>
                        <v-btn text color="deep-purple accent-4">
                            승인취소
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col>
                <v-card max-width="344">
                    <v-card-text>
                        <div>Word of the Day</div>
                        <p class="display-1 text--primary">
                            be•nev•o•lent
                        </p>
                        <p>adjective</p>
                        <div class="text--primary">
                            well meaning and kindly.<br />
                            "a benevolent smile"
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="deep-purple accent-4">
                            Learn More
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card max-width="344">
                    <v-card-text>
                        <div>Word of the Day</div>
                        <p class="display-1 text--primary">
                            be•nev•o•lent
                        </p>
                        <p>adjective</p>
                        <div class="text--primary">
                            well meaning and kindly.<br />
                            "a benevolent smile"
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="deep-purple accent-4">
                            Learn More
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
    data: () => ({
        Official_Absence: [],
    }),
    created() {
        const cusur = await axios.get()
    },
    method: {},
}
</script>
