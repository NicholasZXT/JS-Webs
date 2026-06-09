// typebox 有两个版本：
// - @sinclair/typebox: Pre-1.0 versions，仓库为 https://github.com/sinclairzx81/sinclair-typebox，但也是 LTS 版本
// - typebox: Post-1.0 versions，仓库为 https://github.com/sinclairzx81/typebox
// 两者的TS编译引擎不一样，参见 https://github.com/sinclairzx81/typebox#versions 说明
import { Type, type Static } from 'typebox'
// import { Type, type Static } from '@sinclair/typebox'

// ===== 原始类型 =====
const TString = Type.String()                    // string
const TNumber = Type.Number({ minimum: 0 })      // number (带约束)
const TBoolean = Type.Boolean()                  // boolean
const TNull = Type.Null()                        // null
const TLiteral = Type.Literal('admin')           // 'admin'
const TEnum = Type.Enum(['ADMIN', 'USER'])       // 枚举映射

// ===== 复合类型 =====
const TArray = Type.Array(Type.String(), { maxItems: 10 })
const TTuple = Type.Tuple([Type.String(), Type.Number()])
const TObject = Type.Object({ name: Type.String(), age: Type.Number() })
const TRecord = Type.Record(Type.String(), Type.Number())

// ===== 工具类型（对应 TS 内置工具类型）=====
const TPartial = Type.Partial(TObject)            // Partial<T>
const TRequired = Type.Required(TPartial)         // Required<T>
const TPick = Type.Pick(TObject, ['name'])        // Pick<T, K>
const TOmit = Type.Omit(TObject, ['age'])         // Omit<T, K>
const TUnion = Type.Union([Type.String(), Type.Number()])
const TIntersect = Type.Intersect([TObject, Type.Object({ id: Type.String() })])


// ===== JSON Schema定义与 TS静态类型自动推断 =====
const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  email: Type.Optional(Type.String({ format: 'email' })),
  role: Type.Union([Type.Literal('admin'), Type.Literal('user')]),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
})

// ✅ 自动推断，无需手写 interface
type User = Static<typeof UserSchema>
/*
type User = {
  id: string;
  name: string;
  email?: string | undefined;
  role: "admin" | "user";
  metadata?: Record<string, unknown> | undefined;
}
*/