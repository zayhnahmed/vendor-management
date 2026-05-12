import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const API_URL = environment.apiBaseURL;

  // Ignore absolute URLs (like assets)
  if (req.url.startsWith('http')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `${API_URL}${req.url}`,
  });

  return next(apiReq);
};
