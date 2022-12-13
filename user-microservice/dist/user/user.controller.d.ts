import { HttpStatus } from '@nestjs/common';
import { EmployeeDto } from './dto/employee.dto';
import { forgotDto } from './dto/forgot.dto';
import { loginDto } from './dto/login.dto';
import { resetDto } from './dto/reset.dto';
import { UpdateDto } from './dto/update.dto';
import { UserDto } from './dto/user.dto';
import { user } from './user.schema';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { leaveDto } from './dto/leave.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MailerService } from '@nestjs-modules/mailer';
export declare class UserController {
    private userService;
    private mailService;
    constructor(userService: UserService, mailService: MailerService);
    checkDb(): Promise<{
        total: number;
    }>;
    signup(res: any, userDto: UserDto): Promise<void>;
    signin(req: any, res: any, userDto: loginDto): Promise<void>;
    signout(req: any, res: any): Promise<void>;
    getEmployee(req: any, { userId, limit, skip }: PaginationDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        result: user | user[];
        error: string;
    }>;
    updateEmployee(req: any, res: any, userId: string, userDto: UpdateDto): Promise<void>;
    updateOwnInfo(req: any, res: any, employeeDto: EmployeeDto): Promise<void>;
    forgotPassword(forgotDto: forgotDto): Promise<any>;
    resetPassword(resetDto: resetDto, req: Request, res: Response): Promise<void>;
    deactivateEmployee(req: any, res: any, userId: string): Promise<void>;
    activateEmployee(req: any, res: any, userId: string): Promise<void>;
    applyLeave(req: any, leaveDto: leaveDto): Promise<any>;
    viewOwnLeave(req: any, { limit, skip }: PaginationDto): Promise<{
        result: Promise<any>;
    }>;
    viewOwnDetails(req: any, res: any): Promise<{
        result: Promise<void>;
    }>;
    viewEmployeePendingLeaveByUserId(req: any, { userId, status, limit, skip }: PaginationDto): Promise<any>;
    approveEmployeeLeaves(req: any, query: {
        leaveDate: string;
        userId: string;
    }): Promise<any>;
    rejectEmployeeLeaves(req: any, query: {
        leaveDate: string;
        userId: string;
    }): Promise<any>;
}
