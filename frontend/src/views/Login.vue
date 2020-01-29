<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12" :loading="loading">
                    <v-form @submit="onLogin">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>로그인</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-text-field
                                label="Username"
                                name="login"
                                prepend-icon="fas fa-user"
                                type="text"
                                v-model="user.username"
                                :error="!!errorMsg"
                            />

                            <v-text-field
                                id="password"
                                label="Password"
                                name="password"
                                prepend-icon="fas fa-lock"
                                type="password"
                                v-model="user.password"
                                :error="!!errorMsg"
                                :error-messages="errorMsg"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                type="submit"
                                color="primary"
                                :to="'/register'"
                                >Sign up</v-btn
                            >
                            <v-btn type="submit" color="primary">Login</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<style scoped></style>
<script>
export default {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            errorMsg: '',
            loading: false,
        }
    },
    methods: {
        async onLogin(evt) {
            if (evt) {
                evt.preventDefault()
            }
            if (!this.user.username || !this.user.password) {
                this.errorMsg = '아이디와 비밀번호를 입력하세요.'
                return
            }
            this.loading = true
            try {
                await this.$store.dispatch('auth/login', {
                    username: this.user.username,
                    password: this.user.password,
                })
                await this.$store.dispatch('role/fetchPermission')
                await this.$store.dispatch('board/fetchBoards')

                let to
                if (this.$route.query.redirect) {
                    to = this.$route.query.redirect
                } else {
                    to = '/'
                }
                this.$router.push({ path: to })
                return
            } catch (error) {
                // console.log(error.data.message)
                this.errorMsg = error.data.message
            }
            this.loading = false
        },
    },
}
</script>
