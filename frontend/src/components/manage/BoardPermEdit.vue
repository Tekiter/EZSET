<template>
    <v-card v-if="board" class="px-4" elevation="0">
        <v-card-title>
            {{ board.title }}
        </v-card-title>
        <!-- <span class="subtitle-1">{{ board.title }}</span> -->
        <v-card-text>
            <div
                class="d-flex align-center"
                v-for="action in actions"
                :key="action.key"
            >
                <v-autocomplete
                    v-model="action.selections"
                    @change="handleChange"
                    :items="roles"
                    item-text="name"
                    item-value="tag"
                    :label="`${action.name} 가능`"
                    chips
                    filled
                    multiple
                    hide-details
                    disable-lookup
                    background-color="primary lighten-5"
                    class="mt-2"
                >
                    <template v-slot:selection="data">
                        <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            @click="data.select"
                            color="white"
                        >
                            {{ data.item.name }}
                        </v-chip>
                    </template>
                </v-autocomplete>
                <!-- <v-switch class="ml-3" dense label="모두 허용"></v-switch> -->
            </div>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    props: {
        roles: {
            type: Array,
            default: () => [],
        },
        board: {
            type: Object,
            default: () => ({}),
        },
        value: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        actions: [
            {
                name: '글 보기',
                key: 'read',
                selections: [],
            },
            {
                name: '글 작성',
                key: 'write',
                selections: [],
            },
            {
                name: '다른 유저의 글 삭제',
                key: 'delete',
                selections: [],
            },
        ],
    }),
    methods: {
        // v-model 에 형태 변환해 외부로 전송
        handleChange() {
            this.$emit(
                'input',
                this.actions.map(action => {
                    return {
                        action: action.key,
                        roles: action.selections,
                    }
                })
            )
        },
        // 외부의 v-model 값을 내부 값으로 변환
        applyInput(val) {
            val.forEach(action => {
                const obj = this.actions.find(item => item.key == action.action)
                if (obj) {
                    obj.selections = action.roles
                }
            })
        },
    },
    watch: {
        value(val) {
            this.applyInput(val)
        },
    },
    created() {
        this.applyInput(this.value)
    },
}
</script>
