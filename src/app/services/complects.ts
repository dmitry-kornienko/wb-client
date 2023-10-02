import {  Complect } from '../../types';
import { api } from './api';
import { FullComplect } from '../../types';


export const complectsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllComplects: builder.query<FullComplect[], void>({
            query: () => ({
                url: '/complect',
                method: 'GET'
            })
        }),
        getComplect: builder.query<Complect, string>({
            query: (id) => ({
                url: `/complect/${id}`,
                method: 'GET'
            })
        }),
        editComplect: builder.mutation<string, Complect>({
            query: (complcet) => ({
                url: `/complect/edit/${complcet._id}`,
                method: 'PUT',
                body: complcet
            }),
        }),
        removeComplect: builder.mutation<string, string>({
            query: (id) => ({
                url: `/complect/remove/${id}`,
                method: 'POST',
                body: { id }
            })
        }),
        addComplect: builder.mutation<Complect, Complect>({
            query: (complect) => ({
                url: '/complect/add',
                method: 'POST',
                body: complect
            })
        }),
    })
});

export const { useAddComplectMutation, useEditComplectMutation, useRemoveComplectMutation, useGetAllComplectsQuery, useGetComplectQuery } = complectsApi;
export const { endpoints: {
    addComplect,
    editComplect,
    removeComplect,
    getAllComplects,
    getComplect
} } = complectsApi;