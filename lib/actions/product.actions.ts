'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
// import { connectToDatabase } from '../db'
// import Product, { IProduct } from '../db/models/product.model'

export async function getAllCategories() {
  await connectToDatabase()
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  )
  return categories
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}

//GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  try {
    await connectToDatabase()
    const products = await Product.find({
      tags: { $in: [tag] },
      isPublished: true,
    })
      .sort({ createdAt: 'desc' })
      .limit(limit)
    console.log('getProductsByTag works', products)
    console.log('Searching for tag:', tag)
    return JSON.parse(JSON.stringify(products)) as IProduct[]
  } catch (error) {
    console.error('Error in getProductsByTag:', error)
    return [] // ← ДОБАВИТЬ ЭТО!
  }
}
