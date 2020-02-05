<template>
    <div class="fill-height">
        <v-row no-gutters class="fill-height">
            <v-col class="fill-height" :cols="3" xl="2">
                <v-card tile outlined class="fill-height">
                    <group-tree :items="groups"></group-tree>
                </v-card>
            </v-col>
            <v-col>
                <div>
                    <!-- :files="post.files" -->
                    <file-download></file-download>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios'
import GroupTree from '../components/filebox/GroupTree.vue'

export default {
    components: {
        GroupTree,
    },
    data() {
        return {
            fileboxes: [],
            groups: [],
        }
    },
    async created() {
        const res = await axios.get('/filebox')
        console.log(res)
        this.groups = res.data.groups
    },
}
</script>
