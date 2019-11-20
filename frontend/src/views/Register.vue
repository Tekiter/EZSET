<template>
    <v-app>
        <v-app-bar app clipped-left>
            <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
            <v-toolbar-title>EZSET 회원가입</v-toolbar-title>
        </v-app-bar>
        <v-content>
            <v-card :loading="isloading">
                <v-stepper v-model="curpage" vertical>
                    <v-stepper-step
                        :complete="curpage > 1"
                        :rules="[() => !errorRequiredStep]"
                        step="1"
                    >
                        필수정보입력
                    </v-stepper-step>

                    <v-stepper-content step="1">
                        <v-text-field
                            v-model="form.realname"
                            label="name"
                            @input="removeError('realname')"
                            :error-messages="errors.realname"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.username"
                            label="ID"
                            @input="removeError('username')"
                            :error-messages="errors.username"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.password"
                            label="password"
                            @input="removeError('password')"
                            :error-messages="errors.password"
                            type="password"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="form.confirmpassword"
                            label="confirm password"
                            @input="removeError('confirmpassword')"
                            :error-messages="errors.confirmpassword"
                            type="password"
                            required
                        ></v-text-field>
                    </v-stepper-content>

                    <v-stepper-step :complete="curpage > 2" step="2"
                        >추가정보입력</v-stepper-step
                    >

                    <v-stepper-content step="2">
                        <v-text-field
                            v-model="form.email"
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
                username: '',
                password: '',
                confirmpassword: '',
                realname: '',
                email: '',
            },
            errors: {
                username: '',
                realname: '',
                password: '',
                confirmpassword: '',
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
        errorRequiredStep() {
            if (
                this.errors.username != '' ||
                this.errors.realname != '' ||
                this.errors.password != '' ||
                this.errors.confirmpassword != ''
            ) {
                return true
            }
            return false
        },
    },
    methods: {
        async finish() {
            this.clearErrors()
            if (!this.checkValid()) {
                return
            }
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
        checkValid() {
            let result = true
            if (this.form.username == '') {
                this.errors.username = '아이디를 입력해주세요'
                result = false
            }
            if (this.form.realname == '') {
                this.errors.realname = '이름을 입력해주세요'
                result = false
            }
            if (this.form.password == '') {
                this.errors.password = '비밀번호를 입력해주세요'
                result = false
            }
            if (this.form.confirmpassword == '') {
                this.errors.confirmpassword = '비밀번호를 입력해주세요'
                result = false
            }
            if (this.form.password !== this.form.confirmpassword) {
                this.errors.confirmpassword =
                    '비밀번호 확인이 일치하지 않습니다.'
                result = false
            }
            return result
        },
        clearErrors() {
            const keys = Object.keys(this.errors)
            keys.forEach(i => {
                this.errors[i] = ''
            })
        },
        removeError(field) {
            this.errors[field] = ''
        },
    },
}
</script>
