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
                    v-model="selectedRole[action.key]"
                    @change="handleChange"
                    :items="roles"
                    item-text="name"
                    item-value="tag"
                    :label="`${action.name} 가능`"
                    chips
                    small-chips
                    multiple
                    hide-details
                    disable-lookup
                    class="mt-2"
                    :disabled="disabled"
                    outlined
                >
                    <template v-slot:selection="data">
                        <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            @click="data.select"
                            color="primary"
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
import _ from 'lodash'

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
        actions: {
            type: Array,
            default: () => [],
        },
        value: {
            type: Array,
            default: () => [],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        selectedRole: {},
    }),
    methods: {
        // v-model 에 형태 변환해 외부로 전송
        handleChange() {
            console.log(this.actions)
            const newvalue = this.actions.map(action => {
                console.log(action)
                return {
                    action: action.key,
                    roles: this.selectedRole[action.key],
                }
            })
            this.$emit('input', newvalue)
            this.$emit('change', newvalue)
        },
        // 외부의 v-model 값을 내부 값으로 변환
        applyInput(val) {
            val.forEach(action => {
                this.selectedRole[action.action] = _.cloneDeep(action.roles)
            })
            this.$forceUpdate()
        },
    },
    watch: {
        value(val) {
            console.log(val)
            this.applyInput(val)
        },
    },
    created() {
        this.applyInput(this.value)
    },
}
</script>
