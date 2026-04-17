/**
 * JavaScript / TypeScript 反射（Reflection）API 全面示例.
 * 
 * 反射是一种语言特性，使程序能够在运行时动态地获取对象的信息（如属性、方法等），并对其进行操作（读取、设置、删除、调用等）。
 * 
 * ES6(ES2015) 引入了内置对象 Reflect，它提供了一组静态方法，用于执行与对象相关的操作。
 * 这些方法与 Object 上的一些方法功能类似，但设计更一致、语义更清晰，并且总是返回布尔值或明确的结果，便于错误处理。
 */

// ===== 1. Reflect.get(target, propertyKey[, receiver]) =====
// 用于获取 target 对象上 propertyKey 属性的值
// receiver 参数用于指定 getter 函数中的 this 值（当属性是 getter 时）
const obj1 = {
  name: 'Alice',
  get greeting() {
    return `Hello, ${this.name}`;
  }
};
console.log('1. Reflect.get 示例:');
console.log(Reflect.get(obj1, 'name')); // "Alice"
console.log(Reflect.get(obj1, 'greeting', { name: 'Bob' })); // "Hello, Bob"（this 被绑定到 {name: 'Bob'}）


// ===== 2. Reflect.set(target, propertyKey, value[, receiver]) =====
// 设置 target 对象上 propertyKey 属性的值为 value
// receiver 用于指定 setter 中的 this（当属性是 setter 时）
const obj2 = {
  _age: 0,
  set age(val: number) {
    if (val < 0) throw new Error('Age must be positive');
    this._age = val;
  },
  get age() {
    return this._age;
  }
};
console.log('\n2. Reflect.set 示例:');
Reflect.set(obj2, 'age', 30, obj2); // 正确设置
console.log(obj2.age); // 30
// Reflect.set(obj2, 'age', -5, obj2); // 会抛出错误


// ===== 3. Reflect.has(target, propertyKey) =====
// 判断 target 是否拥有 propertyKey 属性（包括原型链上的属性）
// 等价于 `propertyKey in target`
const obj3 = { x: 1 };
console.log('\n3. Reflect.has 示例:');
console.log(Reflect.has(obj3, 'x')); // true
console.log(Reflect.has(obj3, 'toString')); // true（继承自 Object.prototype）


// ===== 4. Reflect.deleteProperty(target, propertyKey) =====
// 删除 target 上的 propertyKey 属性
// 返回 boolean：删除成功返回 true，否则 false（如属性不可配置）
const obj4 = { a: 1, b: 2 };
Object.defineProperty(obj4, 'c', { value: 3, configurable: false });
console.log('\n4. Reflect.deleteProperty 示例:');
console.log(Reflect.deleteProperty(obj4, 'a')); // true
console.log('a' in obj4); // false
console.log(Reflect.deleteProperty(obj4, 'c')); // false（不可配置）
console.log('c' in obj4); // true


// ===== 5. Reflect.construct(target, argumentsList[, newTarget]) =====
// 等价于 new target(...argumentsList)
// 用于调用构造函数，常用于动态创建实例
class PersonV1 {
  constructor(public name: string, public age: number) {}
}
console.log('\n5. Reflect.construct 示例:');
const person = Reflect.construct(PersonV1, ['Charlie', 28]);
console.log(person instanceof PersonV1); // true
console.log(person.name); // "Charlie"


// ===== 6. Reflect.apply(target, thisArgument, argumentsList) =====
// 调用一个函数（target），并显式指定 this 和参数列表
// 等价于 Function.prototype.apply()
function multiply(a: number, b: number): number {
  return a * b;
}
console.log('\n6. Reflect.apply 示例:');
console.log(Reflect.apply(multiply, null, [3, 4])); // 12


// ===== 7. Reflect.defineProperty(target, propertyKey, attributes) =====
// 定义（或修改）对象上的一个属性，等价于 Object.defineProperty
// 但返回 boolean 而非对象，更符合“操作是否成功”的语义
const obj5: Record<string, any> = {};
const success = Reflect.defineProperty(obj5, 'readOnlyProp', {
  value: 'immutable',
  writable: false,
  configurable: false,
  enumerable: true
});
console.log('\n7. Reflect.defineProperty 示例:');
console.log('定义成功:', success); // true
console.log(obj5.readOnlyProp); // "immutable"


