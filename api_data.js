define({ "api": [
  {
    "type": "delete",
    "url": "/attendance/manage/user/:username",
    "title": "출석 대상 제거",
    "description": "<p>출석 대상에서 <code>username</code> 라는 아이디를 가지는 사용자 제거</p>",
    "name": "delete_user",
    "group": "AttendanceCheck/manage",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>출석대상에서 삭제할 사용자 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck/manage"
  },
  {
    "type": "get",
    "url": "/attendance/manage/user",
    "title": "출석 대상 조회",
    "description": "<p>출석 대상 사용자 리스트와 출석 대상이 아닌 사용자 리스트 반환</p>",
    "name": "read_user",
    "group": "AttendanceCheck/manage",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "attableUsers",
            "description": "<p>출석 대상 사용자 리스트</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "excludedUsers",
            "description": "<p>출석 대상이 아닌 사용자 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "     HTTP/1.1 200 OK\n{\n \"attableUsers\": [\n   {\n     \"username\": \"admin\",\n     \"realname\": \"관리자\"\n   },\n   {\n     \"username\": \"test01\",\n     \"realname\": \"test01\"\n   },\n   {\n     \"username\": \"test02\",\n     \"realname\": \"test02\"\n   },\n   {\n     \"username\": \"user0001\",\n     \"realname\": \"최현석\"\n   },\n ],\n \"excludedUsers\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck/manage"
  },
  {
    "type": "put",
    "url": "/attendance/manage/user",
    "title": "출석 대상 추가",
    "description": "<p>출석대상 사용자 추가</p>",
    "name": "write_user",
    "group": "AttendanceCheck/manage",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "users",
            "description": "<p>출석 대상으로 추가할 사용자정보가 담긴 배열</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  [\n    \"user0001\",\n    \"user0002\",\n    \"user0003\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>올바르지 않은 사용자가 있을 경우</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "      HTTP/1.1 404 Not Found\n{\n     존재하지 않는 유저입니다.\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck/manage"
  },
  {
    "type": "delete",
    "url": "/attendance/delete",
    "title": "출석기록 삭제",
    "description": "<p>특정유저의 특정일자의 출결기록 삭제</p>",
    "name": "AttendanceRecordDelete",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>삭제할 날짜, YYYYMMDD 형태</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>삭제할 유저 아이디</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"date\":\"20200306\",\n    \"usersname\":\"admin\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "put",
    "url": "/attendance/addUsersRecords",
    "title": "출석 기록 추가",
    "description": "<p>출석 대상이 아니어서 기록이 없는 사용자의 출석기록을 <code>absence</code> 상태로 추가</p>",
    "name": "addUsersRecords",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>업데이트할 날짜, YYYYMMDD 형태</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "users",
            "description": "<p>출석 대상으로 추가할 사용자정보가 담긴 배열</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"day\":\"20200306\",\n    \"users\":[\n             \"admin\",\n             \"hschoi1104\"\n            ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>올바르지 않은 사용자가 있을 경우</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "      HTTP/1.1 400 Not Found\n{\n     존재하지 않는 유저입니다.\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendance/attendanceCheck/",
    "title": "출석유무 체크",
    "description": "<p>현재 날짜에 사용자의 출석 상태가 <code>attendance</code>상태인지 체크</p>",
    "name": "attendanceCheck",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.att"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "1",
            "description": "<p>당일 사용자의 출석상태가 <code>출석</code> 상태임.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "0",
            "description": "<p>당일 사용자의 출석상태가 <code>출석</code> 상태가 아님.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     1\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendance/attendanceCheckAdmin/",
    "title": "서버 출석 코드 전송",
    "name": "attendanceCheckAdmin",
    "description": "<p>출석을 시작한 관리자가 출석 진행중에 페이지를 새로고침 했을 때 서버에서 생성한 출석 코드를 전송</p>",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.att"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ranNum",
            "description": "<p>출석을 시작한 관리자의 요청일 경우</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "0",
            "description": "<p>출석을 시작한 관리자의 요청이 아닐 경우</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     129\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/attendance/attendanceCheckEnd/",
    "title": "출석 종료",
    "name": "attendanceCheckEnd",
    "description": "<p>출석 종료시 서버에서 생성했던 출석 코드(ranNum)와 출석시작했던 관리자 아이디(startUser) 값을 초기화</p>",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.att"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>정상 처리되었을 경우</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendance/attendanceDayList/",
    "title": "전체 일별 출결현황 반환",
    "description": "<p>전체 일별 출결현황 반환</p>",
    "name": "attendanceDayList",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.read"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>전체 일별 출결현황 객체 배열</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n [\n {\n   \"_id\": \"5e1ff40db7ee260ffc203de5\",\n   \"status\": [\n     {\n       \"_id\": \"5e1ff40db7ee260ffc203de6\",\n       \"name\": \"admin\",\n       \"state\": \"late\"\n     },\n     {\n       \"_id\": \"5e1ff40db7ee260ffc203deb\",\n       \"name\": \"user0001\",\n       \"state\": \"attendance\"\n     },\n     {\n       \"_id\": \"5e1ff40db7ee260ffc203df0\",\n       \"name\": \"user0002\",\n       \"state\": \"attendance\"\n     }\n   ],\n   \"day\": \"20200115\",\n   \"__v\": 2\n },\n {\n   \"_id\": \"5e1ff480b7ee260ffc203df6\",\n   \"status\": [\n     {\n       \"_id\": \"5e1ff480b7ee260ffc203df7\",\n       \"name\": \"admin\",\n       \"state\": \"attendance\"\n     },\n     {\n       \"_id\": \"5e1ff480b7ee260ffc203dfb\",\n       \"name\": \"user0001\",\n       \"state\": \"official_absence\"\n     },\n     {\n       \"_id\": \"5e1ff480b7ee260ffc203dff\",\n       \"name\": \"user0002\",\n       \"state\": \"attendance\"\n     },\n     {\n       \"_id\": \"5e3bec45e9ce0e0968a5e781\",\n       \"name\": \"user0004\",\n       \"state\": \"absence\"\n     }\n   ],\n   \"day\": \"20200116\",\n   \"__v\": 3\n },\n]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/attendance/attendanceNUserData",
    "title": "",
    "description": "<p><code>day</code> 날짜에 출석 정보가 없는 사용자 리스트 반환</p>",
    "name": "attendanceNUserData",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>업데이트할 날짜, YYYYMMDD 형태</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"day\":\"20200304\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "Array",
            "description": "<p>해당 날짜에 출석 정보가 없는 사용자 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "     HTTP/1.1 200 OK\n{\n [\n \"user0005\",\n \"user0006\",\n \"user0007\",\n \"test01\",\n \"test02\"\n ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>해당 날짜에 출결정보가 없을 경우</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendanceState/:day",
    "title": "일별 출석현황 반환",
    "description": "<p>특정 일자의 출석현황을 반환</p>",
    "name": "attendanceState",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>반환하고 싶은 날짜, YYYYMMDD 형태</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"day\":\"20200304\"\n}",
          "type": "get"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>해당 일자의 출결 정보 객체</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n     {\n         \"status\": [\n                     {\n                     \"_id\": \"5e5f4886c785712d2c55b022\",\n                      \"name\": \"admin\",\n                      \"state\": \"attendance\"\n                    },\n                     {\n                      \"_id\": \"5e5f4886c785712d2c55b026\",\n                      \"name\": \"user0001\",\n                      \"state\": \"attendance\"\n                    },\n                    {\n                      \"_id\": \"5e5f4886c785712d2c55b02a\",\n                      \"name\": \"user0002\",\n                      \"state\": \"attendance\"\n                    },\n                  ]\n      }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>해당 일자에 출결정보 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/attendance/attendanceUser",
    "title": "특정 사용자 출결정보 반환",
    "description": "<p><code>name</code>의 아이디를 가지는 사용자의 출결정보 반환</p>",
    "name": "attendanceUser",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>조회할 사용자 아이디</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"name\":\"admin\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "status",
            "description": "<p>출결정보 객체 배열</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>조회한 사용자 아이디</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "     HTTP/1.1 200 OK\n{\n{\n \"status\": [\n   {\n     \"_id\": \"5e1ff40db7ee260ffc203de9\",\n     \"date\": \"20200115\",\n     \"state\": \"late\"\n   },\n   {\n     \"_id\": \"5e1ff480b7ee260ffc203df9\",\n     \"date\": \"20200116\",\n     \"state\": \"attendance\"\n   },\n ],\n \"name\": \"admin\"\n}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendance/attendanceUserData/",
    "title": "사용자 출결현황 반환",
    "description": "<p>자신의 출결현황 반환한다.</p>",
    "name": "attendanceUserData",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.canOwn.read"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>자신의 출결현황 객체 반환</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n [\n  {\n    \"_id\": \"5e1ff40db7ee260ffc203de8\",\n    \"status\": [\n      {\n        \"_id\": \"5e5bc7f2cb0dba2d48491bff\",\n        \"date\": \"20200301\",\n        \"state\": \"attendance\"\n      },\n      {\n        \"_id\": \"5e5bece73d513a0d78ba7eb3\",\n        \"date\": \"20200302\",\n        \"state\": \"official_absence\"\n      },\n      {\n        \"_id\": \"5e5f4886c785712d2c55b024\",\n        \"date\": \"20200304\",\n        \"state\": \"attendance\"\n        }\n      ],\n    \"name\": \"admin\",\n    \"__v\": 27\n  }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendance/attendanceUserList/",
    "title": "사용자 리스트 반환",
    "description": "<p>전체 사용자 리스트를 반환</p>",
    "name": "attendanceUserList",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>전체 사용자정보 객체 배열</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        [\n              {\n                 \"_id\": \"5e1ff2fc39c8d12194bd55f4\",\n                 \"username\": \"admin\"\n             },\n             {\n                \"_id\": \"5e1ff395b7ee260ffc203de2\",\n                \"username\": \"user0001\"\n             },\n             {\n                \"_id\": \"5e1ff3b3b7ee260ffc203de3\",\n                \"username\": \"user0002\"\n             },\n         ]\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "get",
    "url": "/attendance/attendanceUserListData/",
    "title": "사용자별 출결현황 반환",
    "description": "<p>사용자별 출결현황 반환</p>",
    "name": "attendanceUserListData",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.read"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>전체 사용자별 출결현황 객체 배열</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n {\n   \"_id\": \"5e1ff40db7ee260ffc203de8\",\n   \"status\": [\n     {\n       \"_id\": \"5e1ff40db7ee260ffc203de9\",\n       \"date\": \"20200115\",\n       \"state\": \"late\"\n     },\n     {\n       \"_id\": \"5e1ff480b7ee260ffc203df9\",\n       \"date\": \"20200116\",\n       \"state\": \"attendance\"\n     },\n   ],\n   \"name\": \"admin\",\n   \"__v\": 27\n },\n {\n   \"_id\": \"5e1ff40db7ee260ffc203ded\",\n   \"status\": [\n     {\n       \"_id\": \"5e1ff40db7ee260ffc203dee\",\n       \"date\": \"20200115\",\n       \"state\": \"attendance\"\n     },\n     {\n       \"_id\": \"5e1ff480b7ee260ffc203dfd\",\n       \"date\": \"20200116\",\n       \"state\": \"official_absence\"\n     },\n   ],\n   \"name\": \"user0001\",\n   \"__v\": 27\n },\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/attendance/attendanceWrite/",
    "title": "출석 요청",
    "description": "<p>사용자가 자신이 입력한 코드로 출석요청을 보냄. 서버에서 생성한 출석코드와 일치한다면 출석 처리</p>",
    "name": "attendanceWrite",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.att"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>사용자가 입력한 출석번호</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"code\":129\n}",
          "type": "post"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "1",
            "description": "<p>서버가 생성한 번호와 사용자가 입력한 번호가 일치함.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "0",
            "description": "<p>서버가 생성한 번호와 사용자가 입력한 번호가 일치하지 않음.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"result\":1\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    \"result\":0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/attendancestateupdate/:day",
    "title": "출석 상태 업데이트",
    "description": "<p><code>day</code>날짜에 <code>name</code>이라는 아이디를 가진 사용자의 출석 상태를 <code>state</code>로 업데이트</p>",
    "name": "attendancestateupdate",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>업데이트할 날짜, YYYYMMDD 형태</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>업데이트할 상태 (<code>attendance</code>,<code>absence</code>,<code>late</code>,<code>offical_absence</code>)중 하나</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>업데이트할 사용자 아이디</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"day\":\"20200304\",\n    \"state\":\"late\",\n    \"name\":\"hschoi1104\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>바꾼 상태의 객체 반환</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/attendance/startAttendance/",
    "title": "출석 시작",
    "name": "startAttendance",
    "description": "<p>출석시작버튼을 눌렀을경우 관리자는 출석상태로 다른 모든 유저는 결석상태로 업데이트함</p>",
    "group": "AttendanceCheck",
    "permission": [
      {
        "name": "attendance.can.update"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ranNum",
            "description": "<p>서버에서 생성한 3자리 출석코드 반환</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"code\": ranNum\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/attendance.route.js",
    "groupTitle": "AttendanceCheck"
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "로그인",
    "name": "로그인",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>로그인 할 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>로그인 할 비밀번호</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JWT",
            "optional": false,
            "field": "accessToken",
            "description": "<p>로그인 인증 토큰</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"accessToken\": \"<JWT-LOGIN-TOKEN>\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/auth.route.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register/doublecheck/username",
    "title": "유저 중복 아이디 체크",
    "name": "유저_중복_아이디_체크",
    "group": "Auth",
    "description": "<p>유저가 화원가입 할 시 username을 중복 체크</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>유저 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>사용할 수 있는 아이디</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "409",
            "description": "<p>username 중복 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409\n{\n   message: '이미 사용중인 아이디입니다.',\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/auth.route.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "유저 회원가입",
    "name": "유저_회원가입",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>유저 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>유저 비밀번호</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "realname",
            "description": "<p>유저 실명</p>"
          },
          {
            "group": "Parameter",
            "type": "Email",
            "optional": false,
            "field": "email",
            "description": "<p>유저 이메일</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "201",
            "description": "<p>유저 회원가입 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/auth.route.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/edittoken/issue",
    "title": "유저 회원정보 보안 토큰 발급",
    "name": "유저_회원정보_보안_토큰_발급",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>유저 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>유저 비밀번호</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JWT",
            "optional": false,
            "field": "editToken",
            "description": "<p>회원정보 보안 토큰</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>회원정보 보안 토큰 발급 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   message: '토큰 발급 실패',\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/auth.route.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/edittoken/check",
    "title": "유저 회원정보 보안 토큰 유효성 검사",
    "name": "유저_회원정보_보안_토큰_유효성_검사",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JWT",
            "optional": false,
            "field": "editToken",
            "description": "<p>회원정보 보안 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>회원정보 보안 토큰이 유효함</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>회원정보 보안 토큰이 유효하지 않음</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/v1/auth.route.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/simple/posts/:post_id",
    "title": "게시글 목록 보기",
    "description": "<p>posts는 배열로 id, title, contnet, author, isAnonymous(익명게시판여부), created_date, view(조회수), like(추천수), comment_count(댓글 갯수), comment가 들어있다</p>",
    "name": "게시글_목록_보기",
    "group": "Board",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시판 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "200",
            "description": "<p>게시글 목록</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "delete",
    "url": "/simple/posts/:post_id",
    "title": "게시글 삭제",
    "description": "<p>게시글을 삭제한다</p>",
    "name": "게시글_삭제",
    "group": "Board",
    "permission": [
      {
        "name": "can.delete"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시판 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>게시글 삭제</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nmessage\": \"post deleted\",\n   \"target\":{\n   \"isAnonymous\": false,\n   \"view\": 0,\n   \"like\":[],\n   \"isLike\": false,\n   \"files\":[\"5e65db86b869b0322cbc1bda\"],\n   \"_id\": 101,\n   \"board\": 10,\n   \"title\": \"hello\",\n   \"content\": \"hhhhh\",\n   \"author\": \"admin\",\n   \"created_date\": \"2020-03-09T06:01:45.804Z\",\n   \"comments\":[],\n   \"__v\": 1\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시판 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "500",
            "description": "<p>삭제 오류</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no board id 10,\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500\n{\n   string: database error\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "post",
    "url": "/simple/boards/:board_id",
    "title": "게시글 생성",
    "description": "<p>게시글을 첨부파일과 같이 작성한다</p>",
    "name": "게시글_생성",
    "group": "Board",
    "permission": [
      {
        "name": "can.create"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "board_id",
            "description": "<p>게시판 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>게시글 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>게시글 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "files",
            "description": "<p>게시글 첨부파일</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "201",
            "description": "<p>게시글 작성</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n    \"isAnonymous\": false,\n    \"view\": 0,\n    \"like\":[],\n    \"isLike\": false,\n    \"files\":[\"5e65db86b869b0322cbc1bda\"],\n    \"board\": 10,\n    \"title\": \"hello\",\n    \"content\": \"hhhhh\",\n    \"author\": \"admin\",\n    \"created_date\": \"2020-03-09T06:01:45.804Z\",\n    \"comments\":[],\n    \"_id\": 101,\n    \"__v\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시판 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "400",
            "description": "<p>첨부파일 오류</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no board id 10,\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   string: 올바르지 않은 첨부파일입니다.\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "patch",
    "url": "/simple/posts/:post_id",
    "title": "게시글 수정",
    "description": "<p>게시글을 수정한다</p>",
    "name": "게시글_수정",
    "group": "Board",
    "permission": [
      {
        "name": "can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "board_id",
            "description": "<p>게시판 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>게시글 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>게시글 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "files",
            "description": "<p>게시글 첨부파일</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>게시글 수정</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200\n{\n message: 수정 완료\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시판 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no board id 10,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "patch",
    "url": "/simple/posts/:post_id",
    "title": "게시글 수정",
    "description": "<p>게시글을 수정한다</p>",
    "name": "게시글_수정",
    "group": "Board",
    "permission": [
      {
        "name": "can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "board_id",
            "description": "<p>게시판 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>게시글 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>게시글 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "files",
            "description": "<p>게시글 첨부파일</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>게시글 수정</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nmessage\": '수정 완료',\n   \"target\":{\n   \"isAnonymous\": false,\n   \"view\": 0,\n   \"like\":[],\n   \"isLike\": false,\n   \"files\":[\"5e65db86b869b0322cbc1bda\"],\n   \"_id\": 101,\n   \"board\": 10,\n   \"title\": \"hello\",\n   \"content\": \"hhhhh\",\n   \"author\": \"admin\",\n   \"created_date\": \"2020-03-09T06:01:45.804Z\",\n   \"comments\":[],\n   \"__v\": 1\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시판 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no board id 10,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "get",
    "url": "/simple/posts/:post_id",
    "title": "게시글 조회",
    "description": "<p>해당 아이디의 게시글을 불러온다</p>",
    "name": "게시글_조회",
    "group": "Board",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시판 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>게시글 조회</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n    _id: parseInt(post.id),\n       title: post.title,\n       content: post.content,\n       author: post.author,\n       isAnonymous: post.isAnonymous,\n       created_date: post.created_date,\n       view: post.view,\n       like: post.likes_count,\n       isLike: post.likes_flag(req.user.username),\n       comment: post.comments,\n       files: await getFileInfoArray(post.files)\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>게시글 조회 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no post id post_id,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "get",
    "url": "/searchpost",
    "title": "게시물 검색",
    "description": "<p>posts는 배열로 id, title, contnet, author, isAnonymous(익명게시판여부), created_date, view(조회수), like(추천수), comment_count(댓글 갯수), comment가 들어있다</p>",
    "name": "게시물_검색",
    "group": "Board",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>검색 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "option",
            "description": "<p>검색 옵션</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>현제 페이지 번호</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pagesize",
            "description": "<p>한 페이지당 보일 게시글 수</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "200",
            "description": "<p>게시글 목록</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "400",
            "description": "<p>검색 옵션이 없습니다</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n   string: 검색 옵션이 없습니다.\n}",
          "type": "String"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500\n{\n   string: database error\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "get",
    "url": "/simple/boards/",
    "title": "게시판 목록",
    "description": "<p>게시판 목록을 불러온다</p>",
    "name": "게시판_목록",
    "group": "Board",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>게시판 목록</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200\n{\n    \"_id\": 10,\n    \"title\": \"test\"\n},\n{\n    \"_id\": 11,\n    \"title\": \"익명게시판\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시판 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: '존재하지 않는 게시판입니다.',\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "delete",
    "url": "/simple/boards/:board_id",
    "title": "게시판 삭제",
    "description": "<p>게시판을 삭제한다</p>",
    "name": "게시판_삭제",
    "group": "Board",
    "permission": [
      {
        "name": "can.delete"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "board_id",
            "description": "<p>게시판 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>게시판 삭제</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n   message: '게시판을 삭제했습니다',\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시판 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "500",
            "description": "<p>게시판 삭제 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: '존재하지 않는 게시판입니다.',\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "post",
    "url": "/simple/boards/",
    "title": "게시판 생성",
    "description": "<p>새로운 게시판을 생성한다</p>",
    "name": "게시판_생성",
    "group": "Board",
    "permission": [
      {
        "name": "can.create"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>게시판 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isAnonymous",
            "description": "<p>익명게시판 판단</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "201",
            "description": "<p>게시판 생성 성공</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "500",
            "description": "<p>게시판 생성 에러</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "delete",
    "url": "/posts/:post_id/comment/:comment_id",
    "title": "댓글 삭제",
    "description": "<p>댓글을 삭제한다</p>",
    "name": "댓글_삭제",
    "group": "Board",
    "permission": [
      {
        "name": "can.delete"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시글 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "comment_id",
            "description": "<p>댓글 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "200",
            "description": "<p>댓글 삭제</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   message: '삭제 성공'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시글 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no post id post_id,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "post",
    "url": "/posts/:post_id/comment",
    "title": "댓글 생성",
    "description": "<p>댓글을 작성한다</p>",
    "name": "댓글_생성",
    "group": "Board",
    "permission": [
      {
        "name": "can.read"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시글 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>게시글 내용</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "201",
            "description": "<p>댓글 작성</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n   message: '댓글 작성 완료'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시글 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no post id post_id,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "patch",
    "url": "/posts/:post_id/comment/:comment_id",
    "title": "댓글 수정",
    "description": "<p>댓글을 수정한다</p>",
    "name": "댓글_수정",
    "group": "Board",
    "permission": [
      {
        "name": "can.read"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시판 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>댓글 내용</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "201",
            "description": "<p>댓글 수정</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n   message: '댓글 수정 완료'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시글 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no post id post_id,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "delete",
    "url": "/posts/:post_id/like",
    "title": "추천 삭제",
    "description": "<p>추천 비활성화</p>",
    "name": "추천_비활성화",
    "group": "Board",
    "permission": [
      {
        "name": "can.read"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시글 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "201",
            "description": "<p>댓글 작성</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n   message: '좋아요 삭제 완료'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시글 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no post id post_id,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "post",
    "url": "/posts/:post_id/like",
    "title": "추천 생성",
    "description": "<p>추천 활성화</p>",
    "name": "추천_활성화",
    "group": "Board",
    "permission": [
      {
        "name": "can.read"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "post_id",
            "description": "<p>게시글 아이디</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "201",
            "description": "<p>댓글 작성</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n   message: '좋아요 생성 완료'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>권한 없음</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "404",
            "description": "<p>해당 게시글 없음</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: no post id post_id,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/simple.route.js",
    "groupTitle": "Board"
  },
  {
    "type": "patch",
    "url": "/config/admin",
    "title": "서버 설정 변경 (어드민)",
    "description": "<p>변경 가능한 서버의 설정 정보를 변경한다. body에 Object 로 설정값의 key: value 쌍을 넣으면 반영된다.</p>",
    "name": "ChangeConfig",
    "group": "Config",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>바꿀 설정의 값</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\"groupName\":\"EZSET\",\"usePreUser\":false}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/config.route.js",
    "groupTitle": "Config"
  },
  {
    "type": "get",
    "url": "/config/reset",
    "title": "서버 설정 초기화",
    "description": "<p>서버의 모든 설정 정보를 초기화</p>",
    "name": "ResetConfig",
    "group": "Config",
    "version": "0.0.0",
    "filename": "src/api/v1/config.route.js",
    "groupTitle": "Config"
  },
  {
    "type": "get",
    "url": "/config/admin",
    "title": "서버 설정 가져오기 (어드민)",
    "description": "<p>서버의 모든 설정 정보를 가져옴</p>",
    "name": "ViewAdminConfig",
    "group": "Config",
    "version": "0.0.0",
    "filename": "src/api/v1/config.route.js",
    "groupTitle": "Config"
  },
  {
    "type": "get",
    "url": "/config",
    "title": "서버 설정 가져오기",
    "description": "<p>서버의 기본 정보를 가져옴</p>",
    "name": "ViewConfig",
    "group": "Config",
    "version": "0.0.0",
    "filename": "src/api/v1/config.route.js",
    "groupTitle": "Config"
  },
  {
    "type": "get",
    "url": "/file/manage/cleanup",
    "title": "파일 폴더 정리",
    "description": "<p>사용되지 않지만, 디스크에 남아있는 파일을 삭제하여 용량을 확보한다.</p>",
    "name": "CleanupFiles",
    "group": "File",
    "version": "0.0.0",
    "filename": "src/api/v1/file.route.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/file/download/:file_id",
    "title": "파일 다운로드",
    "description": "<p>업로드된 파일을 다운로드한다. 요청시 파일의 이진 데이터가 결과로 전송된다.</p>",
    "name": "DownloadFile",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file_id",
            "description": "<p>파일의 id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/v1/file.route.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/file/info/:file_id",
    "title": "업로드된 파일 정보",
    "description": "<p>업로드된 파일에 대한 기본 정보를 가져옴</p>",
    "name": "FileInfo",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file_id",
            "description": "<p>파일의 id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>파일의 id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "filename",
            "description": "<p>파일의 이름</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>파일의 크기</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "uploader",
            "description": "<p>파일을 올린 유저의 아이디</p>"
          },
          {
            "group": "Success 200",
            "type": "Datetime",
            "optional": false,
            "field": "timestamp",
            "description": "<p>파일을 올린 시간</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"5e2c0c86850bef7560bfa898\",\n  \"filename\": \"1.PNG\",\n  \"size\": 34850,\n  \"uploader\": \"helloworld\",\n  \"timestamp\": \"2020-01-25T09:38:14.533Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/file.route.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "}",
    "title": "/file/upload 파일 업로드",
    "description": "<p>파일을 서버에 업로드한다.</p>",
    "name": "UploadFile",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>파일의 이진 데이터</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>업로드된 파일의 id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>업로드된 파일의 크기</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\":\"5e7480be9c20a25c88590aab\",\n  \"size\":34850\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/file.route.js",
    "groupTitle": "File"
  },
  {
    "type": "delete",
    "url": "/filebox/material/:material_id",
    "title": "자료실 게시물 삭제",
    "name": "자료실_게시물_삭제",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "material_id",
            "description": "<p>게시물 ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>자료실 게시물 삭제 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        message: '자료가 삭제되었습니다.'\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>자료실 게시물 삭제 권한 에러</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>자료실 게시물 삭제 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   '권한이 없습니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   '본인이 아닌경우 파일을 지울 수 없습니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   '존재하지 않는 자료입니다.',\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "can.manage"
      },
      {
        "name": "can.upload"
      }
    ],
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "post",
    "url": "/filebox/folder/:parent_id",
    "title": "자료실 게시물 생성",
    "name": "자료실_게시물_생성",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>게시물 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>게시물 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "files",
            "description": "<p>업로드된 파일 ID 들의 배열</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "parent_id",
            "description": "<p>부모 폴더의 ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "201",
            "description": "<p>자료실 게시물 생성 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201\n    {\n        material: {\n        id: newMaterial.id,\n        name: newMaterial.title,\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "400",
            "description": "<p>자료실 게시물 생성 실패 에러</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>자료실 게시물 생성 권한 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n   '올바르지 않은 parent id 입니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n   '올바르지 않은 첨부파일입니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   '권한이 없습니다.',\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "can.manage"
      },
      {
        "name": "can.upload"
      }
    ],
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "patch",
    "url": "/filebox/material/:material_id",
    "title": "자료실 게시물 수정",
    "name": "자료실_게시물_수정",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "material_id",
            "description": "<p>게시물 ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>게시물 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>게시물 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "files",
            "description": "<p>업로드된 파일 ID 들의 배열</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>자료실 게시물 수정 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        message: '자료가 수정되었습니다.'\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "400",
            "description": "<p>자료실 게시물 첨부파일 수정 에러</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>자료실 게시물 수정 권한 에러</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>자료실 게시물 수정 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n   '올바르지 않은 첨부파일입니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   '권한이 없습니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   '본인이 아닌경우 파일을 지울 수 없습니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   '존재하지 않는 자료입니다.',\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "can.manage"
      },
      {
        "name": "can.upload"
      }
    ],
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "get",
    "url": "/filebox/material/:material_id",
    "title": "자료실 게시물 조회",
    "name": "자료실_게시물_조회",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "material_id",
            "description": "<p>게시물 ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>자료실 게시물 조회 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        id: material.id,\n        folder_id: material.parent,\n        title: material.title,\n        author: material.author,\n        content: material.content,\n        created_date: material.created_date,\n        files: await getFileInfoArray(material.files),\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>자료실 게시물 조회 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   '존재하지 않는 자료입니다.',\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "delete",
    "url": "/filebox/group/:group_id",
    "title": "자료실 그룹(폴더) 삭제",
    "name": "자료실_그룹_삭제",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group_id",
            "description": "<p>그룹(폴더) ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>자료실 그룹(폴더) 삭제 성공</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>자료실 그룹(폴더) 수정 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   '해당 그룹 또는 폴더가 존재하지 않습니다.'\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "can.manage"
      }
    ],
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "post",
    "url": "/filebox/group",
    "title": "자료실 그룹(폴더) 생성",
    "name": "자료실_그룹_생성",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>그룹(폴더) 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isfolder",
            "description": "<p>그룹, 폴더를 나누는 변수</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "parent_id",
            "description": "<p>부모 ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "201",
            "description": "<p>자료실 그룹(폴더) 생성 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201\n    {\n        group: {\n            id: newGroup.id,\n            name: newGroup.name,\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "400",
            "description": "<p>자료실 그룹(폴더) 생성 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n   '올바르지 않은 parent group id 입니다.',\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "can.manage"
      }
    ],
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "patch",
    "url": "/filebox/group:group_id",
    "title": "자료실 그룹(폴더) 이름 수정",
    "name": "자료실_그룹_이름_수정",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group_id",
            "description": "<p>그룹(폴더) ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>그룹(폴더) 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isfolder",
            "description": "<p>그룹, 폴더를 나누는 변수</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "parent_id",
            "description": "<p>부모 ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>자료실 그룹(폴더) 이름 수정 성공</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>지료실 그룹(폴더) 수정 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   message: 'no group id' + req.params.group_id,\n}",
          "type": "json"
        }
      ]
    },
    "permission": [
      {
        "name": "can.manage"
      }
    ],
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "get",
    "url": "/filebox/",
    "title": "자료실 자료 목록",
    "name": "자료실_자료_목록",
    "group": "Filebox",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "groups",
            "description": "<p>자료실 자료 목록 배열</p>"
          }
        ]
      }
    },
    "description": "<p>groups는 배열로 id, name, isfolder, children 이 각각 들어있음</p>",
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "get",
    "url": "/filebox/folder/:parent_id",
    "title": "자료실 폴더 조회",
    "name": "자료실_폴더_조회",
    "group": "Filebox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "parent_id",
            "description": "<p>부모 폴더 ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>자료실 폴더 조회 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        folder: {\n            name: folder.name,\n        },\n        materials: mat,\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "404",
            "description": "<p>자료실 게시물 폴더 조회 실패 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404\n{\n   '존재하지 않는 group id 입니다.',\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/filebox.route.js",
    "groupTitle": "Filebox"
  },
  {
    "type": "patch",
    "url": "/home/simple",
    "title": "Simple 홈 화면 변경",
    "description": "<p>Simple 홈 화면의 내용을 변경</p>",
    "name": "EditSimpleHome",
    "group": "Home",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>바꿀 홈 화면의 내용</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\"content\":\"홈화면 내용\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/home.route.js",
    "groupTitle": "Home"
  },
  {
    "type": "get",
    "url": "/home/simple",
    "title": "Simple 홈 화면",
    "description": "<p>Simple 홈 화면의 내용을 가져옴</p>",
    "name": "ViewSimpleHome",
    "group": "Home",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\"content\":\"홈화면 내용\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/home.route.js",
    "groupTitle": "Home"
  },
  {
    "type": "post",
    "url": "/mypage/edit",
    "title": "마이페이지 회원정보 수정",
    "name": "마이페이지_회원정보_수정",
    "group": "Mypage",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>유저 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>유저 비밀번호</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "realname",
            "description": "<p>유저 실명</p>"
          },
          {
            "group": "Parameter",
            "type": "Email",
            "optional": false,
            "field": "email",
            "description": "<p>유저 이메일</p>"
          },
          {
            "group": "Parameter",
            "type": "JWT",
            "optional": false,
            "field": "editToken",
            "description": "<p>회원정보 보안 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "201",
            "description": "<p>마이페이지 회원정보 수정 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201\n    {\n        message: 'success',\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "400",
            "description": "<p>마이페이지 비밀번호 에러</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "403",
            "description": "<p>마이페이지 비정상적 접근 에러</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n   message:'비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   '토큰이 만료되었습니다.',\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403\n{\n   message: '정상적인 접근이 아닙니다',\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/mypage.route.js",
    "groupTitle": "Mypage"
  },
  {
    "type": "get",
    "url": "/mypage/",
    "title": "마이페이지 회원정보 조회",
    "name": "마이페이지_회원정보_조회",
    "group": "Mypage",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>마이페이지 회원정보 조회 성공</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n    {\n       username: user.username,\n       realname: user.info.realname,\n       email: user.info.email,\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/mypage.route.js",
    "groupTitle": "Mypage"
  },
  {
    "type": "post",
    "url": "/absencecheck/absenceBook/",
    "title": "공결예약",
    "description": "<p>사용자가 결석예약 날짜들을 선택하면 프론트에서 list 형태로 back에 전달하고 db에 해당 정보를 날짜별로 각각 저장한다.</p>",
    "name": "BookedOfficialAbsence",
    "group": "OfficialAbsence",
    "permission": [
      {
        "name": "absence.canOwn'create')"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "dayList",
            "description": "<p>공결이 예약된 날짜</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Reason",
            "description": "<p>공결 신청 사유</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example usage:",
          "content": "{\n \"dayList\": [2020-03-02, 2020-03-05],\n \"Reason\": \"가족여행\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/absencecheck.route.js",
    "groupTitle": "OfficialAbsence"
  },
  {
    "type": "delete",
    "url": "/absencecheck/deleteAbsenceUser/",
    "title": "공결 신청 취소",
    "description": "<p>사용자의 공결 신청 내역 삭제</p>",
    "name": "DeleteOfficialAbsence",
    "group": "OfficialAbsence",
    "permission": [
      {
        "name": "absence.canOwn('delete')"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reason",
            "description": "<p>공결 신청 사유</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>신청 날짜</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response:",
          "content": "{\n \"reason\": \"가족여행\",\n\"day\": \"2020-03-11\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/absencecheck.route.js",
    "groupTitle": "OfficialAbsence"
  },
  {
    "type": "post",
    "url": "/absencecheck/deleteAbsenceUser/",
    "title": "공결 승인, 승인 취소",
    "description": "<p>공결 승인된, 승인안된 내역 저장</p>",
    "name": "OfficialAbsenceAccept",
    "group": "OfficialAbsence",
    "permission": [
      {
        "name": "absence.can('update')"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>신청한사람</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>신청 날짜</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "approval",
            "description": "<p>승인여부(true일 경우 승인, false일 경우 승인안됨)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response:",
          "content": "{\n \"name\": \"admin\",\n \"day\": \"2020-03-11\",\n \"approval\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/absencecheck.route.js",
    "groupTitle": "OfficialAbsence"
  },
  {
    "type": "get",
    "url": "/absencecheck/absenceUsersData/:day",
    "title": "일별공결현황",
    "description": "<p>officialAbsences Collection에서 day에 해당되는 일 단위 공결 현황을 전부 가지고 옴</p>",
    "name": "OfficialAbsenceDayStates",
    "group": "OfficialAbsence",
    "permission": [
      {
        "name": "absence.canOwn('read')"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>출석한 날짜</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example usage:",
          "content": "{\n http://localhost:5000/api/v1/absencecheck/absenceusersdata/2020-03-06\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "object",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response:",
          "content": "[\n{\n  \"_id\": \"5e61e45fa48a7b2d508566c0\",\n\"name\": \"admin\",\n\"day\": \"2020-03-06T00:00:00.000Z\",\n\"reason\": \"코로나19로 인해 결석합니다\",\n\"approval\": false,\n\"__v\": 0\n}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/absencecheck.route.js",
    "groupTitle": "OfficialAbsence"
  },
  {
    "type": "get",
    "url": "/absencecheck/officialAbsenceList",
    "title": "공결신청 리스트",
    "description": "<p>오늘날짜 이후의 공결신청 리스트 반환</p>",
    "name": "OfficialAbsenceList",
    "group": "OfficialAbsence",
    "permission": [
      {
        "name": "absence.can('update')"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "noanswer",
            "description": "<p>공결신청 승인 안 된 리스트</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "yesanswer",
            "description": "<p>공결신청 승인 된 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response:",
          "content": "{\n\"noanswer\":[\n{\"_id\": \"5e46479c9a8e6a2b403531d2\", \"name\": \"admin\", \"day\": \"2020-03-17T00:00:00.000Z\",…},\n{\"_id\": \"5e46479c9a8e6a2b403531d3\", \"name\": \"admin\", \"day\": \"2020-03-19T00:00:00.000Z\",…}\n],\nyesanswer\":[\n{\"_id\": \"5e61f4aa0ce72701e8f91a74\", \"name\": \"helloworld\", \"day\": \"2020-03-11T00:00:00.000Z\",…}\n]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/absencecheck.route.js",
    "groupTitle": "OfficialAbsence"
  },
  {
    "type": "get",
    "url": "/absencecheck/absenceUserData/",
    "title": "공결 현황",
    "description": "<p>officialAbsences Collection에서 자신(로그인한 사용자)의 공결 현황을 전부 가지고 옴</p>",
    "name": "OfficialAbsenceStates",
    "group": "OfficialAbsence",
    "permission": [
      {
        "name": "attendance.canOwn('read')"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "object",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response:",
          "content": "[\n {\n \"_id\": \"5e3a6d318368e4cbe88a52bc\",\n\"name\": \"admin\",\n\"day\": \"2020-02-12T00:00:00.000Z\",\n\"reason\": \"여행\",\n\"approval\": true,\n\"__v\": 0\n}\n,\n{\n\"_id\": \"5e61e45fa48a7b2d508566c0\",\n\"name\": \"admin\",\n\"day\": \"2020-03-06T00:00:00.000Z\",\n\"reason\": \"코로나19로 인해 결석합니다\",\n\"approval\": false,\n\"__v\": 0\n}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/absencecheck.route.js",
    "groupTitle": "OfficialAbsence"
  },
  {
    "type": "post",
    "url": "/penaltyconfig/delete/",
    "title": "상벌점 항목 삭제",
    "description": "<p>상벌점 항목 삭제</p>",
    "name": "penaltyconfigDelete",
    "group": "PenaltyConfig",
    "permission": [
      {
        "name": "penalty.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>상벌점 항목 이름</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    key : \"과제 지각\",\n}",
          "type": "post"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "200",
            "optional": false,
            "field": "code",
            "description": "<p>기록 성공시 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penaltyconfig.route.js",
    "groupTitle": "PenaltyConfig"
  },
  {
    "type": "get",
    "url": "/penaltyconfig/read/",
    "title": "상벌점 항목 조회",
    "description": "<p>사용자의 상벌점 항목 조회</p>",
    "name": "penaltyconfigRead",
    "group": "PenaltyConfig",
    "permission": [
      {
        "name": "penalty.can.read"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>상벌점 항목을 배열로 반환</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>상벌점 항목의 이름</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "value",
            "description": "<p>상벌점 항목의 점수</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    [{\n        type:\"지각\",\n        date:\"2020-03-19\",\n        description:\"지각\",\n        point:-1\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penaltyconfig.route.js",
    "groupTitle": "PenaltyConfig"
  },
  {
    "type": "post",
    "url": "/penaltyconfig/update/",
    "title": "상벌점 항목 수정",
    "description": "<p>상벌점 항목의 점수 수정</p>",
    "name": "penaltyconfigUpdate",
    "group": "PenaltyConfig",
    "permission": [
      {
        "name": "penalty.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>상벌점 항목 이름</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    key : \"과제 지각\",\n    value : -1\n}",
          "type": "post"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "200",
            "optional": false,
            "field": "code",
            "description": "<p>기록 성공시 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penaltyconfig.route.js",
    "groupTitle": "PenaltyConfig"
  },
  {
    "type": "post",
    "url": "/penaltyconfig/write/",
    "title": "상벌점 항목 생성",
    "description": "<p>상벌점 항목 생성</p>",
    "name": "penaltyconfigWrite",
    "group": "PenaltyConfig",
    "permission": [
      {
        "name": "penalty.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>상벌점 항목 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>상벌점 점수</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    key : \"과제 지각\",\n    value : \"-1\"\n}",
          "type": "post"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "200",
            "optional": false,
            "field": "code",
            "description": "<p>기록 성공시 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penaltyconfig.route.js",
    "groupTitle": "PenaltyConfig"
  },
  {
    "type": "delete",
    "url": "/penalty/delete",
    "title": "상벌점 삭제",
    "description": "<p>사용자의 상벌점 삭제</p>",
    "name": "penaltyDelete",
    "group": "Penalty",
    "permission": [
      {
        "name": "penalty.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>조회할 사용자의 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>상벌점 항목 타입</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>상벌점 항목 설명</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>상벌점 항목 부여 날짜</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    username : \"admin\",\n    type : \"과제 지각\",\n    description : \"과제 지각\"\n    date : \"2020-03-19\"\n}",
          "type": "delete"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "200",
            "optional": false,
            "field": "code",
            "description": "<p>기록 성공시 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penalty.route.js",
    "groupTitle": "Penalty"
  },
  {
    "type": "get",
    "url": "/penalty/read/:username",
    "title": "상벌점 조회",
    "description": "<p>사용자의 상벌점 조회</p>",
    "name": "penaltyRead",
    "group": "Penalty",
    "permission": [
      {
        "name": "penalty.can.read"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>조회할 사용자의 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "start_date",
            "description": "<p>기간 조회 시작 날짜</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end_date",
            "description": "<p>기간 조회 종료 날짜</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>사용자의 상벌점 항목을 배열로 반환</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>상벌점 항목의 타입</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>상벌점 항목이 기록된 날짜</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>상벌점 항목의 설명</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "point",
            "description": "<p>상벌점 항목의 점수</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    [{\n        type:\"지각\",\n        date:\"2020-03-19\",\n        description:\"지각\",\n        point:-1\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penalty.route.js",
    "groupTitle": "Penalty"
  },
  {
    "type": "get",
    "url": "/penalty/read",
    "title": "상벌점 전체 조회",
    "description": "<p>전체 상벌점 조회</p>",
    "name": "penaltyReadAll",
    "group": "Penalty",
    "permission": [
      {
        "name": "penalty.can.read"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>사용자의 상벌점 항목을 배열로 반환</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>상벌점 항목의 타입</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>상벌점 항목의 사용자</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>상벌점 항목이 기록된 날짜</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>상벌점 항목의 설명</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "point",
            "description": "<p>상벌점 항목의 점수</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    [{\n        type:\"지각\",\n        username:\"admin\"\n        date:\"2020-03-19\",\n        description:\"지각\",\n        point:-1\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penalty.route.js",
    "groupTitle": "Penalty"
  },
  {
    "type": "post",
    "url": "/penalty/write/",
    "title": "상벌점 쓰기",
    "description": "<p>사용자의 상벌점 기록</p>",
    "name": "penaltyWrite",
    "group": "Penalty",
    "permission": [
      {
        "name": "penalty.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "users",
            "description": "<p>입력할 사용자들의 아이디 배열</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>상벌점 항목 타입</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>상벌점 항목 설명</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "date",
            "description": "<p>상벌점 항목 부여 날짜</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    users : {\"admin\",\"test01\"},\n    type : \"과제 지각\",\n    description : \"과제 지각\"\n    date : \"2020-03-19\"\n}",
          "type": "post"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "200",
            "optional": false,
            "field": "code",
            "description": "<p>기록 성공시 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/penalty.route.js",
    "groupTitle": "Penalty"
  },
  {
    "type": "patch",
    "url": "/role/:role_tag",
    "title": "역할 권한 변경",
    "description": "<p>태그가 role_tag 역할의 권한을 변경함</p>",
    "name": "ChangeRolePerm",
    "group": "role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>바꿀 역할 이름</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "perms",
            "description": "<p>바꿀 권한의 정보</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"name\":\"role1\",\n    \"perms\":[\n        {\"allow\":false,\"resource\":\"manageUsers\",\"action\":\"access\",\"range\":\"any\"},\n        {\"allow\":false,\"resource\":\"manageBoards\",\"action\":\"access\",\"range\":\"any\"}\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "post",
    "url": "/role",
    "title": "역할 추가",
    "description": "<p>새로운 역할을 추가함</p>",
    "name": "CreateRole",
    "group": "role",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>역할 이름</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{ name: \"role1\" }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>새 역할의 태그</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>새 역할의 이름</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\"tag\":\"1913c\",\"name\":\"role1\",\"perm\":{}}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "delete",
    "url": "/role/:role_tag",
    "title": "역할 삭제",
    "description": "<p>태그가 role_tag인 역할을 삭제함</p>",
    "name": "DeleteRole",
    "group": "role",
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "get",
    "url": "/role/me",
    "title": "내 역할 조회",
    "description": "<p>내 아이디에 부여된 역할과 권한 정보를 받아옴</p>",
    "name": "MyRole",
    "group": "role",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "roles",
            "description": "<p>나에게 부여된 역할들</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "perms",
            "description": "<p>나에게 부여된 권한들</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "      HTTP/1.1 200 OK\n{\n  \"roles\": [\n    \"admin\"\n  ],\n  \"perms\": [\n    {\n      \"role\": {\n        \"all\": {\n          \"any\": [],\n          \"own\": [\n            \"read\"\n          ]\n        }\n      },\n      \"managePreusers\": {},\n      \"serverConfig\": {},\n      \"manageUsers\": {},\n      \"manageBoards\": {}\n    },\n    {\n      \"serverConfig\": {\n        \"all\": [\n          \"change\"\n        ]\n      }\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "get",
    "url": "/role",
    "title": "역할 조회",
    "description": "<p>모든 역할들의 정보와 권한들을 가져옴</p>",
    "name": "RoleAllInfos",
    "group": "role",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "roles",
            "description": "<p>나에게 부여된 역할들</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "perms",
            "description": "<p>나에게 부여된 권한들</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "      HTTP/1.1 200 OK\n{\n  \"roles\": [\n    \"admin\"\n  ],\n  \"perms\": [\n    {\n      \"role\": {\n        \"all\": {\n          \"any\": [],\n          \"own\": [\n            \"read\"\n          ]\n        }\n      },\n      \"managePreusers\": {},\n      \"serverConfig\": {},\n    },\n    {\n      \"serverConfig\": {\n        \"all\": [\n          \"change\"\n        ]\n      }\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "get",
    "url": "/role/:role_tag",
    "title": "해당 역할의 정보 조회",
    "description": "<p>태그가 role_tag 역할의 정보를 보여줌</p>",
    "name": "RoleInfo",
    "group": "role",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>역할의 태그</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>역할의 이름</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "perm",
            "description": "<p>역할의 권한</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"tag\":\"admin\",\n    \"name\":\"관리자\",\n    \"perm\":{ ... }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "get",
    "url": "/role/managepage",
    "title": "역할의 권한 목록 조회",
    "description": "<p>변경할 수 있는 권한의 정보들을 가져옴</p>",
    "name": "RolePermList",
    "group": "role",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "-",
            "description": "<p>frontend의 SettingSelect 컴포넌트에 들어갈 데이터형식</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\"type\":\"header\",\"title\":\"관리\"},\n   {\"type\":\"switch\",\"title\":\"유저 관리\",\n    \"content\":\"유저의 비밀번호를 초기화하거나, 강제 탈퇴시킬 수 있습니다.\",\n    \"target\":{\"resource\":\"manageUsers\",\"action\":\"access\",\"range\":\"any\"}\n   }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "get",
    "url": "/role/:role_tag/users",
    "title": "역할 유저 조회",
    "description": "<p>태그가 role_tag 역할에 속한 유저들을 보여줌</p>",
    "name": "RoleUsers",
    "group": "role",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>역할에 속한 유저들</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"users\":[\n       {\"username\":\"admin\",\"realname\":\"관리자\"}]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/role.route.js",
    "groupTitle": "role"
  },
  {
    "type": "post",
    "url": "/schedule/delete",
    "title": "일정 삭제",
    "description": "<p>일정을 삭제한다.</p>",
    "name": "delete",
    "group": "schedule",
    "permission": [
      {
        "name": "schedule.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>일정 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>일정 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>일정 색상</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>일정 시작 날짜</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>일정 종료 날짜</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   {\n        \"title\": \"Hash Code Online Qualification Round 2020\",\n        \"content\": \"Hash Code Online Qualification Round 2020\",\n        \"color\": \"#FFA726FF\",\n        \"start\": \"2020-02-21\",\n        \"end\": \"2020-02-21\",\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>종료 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/schedule.route.js",
    "groupTitle": "schedule"
  },
  {
    "type": "get",
    "url": "/schedule/read",
    "title": "일정 조회",
    "description": "<p>schedule Collection 에서 모든 일정을 조회 한다.</p>",
    "name": "read",
    "group": "schedule",
    "permission": [
      {
        "name": "schedule.can.read"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "array",
            "description": "<p>일정 객체 배열을 반환한다.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>일정 제목</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>일정 내용</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>일정 색상코드</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>일정 시작 날짜</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>일정 종료 날짜</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n    [\n        {\n            \"_id\": \"5e453f4400ee863e3c84f1ee\",\n            \"title\": \"스터디\",\n            \"content\": \"스터디\",\n            \"color\": \"#2196F3FF\",\n            \"start\": \"2020-02-26T00:00:00.000Z\",\n            \"end\": \"2020-02-26T00:00:00.000Z\",\n            \"__v\": 0\n          },\n          {\n            \"_id\": \"5e453f4400ee863e3c84f1ef\",\n            \"title\": \"스터디\",\n            \"content\": \"스터디\",\n            \"color\": \"#2196F3FF\",\n            \"start\": \"2020-02-28T00:00:00.000Z\",\n            \"end\": \"2020-02-28T00:00:00.000Z\",\n            \"__v\": 0\n          },\n          {\n            \"_id\": \"5e453f6900ee863e3c84f1f0\",\n            \"title\": \"Hash Code Online Qualification Round 2020\",\n            \"content\": \"Hash Code Online Qualification Round 2020\",\n            \"color\": \"#FFA726FF\",\n            \"start\": \"2020-02-21T00:00:00.000Z\",\n            \"end\": \"2020-02-21T00:00:00.000Z\",\n            \"__v\": 0\n         }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/schedule.route.js",
    "groupTitle": "schedule"
  },
  {
    "type": "post",
    "url": "/schedule/write",
    "title": "일정 추가",
    "description": "<p>일정을 추가한다. 연속된 날짜의 일정일 경우 <code>start</code>,<code>end</code>를 처리하여 하나의 일정으로 만들어 준다.</p>",
    "name": "write",
    "group": "schedule",
    "permission": [
      {
        "name": "schedule.can.update"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>일정 제목</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>일정 내용</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>일정 색상</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "dayList",
            "description": "<p>날짜들을 담은 배열</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "     {\n         {\n\t            \"dayList\":[\"2020-02-11\",\"2020-02-14\",\"2020-02-15\",\"2020-02-19\"],\n\t            \"title\":\"스터디\",\n\t            \"content\":\"시니어 스터디\",\n             \"color\":\"red\"\n         }\n     }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "200",
            "description": "<p>종료 코드</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/schedule.route.js",
    "groupTitle": "schedule"
  },
  {
    "type": "post",
    "url": "/user/:username/role",
    "title": "유저 역할 부여",
    "description": "<p>아이디가 username 인 유저에게 역할을 부여함</p>",
    "name": "AddUserRole",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "roletag",
            "description": "<p>부여할 역할의 roletag</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  },
  {
    "type": "delete",
    "url": "/user/:username",
    "title": "유저 회원 탈퇴",
    "description": "<p>아이디가 username 인 유저를 탈퇴시킴</p>",
    "name": "DeleteUser",
    "group": "user",
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  },
  {
    "type": "delete",
    "url": "/user/:username/role/:roletag",
    "title": "유저의 역할 제거",
    "description": "<p>아이디가 username 인 유저의, 태그가 roletag인 역할을 빼버림</p>",
    "name": "DeleteUserRole",
    "group": "user",
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  },
  {
    "type": "post",
    "url": "/user/:username/resetpassword",
    "title": "유저 회원 탈퇴",
    "description": "<p>아이디가 username 인 유저의 비밀번호를 초기화시킴</p>",
    "name": "ResetUserPassword",
    "group": "user",
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  },
  {
    "type": "put",
    "url": "/user/:username/role",
    "title": "유저 역할 부여",
    "description": "<p>아이디가 username 인 유저의 역할을 설정함</p>",
    "name": "SetUserRole",
    "group": "user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "roletags",
            "description": "<p>설정할 역할들의 태그들</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{roletags: [\"admin\"]}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  },
  {
    "type": "get",
    "url": "/user/:username/role",
    "title": "유저 역할 가져오기",
    "description": "<p>아이디가 username 인 유저에게 부여된 역할들을 가져옴</p>",
    "name": "UserRoles",
    "group": "user",
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "유저 조회",
    "description": "<p>유저의 전체 목록을 가져옴</p>",
    "name": "Users",
    "group": "user",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total",
            "description": "<p>결과의 개수</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>유저 정보 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"total\":1,\n    \"users\":[\n        {\"username\":\"admin\",\"realname\":\"관리자\",\"roles\":[\"admin\"]}\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/v1/user.route.js",
    "groupTitle": "user"
  }
] });
