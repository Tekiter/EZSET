<template>
    <v-card class="mx-auto" outlined>
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{convertDate(options.created_date)+' '+options.author}}</div>
                <v-list-item-title class="headline mb-2">{{options.title}}</v-list-item-title>
                <v-list-item-subtitle>{{options.content}}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-card-actions>
            <file-download :files="options.files" :hideLabel="true"></file-download>
        </v-card-actions>
    </v-card>
</template>
<script>
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
    methods: {
        convertDate(date) {
            return moment(date).format('YYYY-MM-DD HH:MM')
        },
    },
}
</script>