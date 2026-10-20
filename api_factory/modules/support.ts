import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/** Safety and support. */

export interface ReportPayload {
  targetType: 'item' | 'user' | 'business';
  targetId: string;
  targetLabel?: string;
  reason: string;
  details: string;
}

export const supportApi = {
  report: (payload: ReportPayload) => GATEWAY_ENDPOINT_WITH_AUTH.post('/support/reports', payload),
  myReports: () => GATEWAY_ENDPOINT_WITH_AUTH.get('/support/reports/mine'),
  createTicket: (payload: { name: string; email: string; subject: string; message: string }) =>
    GATEWAY_ENDPOINT.post<{ reference: string; status: string }>('/support/tickets', payload),
};
