export default {
    managePage: [
        {
            type: 'header',
            title: '유저',
        },
        {
            type: 'switch',
            title: '유저 관리',
            content:
                '유저의 비밀번호를 초기화하거나, 강제 탈퇴시킬 수 있습니다.',
            target: {
                resource: 'manageUsers',
                action: 'access',
                range: 'any',
            },
        },

        {
            type: 'switch',
            title: '역할 관리',
            content: '역할을 추가/제거하거나 역할의 권한을 수정할 수 있습니다.',
            target: {
                resource: 'role',
                action: 'modify',
            },
        },
        {
            type: 'switch',
            title: '게시판 관리',
            content:
                '게시판을 추가/제거하거나 게시판의 권한을 수정할 수 있습니다.',
            target: {
                resource: 'manageBoards',
                action: 'access',
            },
        },
        {
            type: 'line',
        },
    ],
}