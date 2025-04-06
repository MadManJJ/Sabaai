export interface ReservationItem {
    _id: string,
    user: string,
    shop: Shop,
    date: string,
    createdAt: string,
    __v: string,
}

export interface ReservationJson {
    count: number,
    data: ReservationItem[]
}

export interface User {
    isBan: boolean,
    _id: string,
    name: string,
    email: string,
    role: string,
    telephone: string
}

export interface Shop {
    _id: string,
    name: string,
    address: number,
    telephone: string,
    openTime: string,
    closeTime: string,
    reservations: ReservationItem[]
}

export interface Service {
    _id: string,
    shop: string,
    name: string,
    price: number,
    details: string
}

export interface ServiceJson {
    success: boolean,
    count: number,
    data: Service[]
}

export interface ShopJson {
    success: boolean,
    count: number,
    data: Shop[]
}

export interface UpdateReservationDto {
    shop: string;
    date: string;
}

export interface CreateReservatinDto {
    date: string,
    service: string
}

export interface ConnectedReservation {
    userName: string;
    _id: string;
    user: string;
    shop: Shop;
    date: string;
    createdAt: string;
    __v: string;
}