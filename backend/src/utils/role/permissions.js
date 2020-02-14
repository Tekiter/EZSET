export default {
    managePage: [
        {
            type: 'header',
            title: '관리',
        },
        {
            type: 'switch',
            title: '유저 관리',
            content: '유저의 비밀번호를 초기화하거나, 탈퇴시킬 수 있습니다.',
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
            type: 'switch',
            title: '출석 관리',
            content:
                '출석체크를 시작하거나 종료할 수 있으며 사용자들의 출석현황을 확인하고 수정할 수 있습니다.',
            target: {
                resource: 'attendance',
                action: 'update',
            },
        },
        {
            type: 'switch',
            title: '공결 관리',
            content: '공결신청내역을 확인하고 공결승인 및 취소 할 수 있습니다.',
            target: {
                resource: 'absence',
                action: 'update',
            },
        },
        {
            type: 'switch',
            title: '일정 관리',
            content: '새로운 일정을 추가하거나 삭제할 수 있습니다.',
            target: {
                resource: 'schedule',
                action: 'update',
            },
        },
        {
            type: 'line',
        },
    ],
}
