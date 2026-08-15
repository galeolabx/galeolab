import { useEffect, useState } from 'react'
import { useReveal } from './useReveal'

export function useCounter(target) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal(0.3)

  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.ceil(target / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [visible, target])

  return [ref, count]
}