import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { FacultyWorkspaceService } from './providers/faculty-workspace.service';

@Controller('class-sessions')
export class ClassSessionsController {
  constructor(
    private readonly facultyWorkspaceService: FacultyWorkspaceService,
  ) {}

  @Get('my')
  getMySessions(@ActiveUser() user: ActiveUserData) {
    return this.facultyWorkspaceService.getLearnerSessions(user);
  }
}
