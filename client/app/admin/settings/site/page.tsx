import { SiteSettingsDashboard } from "@/components/admin/settings/site-settings-dashboard";
import { settingsServerService } from "@/services/settings/settings.server";
import {
  AwsStorageSettings,
  EmailSettings,
  PaymentGatewayAdmin,
  SiteSettings,
  SocialAuthProvider,
} from "@/types/settings";

const SiteSettingsPage = async () => {
  let gateways: PaymentGatewayAdmin[] = [];
  let siteSettings: SiteSettings | null = null;
  let emailSettings: EmailSettings | null = null;
  let awsStorageSettings: AwsStorageSettings | null = null;
  let socialProviders: SocialAuthProvider[] = [];

  try {
    const [
      gatewaysResponse,
      siteResponse,
      emailResponse,
      awsResponse,
      socialResponse,
    ] =
      await Promise.all([
        settingsServerService.getGateways(),
        settingsServerService.getSiteSettings(),
        settingsServerService.getEmailSettings(),
        settingsServerService.getAwsStorageSettings(),
        settingsServerService.getSocialAuthSettings(),
      ]);

    gateways = gatewaysResponse.data;
    siteSettings = siteResponse.data;
    emailSettings = emailResponse.data;
    awsStorageSettings = awsResponse.data;
    socialProviders = socialResponse.data.providers || [];
  } catch {
    gateways = [];
  }

  return (
    <SiteSettingsDashboard
      gateways={gateways}
      siteSettings={siteSettings}
      emailSettings={emailSettings}
      awsStorageSettings={awsStorageSettings}
      socialProviders={socialProviders}
    />
  );
};

export default SiteSettingsPage;
