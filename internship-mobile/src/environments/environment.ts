
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8001'
};

// Initialize mobile theme on app start
import { MobileThemeService } from '../app/shared/design-system';

// Auto-initialize theme service
if (typeof window !== 'undefined') {
  // Theme will be initialized when service is injected
}

