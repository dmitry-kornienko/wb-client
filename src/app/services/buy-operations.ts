import { api } from './api';
import { BuyOperation } from '../../types';


export const buyOperationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllBuyOperations: builder.query<BuyOperation[], void>({
            query: () => ({
                url: '/buy-operation',
                method: 'GET'
            })
        }),
        getBuyOperation: builder.query<BuyOperation, string>({
            query: (id) => ({
                url: `/buy-operation/${id}`,
                method: 'GET'
            })
        }),
        editBuyOperation: builder.mutation<string, BuyOperation>({
            query: (buyOperation) => ({
                url: `/buy-operation/edit/${buyOperation._id}`,
                method: 'PUT',
                body: buyOperation
            }),
        }),
        removeBuyOperation: builder.mutation<string, string>({
            query: (id) => ({
                url: `/buy-operation/remove/${id}`,
                method: 'POST',
                body: { id }
            })
        }),
        addBuyOperation: builder.mutation<BuyOperation, BuyOperation>({
            query: (buyOperation) => ({
                url: '/buy-operation/add',
                method: 'POST',
                body: buyOperation
            })
        }),
    })
});

export const { useGetAllBuyOperationsQuery, useGetBuyOperationQuery, useAddBuyOperationMutation, useEditBuyOperationMutation, useRemoveBuyOperationMutation } = buyOperationsApi;
export const { endpoints: {
    addBuyOperation,
    editBuyOperation,
    getAllBuyOperations,
    getBuyOperation,
    removeBuyOperation
} } = buyOperationsApi;