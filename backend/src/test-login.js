"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
function testLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var healthResponse, loginData, loginResponse, error_1, axiosError;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('Iniciando testes...');
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    // Teste da rota de saúde
                    console.log('=== Testando rota de saúde ===');
                    return [4 /*yield*/, axios_1.default.get('http://localhost:3001/health')];
                case 2:
                    healthResponse = _e.sent();
                    console.log('Health check:', healthResponse.data);
                    // Teste de login
                    console.log('=== Iniciando teste de login ===');
                    loginData = {
                        email: 'admin@admin.com',
                        password: 'admin123'
                    };
                    console.log('Enviando requisição...');
                    return [4 /*yield*/, axios_1.default.post('http://localhost:3001/auth/login', loginData)];
                case 3:
                    loginResponse = _e.sent();
                    console.log('=== Resposta recebida ===');
                    console.log('Status:', loginResponse.status);
                    console.log('Headers:', loginResponse.headers);
                    console.log('Dados:', loginResponse.data);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _e.sent();
                    console.error('=== Erro durante os testes ===');
                    if (axios_1.default.isAxiosError(error_1)) {
                        axiosError = error_1;
                        console.error('Status:', (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status);
                        console.error('Status Text:', (_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.statusText);
                        console.error('Headers:', (_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.headers);
                        console.error('Data:', (_d = axiosError.response) === null || _d === void 0 ? void 0 : _d.data);
                        console.error('Config:', axiosError.config);
                    }
                    else {
                        console.error('Erro não relacionado ao Axios:', error_1);
                    }
                    return [3 /*break*/, 5];
                case 5:
                    console.log('Testes finalizados.');
                    return [2 /*return*/];
            }
        });
    });
}
testLogin();
