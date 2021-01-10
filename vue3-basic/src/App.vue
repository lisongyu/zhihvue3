<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <h1>{{count}}</h1>
  <h2>{{double}}</h2>
  <h3>x:{{x}},y:{{y}}</h3>
  <section v-if="loading">
    loading!...
  </section>
  <Suspense>
    <template #default>
      <async-show />
    </template>
    <template  #fallback>
      <h1>Loading!...</h1>
    </template>
  </Suspense>
   <img v-if="loaded" :src="res.message" alt />
  <ul>
    <li v-for="number in numbers" :key="number">
      {{number}}

    </li>
  </ul>
  <h1>{{person.name}}</h1>
  <button @click="increase">+1</button>
</template>

<script lang="ts">
import { computed,reactive,toRefs,watch } from 'vue';
import useMousePosition from './hooks/useMousePosition'
import useURLLoader from './hooks/useUrlLoader';
import AsyncShow from './components/AsyncShow.vue'
interface DataProps{
  count: number;
  increase: () => void;
  double: number;
  numbers: number[];
  person: {name?: string};
}

interface DogResult {
  message: string;
  status: string;
}

export default {
  name: 'App',
  components:{
    AsyncShow
  },
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

    const {x,y}=useMousePosition()
    const {
      res,
      loading,
      loaded
    }=useURLLoader<DogResult>('https://dog.ceo/api/breeds/image/random')
    watch([()=>data.count],()=>{
      document.title=''+data.count
    })
    watch(res,()=>{
      console.log(res.value)
    })

    // data.numbers[0]=5
    // data.person.name='hah'
    return {
      ...toRefs(data),
      x,
      y,
       res,
      loading,
      loaded
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
