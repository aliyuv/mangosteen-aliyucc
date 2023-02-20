import { AxiosRequestConfig } from 'axios'
import { faker } from '@faker-js/faker'
type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN')

export const mockTagShow: Mock = responseConfig => {
  const createTag = (attrs?: any) =>
  ({
    id: createId(),
    name: faker.lorem.word(),
    sign: faker.internet.emoji(),
    kind: 'expenses',
    ...attrs
  })
  return [200, { resource: createTag() }]
}
export const mockItemCreate: Mock = (responseConfig) => {
  return [
    200,
    {
      resource: {
        id: 2264,
        user_id: 1312,
        amount: 9900,
        note: null,
        tags_id: [3508],
        happen_at: '2020-10-29T16:00:00.000Z',
        created_at: '2022-07-03T15:35:56.301Z',
        updated_at: '2022-07-03T15:35:56.301Z',
        kind: 'expenses',
      },
    },
  ]
}
export const mockSession: Mock = (responseConfig) => {
  if (responseConfig.params._mock === 'signIn') {
    return [
      200,
      {
        jwt: faker.datatype.uuid(),
      },
    ]
  } else {
    return [401, {}]
  }
}
let id = 0
const createId = () => {
  id += 1
  return id
}
export const mockTagIndex: Mock = (responseConfig) => {
  const { kind, page } = responseConfig.params
  const per_page = 25 // 当前页显示的数量
  const count = 26 // 总数
  const createPager = (page = 1) => ({ page, per_page, count })
  const createTag = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: responseConfig.params.kind,
      ...attrs,
    }))
  const createBody = (n = 1, attrs?: any) => ({
    resources: createTag(n),
    pager: createPager(page),
  })
  if (kind === 'expenses' && (!page || page === 1)) {
    //如果是支出且是第一页 !page 如果不存在page 也就是第一页
    return [200, createBody(25)]
  } else if (kind === 'expenses' && page === 2) {
    //如果是支出且是第二页
    return [200, createBody(1)]
  } else if (kind === 'income' && (!page || page === 1)) {
    return [200, createBody(25)]
  } else {
    return [200, createBody(1)]
  }
}