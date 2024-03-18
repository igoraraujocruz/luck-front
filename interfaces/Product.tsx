import { LuckNumber } from "./LuckNumber"

export interface IProduct {
    id: string
    name: string
    imgSrc: string
    videoSrc: string
    description: string
    luckDay: string
    slug: string
    price: string
    isActivate: boolean
    quantidadeDeRifas: number
    rifasRestantes: number
    createdAt: string
    updatedAt: string
    rifas: LuckNumber[]
}