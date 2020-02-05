<template>
    <div>
        <div>
            <v-text-field
                v-if="loading"
                color="blue darken-2"
                loading
                disabled
            ></v-text-field>
        </div>
        <v-container grid-list-md>
            <div>
                <v-toolbar-title class="d-flex justify-center"
                    ><h1>
                        <strong>게시글 검색</strong>
                    </h1></v-toolbar-title
                >
            </div>
            <div>
                <v-row class="d-flex justify-center">
                    <v-col cols="5" sm="2">
                        <v-select
                            v-model="Selecter"
                            :items="selects"
                            label="Select"
                            outlined
                        ></v-select>
                    </v-col>
                    <v-col cols="5" sm="5">
                        <v-text-field
                            v-model="searchObject"
                            color="blue darken-2"
                            label="Search"
                            counter
                            maxlength="100"
                            append-icon="mdi-magnify"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2" sm="1">
                        <div class="my-2">
                            <v-btn
                                depressed
                                color="primary"
                                @click="clickSearch()"
                                >검색</v-btn
                            >
                        </div>
                    </v-col>
                </v-row>
            </div>
            <v-card outlined v-if="showData">
                <v-data-table
                    :headers="headers"
                    :items="posts"
                    :page.sync="page"
                    :items-per-page="8"
                    hide-default-footer
                    mobile-breakpoint="0"
                    class="hidden-sm-and-down"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }}
                        </a>
                    </template>
                </v-data-table>
                <v-data-table
                    :headers="headersTwo"
                    :items="posts"
                    :page.sync="page"
                    :items-per-page="8"
                    hide-default-footer
                    mobile-breakpoint="0"
                    class="hidden-md-and-up"
                    @page-count="pageCount = $event"
                >
                    <template v-slot:item.title="props">
                        <a @click="read(props.item)">
                            {{ props.item.title }}
                        </a>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            Selecter: '옵션 선택',
            selects: ['제목', '내용', '제목 + 내용'],
            searchObject: '',
            showData: false,
        }
    },
    methods: {
        clickSearch() {
            this.showData = true
        },
    },
}
</script>
