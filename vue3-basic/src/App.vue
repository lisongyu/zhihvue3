<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <h1>{{count}}</h1>
  <h2>{{double}}</h2>
  <h3>x:{{x}},y:{{y}}</h3>
  <ul>
    <li v-for="number in numbers" :key="number">
      {{number}}

    </li>
  </ul>
  <h1>{{person.name}}</h1>
  <button @click="increase">+1</button>
</template>

<script lang="ts">
import { ref,computed,reactive,toRefs,watch,onMounted,onUnmounted } from 'vue';
interface DataProps{
  count: number;
  increase: () => void;
  double: number;
  numbers: number[];
  person: {name?: string};
}

export default {
  name: 'App',
  setup(){
    // const count =ref(0)
    // const double =computed(()=>{
    //   return count.value*2
    // })
    // const increase = () => {
    //   count.value++
    // }

    const data: DataProps=reactive({
      count:0,
      increase:()=>{
        data.count++
      },
      double:computed(()=>data.count*2),
      numbers:[0,1,2],
      person:{}
    })

    const x=ref(0)
    const y=ref(0)
    const undateMouse =(e: MouseEvent) => {
      x.value =e.pageX
      y.value=e.pageY
    }

    onMounted(()=>{
      document.addEventListener('click',undateMouse)
    })
    onUnmounted(()=>{
       document.removeEventListener('click',undateMouse)
    })
    watch([()=>data.count],()=>{
      document.title=''+data.count
    })
    // data.numbers[0]=5
    // data.person.name='hah'
    return {
      ...toRefs(data),
      x,
      y
    }
  }
  
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
