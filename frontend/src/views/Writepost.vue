<template>
    <v-container fluid>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-toolbar-title class="d-flex justify-center"
            >-게시판이름-</v-toolbar-title
        >
        <v-form>
            <v-text-field
                v-model="title"
                label="Title"
                single-line
                full-width
                hide-details
            ></v-text-field>
            <v-divider></v-divider>
            <v-textarea
                v-model="content"
                label="Content"
                counter
                maxlength="2000"
                full-width
                single-line
            ></v-textarea>
        </v-form>
        <div class="row">
            <div class="col"></div>
            <div class="col"></div>
            <div class="col">
                <div class="d-flex flex-row-reverse">
                    <v-btn
                        class="ma-2"
                        tile
                        outlined
                        color="blue darken-3"
                        @click="clearClick"
                    >
                        <v-icon left>mdi-keyboard-backspace</v-icon> CLEAR
                    </v-btn>
                    <v-btn class="ma-2" tile outlined color="blue darken-3">
                        <v-icon left>mdi-pencil</v-icon> SUBMIT
                    </v-btn>
                </div>
            </div>
        </div>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            title: [],
            content: [],
        }
    },
    methods: {
        clearClick() {
            this.$router.push({
                path: `/board/${this.$route.params.board_id}`,
            })
        },
    },
}
</script>
