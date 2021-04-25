"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    managePage: [
        {
            type: 'header',
            title: '관리',
        },
        {
            type: 'switch',
            title: '유저 관리',
            content: '유저의 비밀번호를 초기화하거나, 강제 탈퇴시킬 수 있습니다.',
            target: {
                resource: 'manageUsers',
                action: 'access',
                range: 'any',
            },
        },
        {
            type: 'switch',
            title: '가입 승인',
            content: '가입 대기중인 유저를 승인할 수 있습니다.',
            target: {
                resource: 'managePreusers',
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
            title: '홈화면 관리',
            content: '홈 화면의 디자인을 수정,적용할 수 있습니다.',
            target: {
                resource: 'manageHome',
                action: 'update',
            },
        },
        {
            type: 'line',
        },
        {
            type: 'header',
            title: '게시판',
        },
        {
            type: 'switch',
            title: '게시판 관리',
            content: '게시판을 추가/제거하거나 게시판의 권한을 수정할 수 있습니다.',
            target: {
                resource: 'manageBoards',
                action: 'access',
            },
        },
        {
            type: 'line',
        },
        {
            type: 'header',
            title: '출석',
        },
        {
            type: 'switch',
            title: '출석 관리',
            content: '출석체크를 시작하거나 종료할 수 있으며 사용자들의 출석현황을 확인하고 수정할 수 있습니다.',
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
            type: 'line',
        },
        {
            type: 'header',
            title: '일정',
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
        {
            type: 'header',
            title: '자료실',
        },
        {
            type: 'switch',
            title: '자료실 관리',
            content: '그룹과 폴더를 추가, 편집할 수 있습니다.',
            target: {
                resource: 'fileBox',
                action: 'manage',
            },
        },
        {
            type: 'switch',
            title: '파일 업로드 & 삭제 관리',
            content: '파일을 업로드하고 삭제할 수 있습니다.',
            target: {
                resource: 'fileBox',
                action: 'upload',
            },
        },
        {
            type: 'line',
        },
        {
            type: 'header',
            title: '상벌점',
        },
        {
            type: 'switch',
            title: '상벌점 관리',
            content: '상벌점 항목을 수정/삭제 하고 관리합니다',
            target: {
                resource: 'penalty',
                action: 'update',
            },
        },
        {
            type: 'switch',
            title: '상벌점 읽기',
            content: '자신의 상벌점을 읽을 수 있습니다.',
            target: {
                resource: 'penalty',
                action: 'read',
            },
        },
    ],
};
//# sourceMappingURL=permissions.js.map