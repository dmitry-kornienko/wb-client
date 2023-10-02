// import {
//     // BuyOperation,
//     // Complect,
//     // CompositionBuyOperation,
//     // CompositionItem,
//     // SendOperation,
//     // SendOperationCompositionItem,
// } from "../../server/node_modules/@prisma/client/index";

export type ErrorWithMessage = {
    status: number;
    data: {
        message: string;
    };
};

export type FullComplect = Complect & { composition: CompositionItem[] };

export type FullBuyOperation = BuyOperation & {
    composition: CompositionBuyOperation[];
};

export type FullSendOperation = SendOperation & {
    composition: SendOperationCompositionItem[];
};

export type OrderResponse = {
    date: string;
    lastChangeDate: string;
    supplierArticle: string;
    techSize: string;
    barcode: string;
    totalPrice: number;
    discountPercent: number;
    warehouseName: string;
    oblast: string;
    incomeID: number;
    odid: number;
    nmId: number;
    subject: string;
    category: string;
    brand: string;
    isCancel: boolean;
    cancel_dt: string;
    gNumber: string;
    sticker: string;
    orderType: string;
};

export type User = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export type Component = {
    _id: string;
    name: string;
    article: string;
    count: number;
    price: number;
    desc: string | null;
};

export type Complect = {
    _id: string;
    name: string;
    article: string;
    count: number;
    composition: {
        component: Component,
        count: number
    }[]
}

export type CompositionItem = {
    id: string;
    name: string;
    article: string;
    count: number;
    complectId: string
}

export type BuyOperation = {
    _id: string;
    date: string;
    composition: {
        component: Component,
        count: number,
        price: number
    }[]
}

export type CompositionBuyOperation = {
    id: string;
    name: string;
    article: string;
    count: number;
    price: number;
    buyOperationId: string;
}

export type PackedOperation = {
    _id: string;
    date: string;
    complect: Complect;
    count: number;
}

export type SendOperation = {
    _id: string;
    sendingData: string;
    isPacked: boolean;
    isSended: boolean;
    warehous: string;
    sendNumberMP: string | null;
    invoiceNumber: string | null;
    partCount: number;
    weight: number;
    acceptDate: string;
    isAgreed: boolean;
    isAccepted: boolean;
    composition: {
        complect: Complect,
        count: number
    }[]
}

export type SendOperationCompositionItem = {
    id: string;
    complectName: string;
    complectArticle: string;
    count: number;
    sendOperationId: string;
    complectId: string;
}