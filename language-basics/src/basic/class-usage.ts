/**
 * 练习 JavaScript/TypeScript 中的类使用。
 */

// ======================
// 原型模式创建对象——JavaScript版本
// ======================
// 使用JavaScript的原型模式创建对象，定义一个构造函数，并在其原型上添加方法。
// 这里参数中的 this:any 是为了避免 TypeScript 报错，但在 JavaScript 中，构造函数内部的 this 是动态绑定的，不需要此参数
function PersonFunc(this:any, name: string) {
    // 在构造函数内部，this 指向新创建的对象实例
    // 设置对象的实例属性
    this.name = name;

    // sayBye函数虽然每个创建出来的对象都有，但是每个对象sayBye并不是同一个Fuction对象（即不共享） —— 不推荐此种方式。
    this.sayBye = function() { console.log('Bye'); };

    // ❌ 这行代码会报错，因为this是普通对象，没有 prototype 属性 ！！！
    // this.prototype.sayYou = function() { console.log('You'); };

    // sayHello虽然定义在prototype上，每个对象都有，也是同一个，但是每次调用都会创建重复创建 —— 不推荐此种方式。
    PersonFunc.prototype.sayHello = function() { console.log('Hello'); };
}
// sayHi函数是在构造函数外部定义，并且是在prototype上定义的属性，因此每个对象都有，也是同一个函数对象（即共享） —— 推荐此种方式。
PersonFunc.prototype.sayHi = function() { console.log('Hi'); };


// ======================
// 原型模式创建对象——TypeScript版本
// ======================
// 在 TypeScript 中，如果想使用原型模式创建对象，需要使用如下方式：

// ------ 方案1：显式声明 this 类型参数 ------
// 先定义实例的类型接口
interface PersonFuncTS {
  name: string;
}

// 在函数第一个参数位置声明 this 的类型
function PersonFuncTS(this: PersonFuncTS, name: string) {
  this.name = name; // ✅ 现在 TS 知道 this 有 name 属性
}

// 使用时需配合 new，并且需要 PersonFuncTS as any 来绕过类型检查，因为默认下 TypeScript 不认为普通函数是构造函数。
// const pts = new PersonFuncTS('Alice');
const pts = new (PersonFuncTS as any)('Alice');

// ------ 方案2：使用 new 构造签名 + 函数表达式显式声明 this 类型参数 ------
interface Person {
  name: string;
}

interface PersonConstructor {
  new(name: string): Person;
  prototype: Person;
}

// const PersonFuncTS2: PersonConstructor = function (this: Person, name: string): void {
//   this.name = name;
// } as PersonConstructor;

// // 现在可以安全使用
// const pts2 = new PersonFuncTS2('Alice'); // ✅


// ======================
// 类的基本使用
// ======================
// 定义一个简单的类，包含实例属性、方法、静态属性和静态方法。
class Person {
    // 实例属性类型声明：这是 TypeScript 的要求，JavaScript 中不需要提前申明属性类型。
    name: string;
    age: number;

    // 下面的实例属性和静态属性定义方式是 ES2022 引入，在 ES6(ES2015) 中还不支持。
    // ✅ 实例属性
    // 每个实例都会有独立的 speciesType 属性
    speciesType = "Homo sapiens";
    // ✅ 实例属性（也可以是对象、函数等）
    metadata = { created: Date.now() };

    // ✅ 静态属性（类属性）：挂载在 Person 构造函数上，作为Person函数的一个属性
    static category = "mammal";

    // ✅ 构造函数：用于初始化实例属性（name, age）
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
        // 注意：上面的 speciesType 和 metadata 会在 constructor 执行前自动赋值
    }

    // ✅ 原型方法：所有实例共享，挂载在prototype上
    sayHello() {
        console.log(`Hello, I'm ${this.name}`);
    }

    // ✅ 静态方法：挂载在 Person 构造函数上，作为Person函数的一个属性
    static species() {
        return "Homo sapiens";
    }
}

// 验证
const p = new Person("Alice", 30);
console.log(p.speciesType); // "Homo sapiens" （实例属性）
console.log(p.sayHello === Person.prototype.sayHello); // true （共享方法）

console.log(Person.category); // "mammal" （静态属性）
console.log(Person.species()); // "Homo sapiens" （静态方法）
