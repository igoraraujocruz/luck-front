import { Client } from "./Client"

export interface LuckNumber {
    id: string
    number: number
    isPaid: boolean
    productId: string
    createdAt: string
    updatedAt: string
    client: Client[]
  }