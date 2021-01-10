// 原始=》 响应式

let toProxy =new WeakMap() // 缓存对象
// 响应式=》 原始
let toRaw = new WeakMap()

let effectStack = []  // 存储effect的地方
let targetMap =new WeakMap() // 特殊的{} key是object
// 收集依赖 存储依赖关系
function track(target,key){
  // 收集依赖

  const effect =effectStack[effectStack.length-1]  //取最后一个
  // 最新的effect
  if(effect){
    let depMap = targetMap.get(target);
    if(depMap===undefined){
      depMap =new Map()
      targetMap.set(target,depMap)
    }
    let dep =depMap.get(key) // obj.count target为object key 是count
    if(dep==undefined){
      dep =new Set()
      depMap.set(key,dep)
    }
    // 双向存储无处不在，优化的原则
    if(!dep.has(effect)){
      dep.add(effect)
      console.log('dep')
      console.log(dep)
      effect.deps.push(dep)

    }
  }
}
// 触发
function trigger(target,key,info){
  // 寻找依赖effect

  const depMap =targetMap.get(target)
  if(depMap === undefined){
    // 没有依赖
    return
  }
  console.log(depMap)
  const effects =new Set() // 普通执行
  const computedRunners =new Set() // 计算属性
  if(key){
    let deps =depMap.get(key)
    // deps里面全部在effect
    deps.forEach(effect=>{
      console.log(effect.computed)
      if(effect.computed){
        computedRunners.add(effect)
      }else{
        effects.add(effect)
      }
    })
  }
  effects.forEach(effect=>effect())
  computedRunners.forEach(computed=>computed())
   
}

// 
function effect(fn,options={}){
  // 其实就是在effectStack push了一个函数，执行fn
  let e= createReactiveEffect(fn,options)
  // 如果不是计算属性，立即执行
  if(!options.lazy){
    e()
  }
  return e
}
function createReactiveEffect(fn,options){
  // 构造effect
  const effect =function effect(...args){
    return run(effect,fn,args)
  }
  effect.deps = []
  effect.computed = options.computed
  effect.lazy = options.lazy
  return effect
}
function run(effect,fn,args){
  if(effectStack.indexOf(effect)===-1){
    try{
      effectStack.push(effect)
      return fn(...args)
    }finally{
      effectStack.pop()
    }
  }
}

function computed(fn){
  // 特殊的effect,重新定义函数
  const runner = effect(fn,{computed:true,lazy:true})
  return {
    effect:runner,
    get value(){
      return runner()
    }
  }
}
// let obj = {name:'kkb'}
// console.log(obj.name)
const baseHandle ={
  get(target,key){
    // 收集依赖
    track(target,key)
    const res = Reflect.get(target,key)  // 设置返回值
    return typeof res=='object'?reactive(res):res  // 递归操作
  },
  set(target,key,val){
    // obj.name='通知更新'
    const res = Reflect.set(target,key,val)
    // 触发更新 trigger
    trigger(target,key,{oldValue:target[key],newValue:val})
    return res
  }
}
// 响应式
function reactive(target){
    // 查询缓存
    let observed=toProxy.get(target)
    if(observed){
      return observed
    }
    if(toRaw.get(target)){
      return target
    }
    observed =new Proxy(target,baseHandle)// 响应式代理
    // 设置缓存
    toProxy.set(target,observed)
    toRaw.set(observed,target)

    return observed
}

