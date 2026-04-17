/**
 * 装饰器使用示例.
 * 
 * 装饰器是一种特殊的声明，可以被附加到类、方法、属性或参数上。
 * 它本质上是一个函数，在运行时执行，用于修改或增强被它修饰的对象的原始行为。
 * 它的语法以 @ 符号开头，后面紧跟一个函数（或一个能返回函数的函数）。
 * 
 * 在TypeScript中启用装饰器需要在 tsconfig.json 中设置:
 * {
 *   "compilerOptions": {
 *     "target": "ES2022", // 需要较新的 target 以支持标准装饰器
 *     "experimentalDecorators": true,
 *     "emitDecoratorMetadata": true
 *   }
 * }
 * 注意: 以下示例基于 TypeScript 的传统装饰器 (legacy decorators)，
 * 这是目前最广泛被框架（如 Angular, NestJS）采用的形式。
 */

// ======================
// 1. 类装饰器 (Class Decorator)
// ======================
/**
 * 类装饰器作用于类的构造函数。
 * 它接收一个参数：目标类的构造函数。
 * 可用于修改类的定义、添加静态属性/方法，或返回一个全新的类。
 * 这里使用了泛型<T extends { new (...args: any[]): {} }>，它的含义如下：
 *   - T: 这是一个泛型占位符，代表“某个具体的类型”。在这里，T 代表的是被装饰的那个类本身。
 *   - extends { new (...args: any[]): {} }: 这是对 T 的约束，表示 T 必须是一个构造函数类型。换句话说，T 必须是一个可以被实例化的类。
 *     - (...args: any[]): 表示它的构造函数可以接受任意数量、任意类型的参数。
 *     - : {}: 表示调用 new 之后，会返回一个对象（{} 是所有对象的基类型）。
 * 定义了泛型 T 之后，函数的参数 constructor 也被指定为 T 类型 —— 因为 **一个类的名字本身就是它的构造函数**。
 */
function ClassLogger<T extends { new (...args: any[]): {} }>(constructor: T) {
    // 这里直接 extends 原类的构造函数 —— 这是extends语法所允许的。
    // 返回一个新的匿名类（省略了子类的名称），继承自原类
    return class extends constructor {
        // 为新类添加一个额外的属性
        loggingEnabled = true;
        // 重写 toString 方法
        toString() {
            return `[Logged ${constructor.name}]`;
        }
    };
}

@ClassLogger
class User {
    constructor(public name: string) {
        this.name = name;
    }
}

// 使用示例
const user = new User("Alice");
console.log(user.toString()); // 输出: [Logged User]
console.log((user as any).loggingEnabled); // 输出: true


// ======================
// 方法装饰器 (Method Decorator)
// ======================
/**
 * 方法装饰器作用于类的方法。
 * 
 * 它接收三个参数：
 * - target: 目标对象，也就是方法所属的“容器”对象。
 *   - 对于实例方法（最常见）：target 是类的 prototype 对象。
 *   - 对于静态方法（用 static 关键字定义的）：target 是类的构造函数本身。
 *  作用：告诉你“要去哪个对象上找这个方法”。
 * - propertyKey: 属性键，即方法的名称（字符串），标识“要找的具体是哪个属性/方法”。
 * - descriptor: 属性描述符，它是一个PropertyDescriptor对象，完整地描述了该属性（方法）是如何被定义的。
 *   对于普通方法来说，它的属性描述符配置如下：
 *   - value: [Function: add] // 也就是方法本身的函数对象
 *   - onfigurable: true   // 能否被删除或修改描述符
 *   - enumerable: false   // 能否在 for...in 循环中被枚举
 *   - writable: true      // （仅对数据属性）值能否被修改
 *   作用：它让你可以完全控制这个属性的行为。你可以替换它的 value（函数体），或者把它从一个数据属性变成一个访问器属性（getter/setter）。
 * 
 * 返回值：
 * 在底层，JS 引擎在应用装饰器时，会使用类似 Object.defineProperty(target, propertyKey, newDescriptor) 的方式。
 * 因此一般装饰器只需要提供新的 descriptor 即可，引擎会负责完成剩下的工作。
 * 
 * 在方法装饰器中，最常见的用法是修改 descriptor.value 来包装原始方法，从而在调用原方法前后添加一些额外的逻辑（如日志、性能监控、权限检查等）。
 */
