import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { runtimeDatabaseConfigPath } from 'src/config/runtime-database.config';
import { seedEmailTemplates } from 'src/database/seeds/email-template.seed';
import { seedLocation } from 'src/database/seeds/location.seed';
import { seedPermissions } from 'src/database/seeds/permission.seed';
import { seedProductionDemoContent } from 'src/database/seeds/production-demo-content.seed';
import { seedRoles } from 'src/database/seeds/role.seed';
import { Role } from 'src/roles-permissions/role.entity';
import { AppSetting } from 'src/settings/app-setting.entity';
import { SettingsService } from 'src/settings/providers/settings.service';
import { User } from 'src/users/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CompleteInstallationDto } from './dtos/complete-installation.dto';
import { DatabaseSetupDto } from './dtos/database-setup.dto';

const INSTALLATION_STATUS_KEY = 'installation_status';
const LICENSE_SETTINGS_KEY = 'license_settings';
const DEV_LICENSE_KEY = 'KASA-DEMO-LICENSE-2026';

type InstallationJobStatus = 'queued' | 'running' | 'completed' | 'failed';

type InstallationJob = {
  id: string;
  status: InstallationJobStatus;
  progress: number;
  label: string;
  error: string | null;
  redirectTo: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class InstallerService {
  private readonly installationJobs = new Map<string, InstallationJob>();

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly settingsService: SettingsService,

    @InjectRepository(AppSetting)
    private readonly appSettingRepository: Repository<AppSetting>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getStatus() {
    const installation = await this.getInstallationRecord();
    const adminCount = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.roles', 'role', 'role.name = :role', { role: 'admin' })
      .getCount()
      .catch(() => 0);

    const explicitInstalled = Boolean(installation?.valueJson?.isInstalled);
    const isInstalled = explicitInstalled || adminCount > 0;

    return {
      isInstalled,
      installedAt: installation?.valueJson?.installedAt || null,
      hasAdmin: adminCount > 0,
      licenseRequired: true,
      canUseDevLicense:
        this.configService.get<string>('NODE_ENV') !== 'production' &&
        !this.getConfiguredLicenseHash(),
      database: {
        mode: this.configService.get<string>('database.source') || 'bundled',
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        name: this.configService.get<string>('database.name'),
        user: this.configService.get<string>('database.user'),
        ssl: Boolean(this.configService.get<boolean>('database.ssl')),
        runtimeConfigPath: runtimeDatabaseConfigPath,
        connected: this.dataSource.isInitialized,
      },
    };
  }

  async testDatabaseConnection(payload: DatabaseSetupDto) {
    const connectionPayload = this.normalizeDatabasePayload(payload);
    const probe = new DataSource({
      type: 'postgres',
      host: connectionPayload.host,
      port: Number(connectionPayload.port || 5432),
      username: connectionPayload.user,
      password:
        connectionPayload.password ||
        this.getActiveDatabasePassword(connectionPayload),
      database: connectionPayload.name,
      ssl: connectionPayload.ssl
        ? { rejectUnauthorized: connectionPayload.rejectUnauthorized !== false }
        : false,
    });

    try {
      await probe.initialize();
      await probe.query('select 1');
      return {
        connected: true,
        host: connectionPayload.host,
        message:
          connectionPayload.host !== payload.host
            ? `Database connection verified through ${connectionPayload.host}`
            : 'Database connection verified',
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? `Database connection failed: ${error.message}`
          : 'Database connection failed',
      );
    } finally {
      if (probe.isInitialized) {
        await probe.destroy();
      }
    }
  }

  async saveDatabaseConfiguration(payload: DatabaseSetupDto) {
    if (payload.mode === 'bundled') {
      this.ensureRuntimeConfigDirectory();
      fs.writeFileSync(
        runtimeDatabaseConfigPath,
        `${JSON.stringify({ mode: 'bundled' }, null, 2)}\n`,
      );
      return {
        saved: true,
        restartRequired:
          this.configService.get<string>('database.source') !== 'bundled',
        message: 'Bundled database selected',
      };
    }

    const connectionPayload = this.normalizeDatabasePayload(payload);

    if (!connectionPayload.password) {
      throw new BadRequestException('Database password is required');
    }

    await this.testDatabaseConnection(connectionPayload);
    this.ensureRuntimeConfigDirectory();
    fs.writeFileSync(
      runtimeDatabaseConfigPath,
      `${JSON.stringify(
        {
          mode: 'external',
          host: connectionPayload.host,
          port: Number(connectionPayload.port || 5432),
          name: connectionPayload.name,
          user: connectionPayload.user,
          password: connectionPayload.password,
          ssl: Boolean(connectionPayload.ssl),
          rejectUnauthorized: connectionPayload.rejectUnauthorized !== false,
        },
        null,
        2,
      )}\n`,
    );

    return {
      saved: true,
      restartRequired: true,
      host: connectionPayload.host,
      message:
        'External database verified and saved. Restart the stack, then continue installation.',
    };
  }

  async validateLicense(licenseKey: string) {
    this.assertLicense(licenseKey);

    return {
      valid: true,
      fingerprint: this.hashLicense(licenseKey).slice(0, 12).toUpperCase(),
    };
  }

  async completeInstallation(payload: CompleteInstallationDto) {
    const status = await this.getStatus();

    if (status.isInstalled) {
      throw new ConflictException('Installation is already completed');
    }

    this.assertLicense(payload.licenseKey);

    await this.runInstallationSteps(payload);

    return {
      isInstalled: true,
      redirectTo: '/auth/sign-in',
    };
  }

  async startInstallation(payload: CompleteInstallationDto) {
    const status = await this.getStatus();

    if (status.isInstalled) {
      throw new ConflictException('Installation is already completed');
    }

    this.assertLicense(payload.licenseKey);

    const jobId = randomUUID();
    this.updateJob(jobId, {
      status: 'queued',
      progress: 1,
      label: 'Installation queued...',
      error: null,
      redirectTo: null,
      createdAt: new Date().toISOString(),
    });

    void this.runInstallationJob(jobId, payload);

    return {
      jobId,
    };
  }

  getInstallationProgress(jobId: string) {
    const job = this.installationJobs.get(jobId);

    if (!job) {
      throw new NotFoundException('Installation job not found');
    }

    return job;
  }

  private async runInstallationJob(jobId: string, payload: CompleteInstallationDto) {
    try {
      await this.runInstallationSteps(payload, (progress, label) =>
        this.updateJob(jobId, {
          status: 'running',
          progress,
          label,
        }),
      );
      this.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        label: 'Installation completed. Redirecting...',
        redirectTo: '/auth/sign-in',
      });
    } catch (error) {
      this.updateJob(jobId, {
        status: 'failed',
        progress: 100,
        label: 'Installation failed',
        error:
          error instanceof Error
            ? error.message
            : 'Installation could not be completed',
      });
    }
  }

  private async runInstallationSteps(
    payload: CompleteInstallationDto,
    onProgress?: (progress: number, label: string) => void,
  ) {
    onProgress?.(5, 'Preparing permissions...');
    this.assertDatabaseSelection(payload);
    await seedPermissions(this.dataSource);
    onProgress?.(14, 'Preparing roles...');
    await seedRoles(this.dataSource);
    onProgress?.(24, 'Preparing email templates...');
    await seedEmailTemplates(this.dataSource);
    onProgress?.(34, 'Importing countries, states, and cities...');
    await seedLocation(this.dataSource);
    onProgress?.(48, 'Creating the first admin account...');
    await this.createAdminUser(payload);
    onProgress?.(60, 'Saving academy settings...');
    await this.settingsService.upsertSiteSettings({
      siteName: payload.siteName,
      siteTagline:
        payload.siteTagline ||
        'Practical courses, live classes, and certificates in one platform.',
      siteDescription:
        'Practical courses, live classes, learner dashboards, faculty tools, certificates, and engagement workflows.',
      supportEmail: payload.supportEmail || payload.adminEmail,
      supportPhone: payload.supportPhone,
      footerCopyright: `© ${new Date().getFullYear()} ${payload.siteName}. All Rights Reserved`,
    });

    if (payload.importDemoData) {
      onProgress?.(70, 'Importing marketplace demo data...');
      await seedProductionDemoContent(this.dataSource);
    } else {
      onProgress?.(82, 'Skipping demo data import...');
    }

    onProgress?.(88, 'Activating license...');
    await this.saveSetting(LICENSE_SETTINGS_KEY, {
      licenseHash: this.hashLicense(payload.licenseKey),
      activatedAt: new Date().toISOString(),
      fingerprint: this.hashLicense(payload.licenseKey).slice(0, 12).toUpperCase(),
    });
    onProgress?.(95, 'Finalizing installation...');
    await this.saveSetting(INSTALLATION_STATUS_KEY, {
      isInstalled: true,
      installedAt: new Date().toISOString(),
      version: this.configService.get<string>('appConfig.apiVersion') || '0.1.1',
      demoDataImported: Boolean(payload.importDemoData),
    });
  }

  private assertDatabaseSelection(payload: CompleteInstallationDto) {
    if (!payload.database) return;

    const activeDatabase = {
      host: String(this.configService.get<string>('database.host') || ''),
      port: Number(this.configService.get<number>('database.port') || 5432),
      name: String(this.configService.get<string>('database.name') || ''),
      user: String(this.configService.get<string>('database.user') || ''),
    };

    const requestedDatabase = {
      host: String(payload.database.host || ''),
      port: Number(payload.database.port || 5432),
      name: String(payload.database.name || ''),
      user: String(payload.database.user || ''),
    };

    const matchesActiveConnection =
      activeDatabase.host === requestedDatabase.host &&
      activeDatabase.port === requestedDatabase.port &&
      activeDatabase.name === requestedDatabase.name &&
      activeDatabase.user === requestedDatabase.user;

    if (!matchesActiveConnection) {
      throw new BadRequestException(
        'Database details do not match the running application connection. Update the Docker/env database values, restart the stack, and run the installer again.',
      );
    }
  }

  private getActiveDatabasePassword(payload: DatabaseSetupDto) {
    const activeDatabase = {
      host: String(this.configService.get<string>('database.host') || ''),
      port: Number(this.configService.get<number>('database.port') || 5432),
      name: String(this.configService.get<string>('database.name') || ''),
      user: String(this.configService.get<string>('database.user') || ''),
    };

    if (
      payload.mode === 'bundled' &&
      payload.host === activeDatabase.host &&
      Number(payload.port) === activeDatabase.port &&
      payload.name === activeDatabase.name &&
      payload.user === activeDatabase.user
    ) {
      return String(this.configService.get<string>('database.password') || '');
    }

    return '';
  }

  private normalizeDatabasePayload(payload: DatabaseSetupDto): DatabaseSetupDto {
    if (payload.mode !== 'external') {
      return payload;
    }

    const host = payload.host?.trim();
    const isLocalHost =
      host === 'localhost' || host === '127.0.0.1' || host === '::1';

    if (!isLocalHost || !this.isRunningInsideDocker()) {
      return {
        ...payload,
        host,
      };
    }

    return {
      ...payload,
      host: 'host.docker.internal',
    };
  }

  private isRunningInsideDocker() {
    return fs.existsSync('/.dockerenv') || process.env.KASA_DOCKER === 'true';
  }

  private ensureRuntimeConfigDirectory() {
    fs.mkdirSync(path.dirname(runtimeDatabaseConfigPath), { recursive: true });
  }

  private async createAdminUser(payload: CompleteInstallationDto) {
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'admin' },
      relations: { permissions: true },
    });

    if (!adminRole) {
      throw new ServiceUnavailableException('Admin role could not be prepared');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: payload.adminEmail.toLowerCase() },
      relations: { roles: true },
    });
    const password = await bcrypt.hash(payload.adminPassword, 10);
    const usernameBase = payload.adminEmail
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    if (existingUser) {
      existingUser.firstName = payload.adminFirstName;
      existingUser.lastName = payload.adminLastName;
      existingUser.username = existingUser.username || usernameBase;
      existingUser.password = password;
      existingUser.emailVerified = existingUser.emailVerified || new Date();
      existingUser.roles = [adminRole];
      await this.userRepository.save(existingUser);
      return;
    }

    await this.userRepository.save(
      this.userRepository.create({
        firstName: payload.adminFirstName,
        lastName: payload.adminLastName,
        username: await this.getAvailableUsername(usernameBase),
        email: payload.adminEmail.toLowerCase(),
        password,
        emailVerified: new Date(),
        roles: [adminRole],
      }),
    );
  }

  private assertLicense(licenseKey: string) {
    const normalizedKey = licenseKey.trim();
    const configuredHash = this.getConfiguredLicenseHash();
    const hash = this.hashLicense(normalizedKey);

    if (configuredHash) {
      if (hash !== configuredHash) {
        throw new BadRequestException('Invalid license key');
      }

      return;
    }

    if (
      this.configService.get<string>('NODE_ENV') !== 'production' &&
      normalizedKey === DEV_LICENSE_KEY
    ) {
      return;
    }

    throw new ServiceUnavailableException(
      'License validation is not configured. Set INSTALLER_LICENSE_HASH before installation.',
    );
  }

  private hashLicense(licenseKey: string) {
    return createHash('sha256').update(licenseKey.trim()).digest('hex');
  }

  private getConfiguredLicenseHash() {
    return this.configService.get<string>('INSTALLER_LICENSE_HASH')?.trim();
  }

  private getInstallationRecord() {
    return this.appSettingRepository.findOne({
      where: { key: INSTALLATION_STATUS_KEY },
    });
  }

  private async getAvailableUsername(baseUsername: string) {
    const normalizedBase = baseUsername || 'admin';
    let candidate = normalizedBase;
    let suffix = 1;

    while (await this.userRepository.exists({ where: { username: candidate } })) {
      suffix += 1;
      candidate = `${normalizedBase}-${suffix}`;
    }

    return candidate;
  }

  private async saveSetting(key: string, valueJson: Record<string, unknown>) {
    const existing = await this.appSettingRepository.findOne({ where: { key } });
    const setting =
      existing ||
      this.appSettingRepository.create({
        key,
      });

    setting.valueJson = valueJson;
    setting.valueEnc = null;
    setting.isEncrypted = false;

    await this.appSettingRepository.save(setting);
  }

  private updateJob(
    jobId: string,
    patch: Partial<Omit<InstallationJob, 'id' | 'updatedAt'>>,
  ) {
    const existing = this.installationJobs.get(jobId);
    const now = new Date().toISOString();
    const next: InstallationJob = {
      id: jobId,
      status: existing?.status || 'queued',
      progress: existing?.progress || 0,
      label: existing?.label || 'Preparing installation...',
      error: existing?.error || null,
      redirectTo: existing?.redirectTo || null,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      ...patch,
    };

    this.installationJobs.set(jobId, next);
  }
}
