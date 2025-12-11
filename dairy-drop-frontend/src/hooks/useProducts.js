import { useState, useMemo, useCallback } from 'react'
import {
  useListProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/api/productsApi.js'
import { handleMutation } from '@/shared/utils/handleMutation.js'

export function useProducts(initial = {}) {
  const [q, setQ] = useState(initial.q || '')
  const [category, setCategory] = useState(initial.category || '')
  const [minPrice, setMinPrice] = useState(initial.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice || '')
  const [inStock, setInStock] = useState(initial.inStock || '')
  const [page, setPage] = useState(initial.page || 1)
  const [limit, setLimit] = useState(initial.limit || 12)
  const [sort, setSort] = useState(initial.sort || '-createdAt')

  const queryArgs = useMemo(() => {
    const params = { page, limit, sort }
    if (q) params.q = q
    if (category) params.category = category
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (inStock) params.inStock = inStock
    return params
  }, [q, category, minPrice, maxPrice, inStock, page, limit, sort])

  const { data, isLoading, isError, error, refetch, isFetching } = useListProductsQuery(queryArgs)
  const items = data?.items || []
  const total = data?.total || 0
  const pages = data?.pages || 0

  // Mutations
  const [createProduct, createState] = useCreateProductMutation()
  const [updateProduct, updateState] = useUpdateProductMutation()
  const [deleteProduct, deleteState] = useDeleteProductMutation()

  const create = useCallback(
    async (payload) => handleMutation(createProduct, payload, 'Product created'),
    [createProduct]
  )
  const update = useCallback(
    async (payload) => handleMutation(updateProduct, payload, 'Product updated'),
    [updateProduct]
  )
  const remove = useCallback(
    async (id) => handleMutation(deleteProduct, id, 'Product deleted'),
    [deleteProduct]
  )

  return {
    // data
    items,
    total,
    pages,
    isLoading,
    isFetching,
    isError,
    error,

    // filters/pagination
    q,
    category,
    minPrice,
    maxPrice,
    inStock,
    page,
    limit,
    sort,

    // setters
    setQ,
    setCategory,
    setMinPrice,
    setMaxPrice,
    setInStock,
    setPage,
    setLimit,
    setSort,
    refetch,

    // CRUD actions
    create,
    update,
    remove,

    // mutation states
    createState,
    updateState,
    deleteState,
  }
}

