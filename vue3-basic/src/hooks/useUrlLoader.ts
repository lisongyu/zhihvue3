import {ref} from 'vue'
import axios from 'axios'

function useURLLoader<T>(url: string){
  const res=ref<T|null>(null)
  const loading=ref(true)
  const loaded=ref(false)
  const error =ref(null)
  axios.get(url).then((rawdate)=>{
    loading.value=false
    loaded.value = true
    res.value=rawdate.data
  }).catch(e=>{
    error.value=e
    loading.value =false
  })

  return {
    res,
    loading,
    error,
    loaded
  }
}

export default useURLLoader