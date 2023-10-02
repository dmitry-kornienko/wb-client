import { api } from './api';
import { SendOperation } from '../../types';

export const sendOperationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllSendOperations: builder.query<SendOperation[], void>({
            query: () => ({
                url: '/send-operation',
                method: 'GET'
            })
        }),
        getSendOperation: builder.query<SendOperation, string>({
            query: (id) => ({
                url: `/send-operation/${id}`,
                method: 'GET'
            })
        }),
        editSendOperation: builder.mutation<string, SendOperation>({
            query: (sendOperation) => ({
                url: `/send-operation/edit/${sendOperation._id}`,
                method: 'PUT',
                body: sendOperation
            }),
        }),
        removeSendOperation: builder.mutation<string, string>({
            query: (id) => ({
                url: `/send-operation/remove/${id}`,
                method: 'POST',
                body: { id }
            })
        }),
        addSendOperation: builder.mutation<SendOperation, SendOperation>({
            query: (sendOperation) => ({
                url: '/send-operation/add',
                method: 'POST',
                body: sendOperation
            })
        }),
    })
});

export const { useAddSendOperationMutation, useEditSendOperationMutation, useGetAllSendOperationsQuery, useGetSendOperationQuery, useRemoveSendOperationMutation } = sendOperationsApi;
export const { endpoints: {
    addSendOperation,
    editSendOperation,
    getAllSendOperations,
    getSendOperation,
    removeSendOperation
} } = sendOperationsApi;