<template lang="">
  <div>
    <h1>{{result}}</h1>
  </div>
</template>
<script lang="ts">
  import {defineComponent} from 'vue'
  export default defineComponent({
    setup() {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          return resolve({
            result:42
          })
        },3000)
      })
    }
  })
</script>