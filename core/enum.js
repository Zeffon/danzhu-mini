/**
 * Create by Zeffon on 2020/10/3
 */

const FileCategory = {
  IMAGE: 1,
  FILE: 2,
  VIDEO: 3
}

const GroupType = {
  CREATE: 3,
  JOIN: 2,
  OTHER: 1
}

const GroupApplyStatus = {
  WAITING: 0,
  PASSED: 1,
  REFUSED: 2,
  ALL: 3
}

const GroupList = {
  CREATE: 'create',
  JOIN: 'join'
}

const CollectType = {
  COLLECT: 'collect',
  SEND: 'send'
}

const AuthImage = {
  DENY: 'deny',
  NOT_AUTH: 'not_auth',
  AUTHORIZED: 'authorized'
}

const Statistics = {
  BAR: 1,
  GAUGE: 2,
  LINE: 3,
  PIE: 4
}

export {
  FileCategory,
  GroupType,
  GroupApplyStatus,
  GroupList,
  CollectType,
  AuthImage,
  Statistics
}