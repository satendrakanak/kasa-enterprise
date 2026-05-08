import { SiteSettingsDashboard } from "@/components/admin/settings/site-settings-dashboard";
import { settingsServerService } from "@/services/settings/settings.server";
import {
  AwsStorageSettings,
  BbbSettings,
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
  let bbbSettings: BbbSettings | null = null;
  let socialProviders: SocialAuthProvider[] = [];

  try {
    const [
      gatewaysResponse,
      siteResponse,
      emailResponse,
      awsResponse,
      bbbResponse,
      socialResponse,
    ] =
      await Promise.all([
        settingsServerService.getGateways(),
        settingsServerService.getSiteSettings(),
        settingsServerService.getEmailSettings(),
        settingsServerService.getAwsStorageSettings(),
        settingsServerService.getBbbSettings(),
        settingsServerService.getSocialAuthSettings(),
      ]);

    gateways = gatewaysResponse.data;
    siteSettings = siteResponse.data;
    emailSettings = emailResponse.data;
    awsStorageSettings = awsResponse.data;
    bbbSettings = bbbResponse.data;
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
      bbbSettings={bbbSettings}
      socialProviders={socialProviders}
    />
  );
};

export default SiteSettingsPage;
