import { api } from './api';
import { PackedOperation } from '../../types';


export const packedOperationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPackedOperations: builder.query<PackedOperation[], void>({
            query: () => ({
                url: '/packed-operation',
                method: 'GET'
            })
        }),
        getPackedOperation: builder.query<PackedOperation, string>({
            query: (id) => ({
                url: `/packed-operation/${id}`,
                method: 'GET'
            })
        }),
        editPackedOperation: builder.mutation<string, PackedOperation>({
            query: (packedOperation) => ({
                url: `/packed-operation/edit/${packedOperation._id}`,
                method: 'PUT',
                body: packedOperation
            }),
        }),
        removePackedOperation: builder.mutation<string, string>({
            query: (id) => ({
                url: `/packed-operation/remove/${id}`,
                method: 'POST',
                body: { id }
            })
        }),
        addPackedOperation: builder.mutation<PackedOperation, PackedOperation>({
            query: (packedOperation) => ({
                url: '/packed-operation/add',
                method: 'POST',
                body: packedOperation
            })
        }),
    })
});

export const { useAddPackedOperationMutation, useEditPackedOperationMutation, useGetAllPackedOperationsQuery, useGetPackedOperationQuery, useRemovePackedOperationMutation } = packedOperationsApi;
export const { endpoints: {
    addPackedOperation,
    editPackedOperation,
    getAllPackedOperations,
    getPackedOperation,
    removePackedOperation
} } = packedOperationsApi;