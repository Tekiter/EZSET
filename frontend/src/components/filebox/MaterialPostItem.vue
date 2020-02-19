<template>
    <v-card class="mx-auto" outlined>
        <v-list-item three-line>
            <v-list-item-content>
                <div class="d-flex">
                    <div class="overline mb-4 flex-grow-1">
                        {{
                            convertDate(options.created_date) +
                                ' ' +
                                options.author
                        }}
                    </div>

                    <v-btn text small color="orange" @click="editClick()">
                        <v-icon>
                            mdi-pencil-outline
                        </v-icon>
                    </v-btn>
                    <v-btn text small color="red" @click="deleteClick()">
                        <v-icon>
                            mdi-trash-can-outline
                        </v-icon>
                    </v-btn>
                </div>
                <v-list-item-title class="headline mb-2">{{
                    options.title
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                    options.content
                }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-card-actions>
            <file-download
                :files="options.files"
                :hideLabel="true"
            ></file-download>
        </v-card-actions>
    </v-card>
</template>
<script>
import axios from 'axios'
import FileDownload from '../../components/file/FileDownload.vue'
import moment from 'moment'
export default {
    name: 'MaterialPostItem',
    components: {
        FileDownload,
    },
    props: {
        options: Object,
    },
    data() {
        return {
            isEdit: false,
        }
    },
    methods: {
        convertDate(date) {
            return moment(date).format('YYYY-MM-DD HH:MM')
        },
        async editClick() {
            try {
                this.$emit('editMaterial', { ...this.options })
            } catch {
                //
            }
        },
        async deleteClick() {
            try {
                await axios.delete('/filebox/material/' + this.options.id)
                this.$emit('delete')
            } catch (error) {
                //
            }
        },
    },
}
</script>
