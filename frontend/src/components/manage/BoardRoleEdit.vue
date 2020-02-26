<template>
    <div>
        <v-card class="mx-auto" max-width="400" tile>
            <v-list flat>
                <v-subheader>
                    <v-col></v-col>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-col class="title black--text">보기</v-col>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-col class="title black--text">쓰기</v-col>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-col class="title black--text">삭제</v-col>
                </v-subheader>

                <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-content>
                        <v-list-item-title
                            class="text-center subtitle-1"
                            v-text="item.status"
                        ></v-list-item-title>
                    </v-list-item-content>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-list-item-content class="d-flex justify-center">
                        <v-switch v-model="item.read"></v-switch>
                    </v-list-item-content>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-list-item-content class="d-flex justify-center">
                        <v-switch
                            class="d-flex justify-center"
                            v-model="item.write"
                        ></v-switch>
                    </v-list-item-content>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-list-item-content class="d-flex justify-center">
                        <v-switch
                            class="d-flex justify-center"
                            v-model="item.delete"
                        ></v-switch>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    status: '시니어',
                    read: true,
                    write: true,
                    delete: false,
                },
                {
                    status: '시니어',
                    read: true,
                    write: true,
                    delete: false,
                },
                {
                    status: '시니어',
                    read: true,
                    write: true,
                    delete: false,
                },
                {
                    status: '시니어',
                    read: true,
                    write: true,
                    delete: false,
                },
                {
                    status: '시니어',
                    read: true,
                    write: true,
                    delete: false,
                },
                {
                    status: '시니어',
                    read: true,
                    write: true,
                    delete: false,
                },
            ],
        }
    },
}
</script>
