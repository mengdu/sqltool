import * as Sql from './index'

export = BaseModel

declare class BaseModel {
  readonly $name: string;
  readonly $connect: any;
  constructor(tableName: string, connect: any);

  create: (data: {[key: string]: any}, conds?: Sql.CreateConds, ignore?: boolean) => Promise<BaseModel.ChangeResult>;
  insert: (arr: {[key: string]: any}[], ignore?: boolean) => Promise<BaseModel.ChangeResult>;
  update: (arr: {[key: string]: any}, conds: Sql.Condition | null) => Promise<BaseModel.ChangeResult>;
  delete: (conds: Sql.Condition | null) => Promise<BaseModel.ChangeResult>;
  findAll: (options: BaseModel.FindAllOptions) => Promise<BaseModel.QueryResult[]>;
  findOne: (options: BaseModel.FindOneOptions) => Promise<BaseModel.QueryResult | null>;
  count: (options: BaseModel.FindAllOptions) => Promise<number>;
}

declare namespace BaseModel {
  interface ChangeResult {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    warningCount: number;
    message: string;
    changedRows: number;
  }
  
  interface FindOneOptions {
    aliasName?: string;
    attrs?: string[] | [string | { isRaw: boolean; value: string }, string][] | { isRaw: boolean; value: string }[];
    where?: Sql.Condition;
    having?: Sql.Condition;
    joins?: Sql.JoinOptions;
    order?: Sql.OrderFields;
    group?: string[];
  }
  
  interface QueryResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  
  interface FindAllOptions extends FindOneOptions {
    offset?: number;
    limit?: number;
  }
}
