<template>
    <v-data-table
        :headers="headers"
        :items="boards"
        :items-per-page="5"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-toolbar-title class="d-flex justify-center"
                >-게시판 이름-</v-toolbar-title
            >
            <v-divider class="mx-2" inset vertical></v-divider>
        </template>
    </v-data-table>
</template>
<script>
export default {
    data() {
        return {
            headers: [
                {
                    text: '번호',
                    align: 'left',
                    sortable: false,
                    value: 'number',
                },
                { text: '제목', value: 'title' },
                { text: '작성자', value: 'author' },
                { text: '작성일', value: 'date' },
                { text: '추천', value: 'recommands' },
                { text: '조회', value: 'hits' },
            ],
            boards: [
                {
                    number: 123,
                    title: '안녕',
                    author: '박수환',
                    date: '12/31',
                    recommands: 4,
                    hits: 23,
                },
            ],
        }
    },
}
</script>
