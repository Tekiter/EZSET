<template>
    <v-app>
        <v-app-bar app clipped-left>
            <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
            <v-toolbar-title>EZSET 회원가입</v-toolbar-title>
        </v-app-bar>
        <v-content>
            <v-card :loading="isloading">
                <v-stepper v-model="curpage" vertical>
                    <v-stepper-step :complete="curpage > 1" step="1">
                        필수정보입력
                    </v-stepper-step>

                    <v-stepper-content step="1">
                        <v-text-field
                            v-model="form.realname"
                            :counter="10"
                            label="name"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.id"
                            :counter="10"
                            label="ID"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.password"
                            :counter="10"
                            label="password"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.confirmpassword"
                            :counter="10"
                            label="confirm password"
                            required
                        ></v-text-field>
                    </v-stepper-content>

                    <v-stepper-step :complete="curpage > 2" step="2"
                        >추가정보입력</v-stepper-step
                    >

                    <v-stepper-content step="2">
                        <v-text-field
                            v-model="form.email"
                            :counter="50"
                            label="E-mail"
                            required
                        ></v-text-field>
                    </v-stepper-content>

                    <v-row>
                        <v-col class="d-flex flex-row justify-center">
                            <v-btn
                                class="mr-3"
                                color="primary"
                                @click="curpage -= 1"
                                v-if="curpage != 1"
                                >이전</v-btn
                            >
                            <v-btn
                                color="primary"
                                @click="curpage += 1"
                                v-if="curpage != maxpage"
                                >다음</v-btn
                            >
                            <v-btn
                                color="primary"
                                @click="finish"
                                v-if="curpage == maxpage"
                                >완료</v-btn
                            >
                        </v-col>
                    </v-row>
                </v-stepper>
            </v-card>
        </v-content>
    </v-app>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            form: {
                id: '',
                password: '',
                confirmpassword: '',
                realname: '',
                email: '',
            },
            curpage: 1,
            isloading: false,
        }
    },
    computed: {
        maxpage() {
            return 2
        },
    },
    methods: {
        async finish() {
            this.isloading = true
            try {
                const res = await axios.post('auth/register', {
                    username: this.form.id,
                    password: this.form.password,
                    realname: this.form.realname,
                })
                console.log(res) // eslint-disable-line no-console
            } catch (error) {
                console.log(error.response) // eslint-disable-line no-console
            } finally {
                this.isloading = false
            }
        },
    },
}
</script>