function MethodTimer(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    // 保存原始方法的引用，以便在新的函数中调用它
    const originalMethod = descriptor.value;

    // 用一个新的函数包装原始方法
    descriptor.value = function (...args: any[]) {
        console.time(`⏱️  ${propertyKey}`);
        const result = originalMethod.apply(this, args);
        console.timeEnd(`⏱️  ${propertyKey}`);
        return result;
    };

    // 返回修改后的 descriptor，JS 引擎会使用它来重新定义这个方法
    return descriptor;
}

class Calculator {
    @MethodTimer
    add(a: number, b: number): number {
        // 模拟一些计算耗时
        for (let i = 0; i < 1e6; i++) {}
        return a + b;
    }
}

// 使用示例
const calc = new Calculator();
calc.add(5, 3); // 控制台会输出类似: ⏱️  add: 0.874ms



// ======================
// 装饰器工厂 (Decorator Factory)
// ======================
/**
 * 装饰器工厂是一个返回装饰器函数的函数。
 * 它允许你在使用装饰器时传入自定义参数，使装饰器更加灵活和可复用。
 */
function ValidateStringLength(min: number, max: number) {
    // 这是一个属性装饰器工厂
    // 它返回一个装饰器函数，这个函数会被应用到被装饰的属性上。
    return function (target: any, propertyKey: string) {
        let value: string;

        const getter = () => value;
        const setter = (newVal: string) => {
            if (newVal.length < min || newVal.length > max) {
                throw new Error(`属性 '${propertyKey}' 的长度必须在 ${min} 到 ${max} 之间`);
            }
            value = newVal;
        };

        // 使用 Object.defineProperty 来替换属性的 getter/setter
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}

class Product {
    @ValidateStringLength(2, 20)
    name: string = "";

    constructor(name: string) {
        this.name = name; // 如果 name 长度不符合要求，这里会抛出错误
    }
}

// 使用示例
try {
    const validProduct = new Product("Laptop"); // OK
    console.log(`产品名: ${validProduct.name}`);

    const invalidProduct = new Product("A"); // 抛出错误!
} catch (error: any) {
    console.error(error.message); // 输出: 属性 'name' 的长度必须在 2 到 20 之间
}



// ======================
// 参数装饰器 (Parameter Decorator)
// ======================
/**
 * 参数装饰器作用于构造函数或方法的参数。
 * 它本身不能做太多事，但通常与其他装饰器或元数据反射 API 结合使用，用于依赖注入或参数验证。
 * 它接收三个参数：
 * - target: 对于静态成员是类的构造函数，对于实例成员是类的原型对象。
 * - propertyKey: 成员的名称。如果是构造函数，则为 undefined。
 * - parameterIndex: 参数在函数签名中的索引（从0开始）。
 * 参数装饰器自身不能修改参数值，但常与 Reflect Metadata API 结合使用，
 * 在运行时由其他逻辑（如依赖注入容器）读取这些元数据。
 * 
 * 下面的依赖注入示例展示了如何使用参数装饰器来标记构造函数参数需要被注入一个特定的服务实例。
 * 各个部分的作用如下：
 * - 依赖声明：MyComponent 的构造函数参数 config: IConfigService 声明了它需要一个 IConfigService 类型的依赖。
 * - 依赖标识：@Inject(ConfigServiceIdentifier) 装饰器提供了具体的“查找键”（ConfigServiceIdentifier）。
 * - 依赖实现：ConfigService 类是 IConfigService 接口的具体实现。
 * - 依赖注入：容器 (createInstance) 创建了 ConfigService 的实例，并把它作为参数传递给了 MyComponent 的构造函数。
 * 此模式的好处是解耦：MyComponent 不再与 ConfigService 的具体实现硬编码在一起，使得代码更易于测试（可以注入 mock 服务）和维护。
 */
import 'reflect-metadata'; // 需要安装 reflect-metadata 库: npm install reflect-metadata

// 定义一个服务标识符（通常是一个 Symbol 或接口）
const ConfigServiceIdentifier = Symbol('ConfigService');

// 模拟一个配置服务：定义该服务的接口和一个实现类。
// 此服务的实现类会被作为依赖注入到 MyComponent 中。
// 从DI的概念来看，就是 MyComponent 依赖于 ConfigService。
interface IConfigService {
    get(key: string): string;
}
class ConfigService implements IConfigService {
    get(key: string) { return `value_of_${key}`; }
}

// 参数装饰器（装饰器工厂），用于标记该参数需要被注入
// 它接受一个服务标识符，根据服务标识符来为参数打上元数据标签，告诉依赖注入容器这个参数需要被注入什么类型的服务实例。
// 效果是：当 MyComponent 被定义时，在它的构造函数上贴一个‘便签’，写着：‘第一个参数（index 0）需要一个 ConfigServiceIdentifier 类型的服务’
function Inject(serviceIdentifier: symbol) {
    return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
        // 使用 Reflect API 存储元数据
        // 这里我们存储一个映射：[parameterIndex] => serviceIdentifier
        // 1. 尝试读取已有的参数类型，返回的是一个数组，索引对应参数位置，值是服务标识符
        // let existingMappings: any[] = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey) || [];
        const metadataKey = 'injection:paramtypes';
        let existingMappings: any[] = Reflect.getOwnMetadata(
            metadataKey, 
            target, 
            propertyKey as any // <-- 类型断言是安全的，因为运行时 Reflect 支持 undefined
        ) || [];
        // 2. 在对应参数索引的位置，存入服务标识符
        existingMappings[parameterIndex] = serviceIdentifier;
        // 3. 把更新后的映射写回元数据
        Reflect.defineMetadata('injection:paramtypes', existingMappings, target, propertyKey as any);
    };
}

