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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("./entities/roles.decorator");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RolesGuard = class RolesGuard {
    constructor(userModel, reflector, jwtService) {
        this.userModel = userModel;
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        var _a;
        try {
            const checkDb = await this.userModel.find();
            if (checkDb.length == 0)
                return true;
            let formatError = {};
            const request = context.switchToHttp().getRequest();
            request.myData = request.user.payload;
            const verifyUser = request.user.payload;
            const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
            if (!requiredRoles) {
                return true;
            }
            if (!verifyUser || !((_a = verifyUser.role) === null || _a === void 0 ? void 0 : _a.includes('admin'))) {
                formatError = {
                    statusCode: common_2.HttpStatus.BAD_REQUEST,
                    message: 'Only Access to Admin , If your Admin Please Login ',
                    result: [],
                    error: 'UNAUTHORIZED',
                };
                throw new common_1.HttpException(formatError, common_2.HttpStatus.UNAUTHORIZED);
            }
            return requiredRoles.some((role) => { var _a; return (_a = verifyUser.role) === null || _a === void 0 ? void 0 : _a.includes(role); });
        }
        catch (error) {
            throw new common_1.HttpException(error.response, error.status);
        }
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        core_1.Reflector,
        jwt_1.JwtService])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map