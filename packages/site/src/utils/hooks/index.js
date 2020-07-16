import { useEffect, useState } from 'react'

export function useLoad(cancelableFetch, page, pageSize) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const { promise, cancel } = cancelableFetch({ page: page - 1, pageSize })
    promise
      .then(({ result: data }) => {
        setItems(data.items)
        setTotal(data.total)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => cancel()
  }, [page, pageSize, cancelableFetch])

  return { items, loading, total }
}
