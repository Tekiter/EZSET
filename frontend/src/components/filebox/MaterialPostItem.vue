<template>
    <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{options.author}}</div>
                <v-list-item-title class="headline mb-1">{{options.title}}</v-list-item-title>
                <v-list-item-subtitle>{{options.contant}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
            <file-download></file-download>
        </v-card-actions>
    </v-card>
</template>
<script>
import FileDownload from '../../components/file/FileDownload.vue'
export default {
    name: 'MaterialPostItem',
    components: {
        FileDownload,
    },
    props: {
        options: Object,
    },
}
</script>