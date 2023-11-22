import {  Report } from '../../types';
import { api } from './api';


export const reportsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllReports: builder.query<Report[], void>({
            query: () => ({
                url: '/report',
                method: 'GET'
            })
        }),
        getReport: builder.query<Report, string>({
            query: (id) => ({
                url: `/report/${id}`,
                method: 'GET'
            })
        }),
        editReport: builder.mutation<string, {id: string, storage: number, taking_payment: number, other_deductions: number, business_costs: number}>({
            query: ({id, storage, taking_payment, other_deductions, business_costs}) => ({
                url: `/report/edit/${id}`,
                method: 'PATCH',
                body: {id, storage, taking_payment, other_deductions, business_costs}
            }),
        }),
        removeReport: builder.mutation<string, string>({
            query: (id) => ({
                url: `/report/remove/${id}`,
                method: 'POST',
                body: { id }
            })
        }),
        addReport: builder.mutation<Report, {dateFrom: string, dateTo: string, tokenWB: string}>({
            query: (reportData) => ({
                url: '/report/add',
                method: 'POST',
                body: reportData
            })
        }),
    })
});

export const { useAddReportMutation, useEditReportMutation, useGetAllReportsQuery, useGetReportQuery, useRemoveReportMutation } = reportsApi;
export const { endpoints: {
    addReport,
    editReport,
    getAllReports,
    getReport,
    removeReport
} } = reportsApi