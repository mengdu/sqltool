// This .d.ts file is used for code prompts
export = Sql

declare class Sql {
  static Op: Sql.Op;
  static alias: (field: string, aliasName: string, isRaw?: boolean) => string;
  static escape: (value: any) => string;
  static escapeId: (value: string, isRaw?: boolean) => string;
  static raw: (sql: string) => { toSqlString: () => string };
  static format: (sql: string, params: object | any[]) => string;
  static select: (fields?: string[] | { isRaw: boolean, value: string }[] | [string, string][], table?: string) => string;
  static join: (tables: Sql.JoinOptions) => string;
  static order: (fields: Sql.OrderFields) => string;
  static group: (fields: string[]) => string;
  static condition: (conds: Sql.Condition) => string[];
  static where: (conds: Sql.Condition) => string;
  static having: (conds: Sql.Condition) => string;
  static create: (table: string, data: { [key: string]: any }, conds?: Sql.CreateConds, ignore?: boolean) => string;
  static insert: (table: string, arr: { [key: string]: any }[], ignore?: boolean) => string;
  static update: (table: string, data: { [key: string]: any }, conds: Sql.Condition | null) => string;
}

declare namespace Sql {
  type OrderString = 'DESC' | 'ASC' | 'desc' | 'asc'

  type OrderFields = { [key: string]: OrderString } | [string, OrderString][]

  type OperateType = '>' | '>=' | '<' | '<=' | '=' | '!='
  interface Op {
    gt (val: any): { oper: string, value: any };
    gte (val: any): { oper: string, value: any };
    lt (val: any): { oper: string, value: any };
    lte (val: any): { oper: string, value: any };
    eq (val: any): { oper: string, value: any };
    neq (val: any): { oper: string, value: any };
    between (arr: any[]): { isRaw: boolean, value: string };
    notBetween (arr: any[]): { isRaw: boolean, value: string };
    in (arr: any[]): { isRaw: boolean, value: string };
    notIn (arr: any[]): { isRaw: boolean, value: string };
    like (val: string): { isRaw: boolean, value: string };
    notLike (val: string): { isRaw: boolean, value: string };
    id (val: string, oper?: OperateType): { isId: boolean, value: string };
    isNull (): { isRaw: boolean, value: string };
    isNotNull (): { isRaw: boolean, value: string };
    raw (sql: string): { isRaw: boolean, value: string };
  }

  interface RawValue {
    isId?: boolean;
    isRaw?: boolean;
    oper?: OperateType;
    value: string;
  }

  interface DefaultCondition {
    [key: string]: any;
  }

  type KeyValue = RawValue | string | number | Date | DefaultCondition | undefined;

  type OrType = { [key: string]: KeyValue  }
  type AndType = OrType[]

  interface Condition extends DefaultCondition {
    [key: string]: KeyValue;
    $or?: OrType;
    $and?: AndType;
  }

  type OnType = [string, OperateType, string] | Condition
  type JoinType = 'join' | 'inner join' | 'left join' | 'right join'
  type JoinOptions = { type?: JoinType, table: string | { isRaw: boolean, value: string }, as?: string, on?: OnType }[]
  type CreateConds = { isRaw: boolean, value: string }
    | { exists: { where?: Condition, table?: string } }
    | { notExists: { where?: Condition, table?: string } }
}
