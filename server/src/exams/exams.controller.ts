import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { CreateExamDto } from './dtos/create-exam.dto';
import { CreateQuestionBankCategoryDto } from './dtos/create-question-bank-category.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { GetExamsDto } from './dtos/get-exams.dto';
import { GetQuestionBankCategoriesDto } from './dtos/get-question-bank-categories.dto';
import { GetQuestionsDto } from './dtos/get-questions.dto';
import { ReplaceExamQuestionRulesDto } from './dtos/replace-exam-question-rules.dto';
import { SubmitExamAttemptDto } from './dtos/submit-exam-attempt.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { UpdateQuestionBankCategoryDto } from './dtos/update-question-bank-category.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { ExamsService } from './providers/exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get('question-bank/categories')
  findCategories(@Query() query: GetQuestionBankCategoriesDto) {
    return this.examsService.findCategories(query);
  }

  @Post('question-bank/categories')
  createCategory(
    @Body() dto: CreateQuestionBankCategoryDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.examsService.createCategory(dto, user?.sub);
  }

  @Patch('question-bank/categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionBankCategoryDto,
  ) {
    return this.examsService.updateCategory(id, dto);
  }

  @Delete('question-bank/categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.deleteCategory(id);
  }

  @Get('question-bank/questions')
  findQuestions(@Query() query: GetQuestionsDto) {
    return this.examsService.findQuestions(query);
  }

  @Post('question-bank/questions')
  createQuestion(
    @Body() dto: CreateQuestionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.examsService.createQuestion(dto, user?.sub);
  }

  @Patch('question-bank/questions/:id')
  updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.examsService.updateQuestion(id, dto, user?.sub);
  }

  @Delete('question-bank/questions/:id')
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.deleteQuestion(id);
  }

  @Get()
  findExams(@Query() query: GetExamsDto) {
    return this.examsService.findExams(query);
  }

  @Get('course/:courseId/learner')
  getCourseExamForLearner(
    @Param('courseId', ParseIntPipe) courseId: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.examsService.getCourseExamForLearner(courseId, user.sub);
  }

  @Post('course/:courseId/attempts/start')
  startCourseExamAttempt(
    @Param('courseId', ParseIntPipe) courseId: number,
    @ActiveUser() user: ActiveUserData,
    @Req() request: Request,
  ) {
    return this.examsService.startCourseExamAttempt(
      courseId,
      user.sub,
      request.ip,
      request.headers['user-agent'],
    );
  }

  @Post('attempts/:attemptId/submit')
  submitExamAttempt(
    @Param('attemptId', ParseIntPipe) attemptId: number,
    @ActiveUser() user: ActiveUserData,
    @Body() dto: SubmitExamAttemptDto,
  ) {
    return this.examsService.submitExamAttempt(attemptId, user.sub, dto);
  }

  @Get(':id')
  findExamById(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.findExamById(id);
  }

  @Post()
  createExam(@Body() dto: CreateExamDto, @ActiveUser() user: ActiveUserData) {
    return this.examsService.createExam(dto, user?.sub);
  }

  @Patch(':id')
  updateExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExamDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.examsService.updateExam(id, dto, user?.sub);
  }

  @Patch(':id/question-rules')
  replaceQuestionRules(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceExamQuestionRulesDto,
  ) {
    return this.examsService.replaceQuestionRules(id, dto);
  }

  @Delete(':id')
  deleteExam(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.deleteExam(id);
  }
}
