const Sql = require('../src')
const Op = Sql.Op

test('test order', () => {
  expect(Sql.order()).toBe('')
  expect(Sql.order({})).toBe('')
  expect(Sql.order([])).toBe('')

  expect(Sql.order({ a: 'desc', b: 'asc' })).toBe('order by `a` desc, `b` asc')
  expect(Sql.order([['a', 'desc'], ['b', 'asc']])).toBe('order by `a` desc, `b` asc')
})

test('test group', () => {
  expect(Sql.group([])).toBe('')
  expect(Sql.group()).toBe('')

  expect(Sql.group(['a', 'b'])).toBe('group by `a`, `b`')
  expect(Sql.group(['a'])).toBe('group by `a`')
})

test('test where', () => {
  expect(Sql.where()).toBe('')
  expect(Sql.where({})).toBe('')

  expect(Sql.where({ a: 1, b: 'test' })).toBe('where `a` = 1 and `b` = \'test\'')
  expect(Sql.where({ 'u.userId': 1000 })).toBe('where `u`.`userId` = 1000')
  expect(Sql.where({ a: { isId: true, value: 'u.id' } })).toBe('where `a` = `u`.`id`')
  expect(Sql.where({ a: Op.isNull() })).toBe('where `a` is null')
  expect(Sql.where({ a: Op.like('%abc%') })).toBe('where `a` like \'%abc%\'')
  expect(Sql.where({ a: Op.id('u.userId') })).toBe('where `a` = `u`.`userId`')
  expect(Sql.where({ a: Op.id('u.userId', '!=')})).toBe('where `a` != `u`.`userId`')
  expect(Sql.where({ a: Op.raw('is null')})).toBe('where `a` is null')

  expect(Sql.where({ $or: [] })).toBe('')
  expect(Sql.where({ $or: {} })).toBe('')
  expect(Sql.where({
    b: 20,
    $or: [{ a: Op.gt(18) }, { a: Op.lt(12) }]
  })).toBe('where `b` = 20 and (`a` > 18 or `a` < 12)')
  expect(Sql.where({
    b: 20,
    $or: { a: 18, b: 12 }
  })).toBe('where `b` = 20 and (`a` = 18 or `b` = 12)')

  expect(Sql.where({ $and: [] })).toBe('')
  expect(Sql.where({ $and: [{ a: Op.gt(10) }, { a: Op.lte(50) }] })).toBe('where (`a` > 10 and `a` <= 50)')
})

test('test select', () => {
  expect(Sql.select()).toBe('select * from')
  expect(Sql.select([])).toBe('select * from')

  expect(Sql.select(['a'])).toBe('select `a` from')
  expect(Sql.select(['a as b'])).toBe('select `a` as `b` from')
  expect(Sql.select(['u.a as b'])).toBe('select `u`.`a` as `b` from')
  expect(Sql.select(['a', 'b'])).toBe('select `a`, `b` from')
  expect(Sql.select(['a', Op.raw('count(*) as count')])).toBe('select `a`, count(*) as count from')
  expect(Sql.select([['a', 'a1'], ['b', 'b1']])).toBe('select `a` as `a1`, `b` as `b1` from')
  expect(Sql.select([[Op.raw('count(*)'), 'count']])).toBe('select (count(*)) as `count` from')
})

test('test join', () => {
  expect(Sql.join([])).toBe('')
  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u' }
  ])).toBe('join `users` as `u`')
  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u' },
    { table: 'types', type: 'left join', as: 't' }
  ])).toBe('join `users` as `u` left join `types` as `t`')

  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u', on: ['u.id', '=', 'uid'] },
  ])).toBe('join `users` as `u` on `u`.`id` = `uid`')
  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u', on: { status: Op.isNotNull() } },
  ])).toBe('join `users` as `u` on `status` is not null')

  expect(Sql.join([
    { table: Op.raw('select * users'), type: 'join', as: 'u' }
  ])).toBe('join (select * users) as `u`')
})
