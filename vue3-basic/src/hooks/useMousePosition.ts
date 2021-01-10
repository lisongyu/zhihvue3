import {ref,onMounted,onUnmounted} from 'vue'

function useMousePosition(){
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
  return {
    x,y
  }
}

export default useMousePosition