class MyComponent {
    private config: IConfigService;

    // 使用 @Inject 装饰器标记构造函数参数，告诉依赖注入容器这个参数需要被注入一个 ConfigService 实例
    // 注意，即使是依赖管理容器createInstance，也是通过此构造函数传入依赖项的。
    // 也可以手动使用 new MyComponent(new ConfigService()) 来创建实例，但使用依赖注入容器可以自动处理依赖关系，简化实例化过程。
    constructor(@Inject(ConfigServiceIdentifier) config: IConfigService) {
        this.config = config;
    }

    getConfigValue(key: string) {
        return this.config.get(key);
    }
}

// 模拟一个简单的依赖注入容器（简化版）
/**
 * 创建一个类的实例，并自动注入其依赖项。
 * 此函数核心思想是：通过读取构造函数参数上的元数据，知道需要注入哪些依赖，然后创建这些依赖的实例，最后把它们传给构造函数来创建目标类的实例。
 * 参数：一个类的构造函数（如 MyComponent）。
 * 过程：
 *   1. 读取元数据：通过 Reflect.getMetadata 找到之前 Inject 装饰器留下的“便签”（即 paramTypes 数组）。
 *   2. 解析依赖：遍历这个数组，看到 ConfigServiceIdentifier，就去 new 一个 ConfigService 实例。
 *      这就是“依赖注入”的核心——容器负责创建并提供依赖项。
 *   3. 创建实例：用解析好的依赖项作为参数，调用原始的构造函数 new MyComponent(configServiceInstance)。
 * 返回值：一个已经配置好所有依赖的、可以直接使用的 MyComponent 实例。
 */
function createInstance<T>(constructor: new (...args: any[]) => T): T {
    // 1. 获取构造函数需要注入的参数类型/标识符
    const paramTypes = Reflect.getMetadata('injection:paramtypes', constructor) || [];
    
    // 2. 根据标识符解析实际的依赖实例
    const resolvedArgs = paramTypes.map((identifier: any) => {
        if (identifier === ConfigServiceIdentifier) {
            // 这里就是“解析依赖”
            return new ConfigService(); // 这里简化了，实际容器会管理单例等
        }
        throw new Error(`无法解析依赖: ${identifier}`);
    });

    // 3. 创建实例
    return new constructor(...resolvedArgs);
}

// 使用示例：这里不直接 new MyComponent，而是通过 createInstance 来创建，这样依赖注入才会生效。
// 注意 MyComponent 后面没有调用的括号，因为 createInstance 内部会调用 new MyComponent(...) 来创建实例。
const component = createInstance(MyComponent);
console.log(component.getConfigValue('apiUrl')); // 输出: value_of_apiUrl
// 当然，也可以手动创建实例，但这就失去了依赖注入的好处:
const manualComponent = new MyComponent(new ConfigService());
console.log(manualComponent.getConfigValue('apiUrl')); // 输出: value_of_apiUrl
