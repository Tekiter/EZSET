<template>
    <v-card
        outlined
        :disabled="uploading"
        @drop.prevent="addFileByDragDrop"
        @dragover.prevent=""
        @dragenter.prevent="showDroppable"
        @dragleave.prevent="hideDroppable"
    >
        <v-card-subtitle class="d-flex">
            <v-icon>mdi-paperclip</v-icon>
            <span class="ml-2" v-if="!uploading">파일 첨부</span>
            <span class="ml-2" v-else>파일 업로드 중...</span>
            <v-fade-transition>
                <div class="flex-grow-1 ml-3" v-if="uploading">
                    <v-progress-linear :value="loadingProgress" height="15">
                        <template v-slot="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                        </template>
                    </v-progress-linear>
                </div>
            </v-fade-transition>
        </v-card-subtitle>
        <v-card-text class="d-flex flex-wrap">
            <v-chip
                v-for="(fileinfo, idx) in selectedFiles"
                :key="idx"
                @click:close="removeFile(idx)"
                close
                :color="fileinfo.uploaded ? 'success' : ''"
                class="mr-2 mt-1"
                >{{ fileinfo.filename }}</v-chip
            >
            <v-btn small icon @click="showFileUploadDialog" class="mt-1">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span class="ml-3 mt-1" v-if="selectedFiles.length == 0"
                >또는 파일을 끌어다 넣으세요...</span
            >
        </v-card-text>
        <!-- <p v-if="dragOver">
            gogo
        </p> -->

        <v-fade-transition>
            <v-row
                class="overlay"
                v-show="dragOver"
                align="center"
                justify="center"
            >
                <v-col cols="3">
                    <v-icon class="display-3">mdi-plus</v-icon>
                </v-col>
            </v-row>
        </v-fade-transition>

        <input
            type="file"
            class="d-none"
            ref="fileInput"
            @change="addFileByDialog"
            multiple
        />
    </v-card>
</template>
<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1);
}

/* v-card * {
    pointer-events: none;
} */
</style>
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
        uploading: {
            type: Boolean,
            default: false,
        },
        currentProgress: {
            type: Number,
            default: 0,
        },
        fileProgress: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            selectedFiles: [],
            fileinput: [],
            dragCount: 0,
        }
    },
    computed: {
        dragOver() {
            return this.dragCount != 0
        },
        loadingProgress() {
            const totalFiles = this.selectedFiles.length - this.uploaded.length
            return (
                this.currentProgress / totalFiles +
                (this.fileProgress * 100) / totalFiles
            )
        },
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
            this.hideDroppable()
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
        showDroppable() {
            this.dragCount += 1
        },
        hideDroppable() {
            this.dragCount -= 1
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
        currentProgress(val) {},
        fileProgress(val) {},
    },
}
</script>
