"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const employee_dto_1 = require("./dto/employee.dto");
const forgot_dto_1 = require("./dto/forgot.dto");
const login_dto_1 = require("./dto/login.dto");
const reset_dto_1 = require("./dto/reset.dto");
const update_dto_1 = require("./dto/update.dto");
const user_dto_1 = require("./dto/user.dto");
const roles_decorator_1 = require("./entities/roles.decorator");
const user_schema_1 = require("./user.schema");
const user_service_1 = require("./user.service");
const leave_dto_1 = require("./dto/leave.dto");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("./dto/pagination.dto");
const roles_guard_1 = require("./roles.guard");
const jwt_guard_1 = require("./guards/jwt-guard");
const mailer_1 = require("@nestjs-modules/mailer");
let UserController = class UserController {
    constructor(userService, mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }
    get(res) {
        res.sendFile('user.html', {
            root: './src/user/html',
        });
    }
    reset(res) {
        res.sendFile('resetPage.html', {
            root: './src/user/html',
        });
    }
    async checkDb() {
        try {
            return await this.userService.checkDb();
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async signup(res, userDto) {
        res.status(common_1.HttpStatus.CREATED).json({
            statusCode: common_1.HttpStatus.CREATED,
            message: `Successfully Registered and Confirmation mail send to ${userDto.email}`,
            result: await this.userService.signup(userDto),
            error: 'No Error',
            mailConfirmation: await this.mailService.sendMail({
                to: userDto.email,
                from: 'ymlbeginners@gmail.com',
                subject: 'Registration Successful for YML',
                text: `Dear ${userDto.name} ,
          \nWelcome to YML ,
          \nAdmin Registered you as ${userDto.role} in YML,
          \nLogin Details:-
          \nemail:${userDto.email}
          \npassword:${userDto.password}
          \nBelow link to access Appsmith Main Page
          \nhttp://localhost:3000/users/main-page
          \nThis is an auto-generated mail. Please do not reply.`,
            }),
        });
    }
    async signin(req, res, userDto) {
        res.status(common_1.HttpStatus.OK).json({
            statusCode: common_1.HttpStatus.OK,
            message: 'Signed in Succesfully',
            result: [await this.userService.signin(req, userDto, res)],
            error: 'No Error',
        });
    }
    async signout(req, res) {
        return this.userService.signout(req, res);
    }
    async getEmployee(req, { userId, limit, skip }) {
        console.log('controller', req.myData);
        const result = await this.userService.getEmployee(req, userId, limit, skip);
        if (!result) {
            throw new common_1.NotFoundException(`results not found`);
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'employee Details',
            result: result,
            error: 'No Error',
        };
    }
    async updateEmployee(req, res, userId, userDto) {
        res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: `Employee ${userId} updated`,
            result: await this.userService.updateEmployee(req, res, userId, userDto),
            error: 'No Error',
        });
    }
    async updateOwnInfo(req, res, employeeDto) {
        res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: `Employee  updated`,
            result: await this.userService.updateOwnInfo(req, res, employeeDto),
            error: 'No Error',
        });
    }
    async forgotPassword(forgotDto) {
        const result = await this.userService.forgotPassword(forgotDto);
        if (result === true) {
            return this.mailService.sendMail({
                to: forgotDto.email,
                from: 'ymlbeginners@gmail.com',
                subject: 'Reset Password Link',
                text: `Press the link to reset password and page is accessible only once
        \nhttp://localhost:3000/users/reset-password-page`,
            });
        }
    }
    async resetPassword(resetDto, req, res) {
        return this.userService.resetPassword(resetDto, req, res);
    }
    async deactivateEmployee(req, res, userId) {
        res.status(common_1.HttpStatus.OK).json({
            statusCode: common_1.HttpStatus.OK,
            message: 'User Deleted',
            result: await this.userService.deactivateEmployee(userId, req),
            error: 'No Error',
        });
    }
    async activateEmployee(req, res, userId) {
        res.status(common_1.HttpStatus.OK).json({
            statusCode: common_1.HttpStatus.OK,
            message: 'User Activated',
            result: await this.userService.activateEmployee(userId, req),
            error: 'No Error',
        });
    }
    async applyLeave(req, leaveDto) {
        return await this.userService.applyLeave(req, leaveDto);
    }
    async viewOwnLeave(req, { limit, skip }) {
        return {
            result: this.userService.viewOwnLeave(req, limit, skip),
        };
    }
    async viewOwnDetails(req, res) {
        return {
            result: this.userService.viewOwnDetails(req, res),
        };
    }
    async viewEmployeePendingLeaveByUserId(req, { userId, status, limit, skip }) {
        if (userId && status) {
            return this.userService.viewEmployeePendingLeave(req, userId, status, limit, skip);
        }
        if (userId) {
            return this.userService.viewEmployeePendingLeaveByUserId(req, userId, limit, skip);
        }
        if (status) {
            return this.userService.viewEmployeePendingLeave(req, userId, status, limit, skip);
        }
        return this.userService.viewEmployeePendingLeaveByUserId(req, userId, limit, skip);
    }
    async approveEmployeeLeaves(req, query) {
        return await this.userService.approveEmployeeLeaves(query.userId, query.leaveDate, req);
    }
    async rejectEmployeeLeaves(req, query) {
        return await this.userService.rejectEmployeeLeaves(query.userId, query.leaveDate, req);
    }
};
__decorate([
    (0, common_1.Get)('main-page'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('reset-password-page'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "reset", null);
__decorate([
    (0, common_1.Get)('check-db-collection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkDb", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new Employee' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User Registered Successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Designation Not Found, Valid Designation: ASE,SE,SSE,EM,BD',
    }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Email already taken' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Employee Login' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User Logged in' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'You are already signed In' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Employee Not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Incorrect Password' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, login_dto_1.loginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    (0, common_1.Delete)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Employee Logout' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User logged out successfully' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'You are already signed out' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signout", null);
__decorate([
    (0, common_1.Get)('employee'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({
        summary: 'Getting all employee details or Individual employee detail (Admin Access)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'All the employee details listed below' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Patch)('employee/:userId'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({
        summary: 'Update employee details {userId,salary,designation} (Admin Access)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Employee Details Updated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Designation Not Found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('userId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, update_dto_1.UpdateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Patch)('employee-user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update employee details {name,email,address,phonenumber} (User Access)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Employee Details Updated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Invalid User Email' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, employee_dto_1.EmployeeDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateOwnInfo", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Forgot Password (For getting reset password link Input {email})',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Email does not exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_dto_1.forgotDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Put)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset Password (For changing password Input {email, password})',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_dto_1.resetDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)('delete-user/:userId'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({
        summary: 'Disable/Soft Delete a particular employee (Admin Access)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'User Disabled' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User is already disabled' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deactivateEmployee", null);
__decorate([
    (0, common_1.Patch)('activate-user/:userId'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({
        summary: 'Enable/Activate a particular employee (Admin Access)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'User Activated' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'User Account is already active' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateEmployee", null);
__decorate([
    (0, common_1.Post)('apply-leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply Leave Input {leaveDate:YYYY-MM-DD}' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Leave applied successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'leaveDate must be in the format yyyy-mm-dd',
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: 'Cannot apply leave for older dates or No leaves available',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, leave_dto_1.leaveDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "applyLeave", null);
__decorate([
    (0, common_1.Get)('check-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Employee fetching there own leave status' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Own Leaves' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Invalid User' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "viewOwnLeave", null);
__decorate([
    (0, common_1.Get)('check-own-details'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Employee fetching there own details' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Details' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Invalid User' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "viewOwnDetails", null);
__decorate([
    (0, common_1.Get)('view-leaves'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({
        summary: 'Fetching all the pending leaves by User ID (Admin Access)',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Pending Leaves' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No pending leaves or Invalid user Id' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "viewEmployeePendingLeaveByUserId", null);
__decorate([
    (0, common_1.Patch)('approve-leaves'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Approving pending leaves (Admin access)' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Leave Approved' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "approveEmployeeLeaves", null);
__decorate([
    (0, common_1.Patch)('reject-leaves'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Rejecting pending leaves (Admin access)' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Leave Rejected' }),
    (0, swagger_1.ApiGoneResponse)({ description: 'Link Expired' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Server Error' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "rejectEmployeeLeaves", null);
UserController = __decorate([
    (0, common_1.UseInterceptors)(common_1.CacheInterceptor),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mailer_1.MailerService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map