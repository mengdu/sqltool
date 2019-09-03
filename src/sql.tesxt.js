const Sql = require('./index')
const { Op } = Sql

function test (title, fn) {
  try {
    fn()
  } catch (err) {
    console.error(err.message)
    throw new Error('[FAIL]: ' + title)
  }

  console.log('[pass]:', title)
}

function expect (res, exp) {
  if (res === exp) return true

  throw new Error(`${res} != ${exp}`)
}

test('test order', () => {
  expect(Sql.order({ a: 'desc', b: 'asc' }), 'order by `a` desc, `b` asc')
  expect(Sql.order([['a', 'desc'], ['b', 'asc']]), 'order by `a` desc, `b` asc')
  expect(Sql.order(), '')
  expect(Sql.order({}), '')
  expect(Sql.order([]), '')
})

test('test group', () => {
  expect(Sql.group([]), '')
  expect(Sql.group(), '')
  expect(Sql.group(['a', 'b']), 'group by `a`, `b`')
  expect(Sql.group(['a']), 'group by `a`')
})

test('test where', () => {
  expect(Sql.where(), '')
  expect(Sql.where({}), '')
  expect(Sql.where({ a: 1, b: 'test' }), 'where `a` = 1 and `b` = \'test\'')
  expect(Sql.where({ 'u.userId': 1000 }), 'where `u`.`userId` = 1000')
  expect(Sql.where({ a: { isId: true, value: 'u.id' } }), 'where `a` = `u`.`id`')
  expect(Sql.where({ a: Op.isNull() }), 'where `a` is null')
  expect(Sql.where({ a: Op.like('%abc%') }), 'where `a` like \'%abc%\'')
  expect(Sql.where({ a: Op.id('u.userId') }), 'where `a` = `u`.`userId`')
  expect(Sql.where({ a: Op.id('u.userId', '!=')}), 'where `a` != `u`.`userId`')
  expect(Sql.where({ a: Op.raw('is null')}), 'where `a` is null')

  expect(Sql.where({ $or: [] }), '')
  expect(Sql.where({ $or: {} }), '')
  expect(Sql.where({
    b: 20,
    $or: [{ a: Op.gt(18) }, { a: Op.lt(12) }]
  }), 'where `b` = 20 and (`a` > 18 or `a` < 12)')
  expect(Sql.where({
    b: 20,
    $or: { a: 18, b: 12 }
  }), 'where `b` = 20 and (`a` = 18 or `b` = 12)')

  expect(Sql.where({ $and: [] }), '')
  expect(Sql.where({ $and: [{ a: Op.gt(10) }, { a: Op.lte(50) }] }), 'where (`a` > 10 and `a` <= 50)')
})

test('test select', () => {
  expect(Sql.select(), 'select * from')
  expect(Sql.select([]), 'select * from')
  expect(Sql.select(['a']), 'select `a` from')
  expect(Sql.select(['a as b']), 'select `a` as `b` from')
  expect(Sql.select(['u.a as b']), 'select `u`.`a` as `b` from')
  expect(Sql.select(['a', 'b']), 'select `a`, `b` from')
  expect(Sql.select(['a', Op.raw('count(*) as count')]), 'select `a`, count(*) as count from')
  expect(Sql.select([['a', 'a1'], ['b', 'b1']]), 'select `a` as `a1`, `b` as `b1` from')
  expect(Sql.select([[Op.raw('count(*)'), 'count']]), 'select (count(*)) as `count` from')
})

test('test join', () => {
  expect(Sql.join([]), '')
  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u' }
  ]), 'join `users` as `u`')
  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u' },
    { table: 'types', type: 'left join', as: 't' }
  ]), 'join `users` as `u` left join `types` as `t`')

  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u', on: ['u.id', '=', 'uid'] },
  ]), 'join `users` as `u` on `u`.`id` = `uid`')
  expect(Sql.join([
    { table: 'users', type: 'join', as: 'u', on: { status: Op.isNotNull() } },
  ]), 'join `users` as `u` on `status` is not null')

  expect(Sql.join([
    { table: Op.raw('select * users'), type: 'join', as: 'u' }
  ]), 'join (select * users) as `u`')
})