// ===== 8. Reflect.getOwnPropertyDescriptor(target, propertyKey) =====
// 获取对象自身属性的描述符（不包括原型链）
// 等价于 Object.getOwnPropertyDescriptor
const obj6 = { visible: true };
const desc: PropertyDescriptor | undefined = Reflect.getOwnPropertyDescriptor(obj6, 'visible');
console.log('\n8. Reflect.getOwnPropertyDescriptor 示例:');
console.log(desc); // { value: true, writable: true, enumerable: true, configurable: true }


// ===== 9. Reflect.isExtensible(target) =====
// 判断对象是否可扩展（能否添加新属性）
// 等价于 Object.isExtensible
const obj7 = {};
Object.preventExtensions(obj7);
console.log('\n9. Reflect.isExtensible 示例:');
console.log(Reflect.isExtensible(obj7)); // false


// ===== 10. Reflect.preventExtensions(target) =====
// 阻止对象扩展（不能再添加新属性）
// 等价于 Object.preventExtensions，但返回 boolean
const obj8 = { temp: 1 };
const prevented = Reflect.preventExtensions(obj8);
console.log('\n10. Reflect.preventExtensions 示例:');
console.log('阻止扩展成功:', prevented); // true
console.log(Reflect.isExtensible(obj8)); // false


// ===== 11. Reflect.getPrototypeOf(target) =====
// 获取对象的原型（__proto__）
// 等价于 Object.getPrototypeOf
const obj9 = {};
console.log('\n11. Reflect.getPrototypeOf 示例:');
console.log(Reflect.getPrototypeOf(obj9) === Object.prototype); // true


// ===== 12. Reflect.setPrototypeOf(target, prototype) =====
// 设置对象的原型
// 等价于 Object.setPrototypeOf，但返回 boolean
const obj10 = {};
const proto = { custom: 'value' };
const setProtoSuccess = Reflect.setPrototypeOf(obj10, proto);
console.log('\n12. Reflect.setPrototypeOf 示例:');
console.log('设置原型成功:', setProtoSuccess); // true
console.log(obj10.custom); // "value"


// ===== 13. Reflect.ownKeys(target) =====
// 返回对象自身的所有属性键（包括不可枚举和 Symbol 键）
// 等价于 Object.getOwnPropertyNames + Object.getOwnPropertySymbols
const sym = Symbol('id');
const obj11 = { normal: 1 };
Object.defineProperty(obj11, 'hidden', { value: 2, enumerable: false });
obj11[sym] = 'symbol value';
console.log('\n13. Reflect.ownKeys 示例:');
console.log(Reflect.ownKeys(obj11)); // ['normal', 'hidden', Symbol(id)]


// ===== 补充：Reflect 与 Proxy 的协同使用 =====
// 在 Proxy handler 中，常用 Reflect 方法转发默认行为
const targetObj = { count: 0 };
const handler: ProxyHandler<typeof targetObj> = {
  get(target, prop, receiver) {
    console.log(`[Proxy] 读取属性: ${String(prop)}`);
    return Reflect.get(target, prop, receiver); // 转发默认 get 行为
  },
  set(target, prop, value, receiver) {
    console.log(`[Proxy] 设置属性 ${String(prop)} = ${value}`);
    return Reflect.set(target, prop, value, receiver); // 转发默认 set 行为
  }
};
const proxyObj = new Proxy(targetObj, handler);
console.log('\n14. Reflect 与 Proxy 协同示例:');
proxyObj.count = 10; // 触发 set
console.log(proxyObj.count); // 触发 get

/**
 * 总结：
 * - Reflect 提供了一套标准化、函数式的对象操作接口
 * - 所有方法都返回明确结果（通常是 boolean 或值），便于错误处理
 * - 与 Proxy 完美配合，是现代 JS 元编程的基石
 * - 在框架开发（如 Vue、NestJS）、装饰器、AOP 等场景中广泛应用
 */