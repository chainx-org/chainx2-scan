import { useEffect, useMemo, useState } from 'react'

export default function useLoad(cancelableFetch, params = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const normalizedParams = useMemo(() => {
    const result = { ...params }
    if (result.page) {
      result.page = result.page - 1
    }
    return result
  }, [params])

  useEffect(() => {
    setLoading(true)
    const { promise, cancel } = cancelableFetch(normalizedParams)
    promise
      .then(({ result: data }) => {
        setItems(data.items)
        setTotal(data.total)
      })
      .catch(e => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => cancel()
  }, [cancelableFetch, normalizedParams])

  return { items, loading, total }
}
