import { useEffect, useState } from 'react'

export default function useLoadDetail(cancelableFetch, params = []) {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    setLoading(true)
    const { promise, cancel } = cancelableFetch(...params)
    promise
      .then(({ result: data }) => {
        setDetail(data)
      })
      .catch(e => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => cancel()
  }, [cancelableFetch, params])

  return { detail, loading }
}
