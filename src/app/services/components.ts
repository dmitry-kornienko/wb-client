import {  Component } from '../../types';
import { api } from './api';


export const componentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllComponents: builder.query<Component[], void>({
            query: () => ({
                url: '/component',
                method: 'GET'
            })
        }),
        getComponent: builder.query<Component, string>({
            query: (id) => ({
                url: `/component/${id}`,
                method: 'GET'
            })
        }),
        editComponent: builder.mutation<string, Component>({
            query: (component) => ({
                url: `/component/edit/${component._id}`,
                method: 'PUT',
                body: component
            }),
        }),
        removeComponent: builder.mutation<string, string>({
            query: (id) => ({
                url: `/component/remove/${id}`,
                method: 'POST',
                body: { id }
            })
        }),
        addComponent: builder.mutation<Component, Component>({
            query: (component) => ({
                url: '/component/add',
                method: 'POST',
                body: component
            })
        }),
    })
});

export const { useGetAllComponentsQuery, useGetComponentQuery, useAddComponentMutation, useEditComponentMutation, useRemoveComponentMutation } = componentsApi;
export const { endpoints: {
    addComponent,
    editComponent,
    getAllComponents,
    getComponent,
    removeComponent
} } = componentsApi