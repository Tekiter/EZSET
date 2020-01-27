<template>
    <v-card
        elevation="1"
        outlined
        :loading="loading"
        @drop.prevent="addFileByDragDrop"
        @dragover.prevent
    >
        <v-card-subtitle>
            <v-icon>mdi-paperclip</v-icon>
            <span class="ml-2">파일 첨부</span>
        </v-card-subtitle>
        <v-card-text class="d-flex">
            <v-chip
                v-for="(fileinfo, idx) in selectedFiles"
                :key="idx"
                @click:close="removeFile(idx)"
                close
                :color="fileinfo.uploaded ? 'green' : ''"
                class="mr-2"
                >{{ fileinfo.filename }}</v-chip
            >
            <v-btn small icon @click="showFileUploadDialog">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span class="ml-3" v-if="selectedFiles.length == 0"
                >or Drag and Drop...</span
            >
        </v-card-text>
        <input
            type="file"
            class="d-none"
            ref="fileInput"
            @change="addFileByDialog"
            multiple
        />
    </v-card>
</template>

<script>
export default {
    props: {
        value: Array,
        loading: {
            type: Boolean,
            default: false,
        },
        uploaded: {
            type: Array,
            default() {
                return []
            },
        },
    },
    data() {
        return {
            selectedFiles: [],
            fileinput: [],
        }
    },
    methods: {
        showFileUploadDialog() {
            this.$refs.fileInput.click()
        },
        addFileByDialog(e) {
            e.target.files.forEach(file => {
                this.addFile(file)
            })
        },
        addFileByDragDrop(e) {
            if (e.dataTransfer.files) {
                ;[...e.dataTransfer.files].forEach(file => {
                    this.addFile(file)
                })
            }
        },
        addFile(file) {
            this.selectedFiles.push({
                uploaded: false,
                file: file,
                filename: file.name,
            })
            this.$emit('input', this.selectedFiles)
        },
        removeFile(idx) {
            this.selectedFiles.splice(idx, 1)
        },
    },
    watch: {
        uploaded(val) {
            this.selectedFiles = val.map(file => {
                return {
                    filename: file.filename,
                    uploaded: true,
                    id: file.id,
                }
            })
            this.$emit('input', this.selectedFiles)
        },
    },
}
</script>
