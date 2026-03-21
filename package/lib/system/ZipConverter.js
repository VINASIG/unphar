System.register(["./phar/Archive", "./phar/File", "./Utils", "jszip", "./phar/Const"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
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
    var Archive_1, File_1, Utils_1, JSZip, Const_1;
    var __moduleName = context_1 && context_1.id;
    /**
     * Convert Phar to Zip
     * @property {Archive} phar
     * @returns {JSZip} zip data
     */
    function toZip(phar) {
        return __awaiter(this, void 0, void 0, function () {
            var zip, files;
            return __generator(this, function (_a) {
                zip = new JSZip(), files = phar.getFiles();
                files.forEach(function (file) {
                    var date = new Date();
                    date.setTime(file.getTimestamp() * 1000);
                    zip.file(file.getName(), Utils_1.toUint8Array(file.getContents()), {
                        date: date
                    });
                });
                return [2 /*return*/, zip];
            });
        });
    }
    exports_1("toZip", toZip);
    /**
     * Convert Zip to Phar
     * @property {(string|Uint8Array)} data
     * @returns {Archive}
     */
    function toPhar(data, compressionType, password) {
        if (compressionType === void 0) { compressionType = Const_1.Compression.NONE; }
        return __awaiter(this, void 0, void 0, function () {
            var sourceZip, zip, phar, error_1, files_2, _i, files_1, file, _a, _b, _c, _d, _e, error_2;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        sourceZip = new JSZip();
                        phar = new Archive_1.default();
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sourceZip.loadAsync((data instanceof Uint8Array) ? data : Utils_1.toUint8Array(data))];
                    case 2:
                        zip = _f.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _f.sent();
                        throw Error("JSZip creation error: " + error_1);
                    case 4:
                        _f.trys.push([4, 9, , 10]);
                        files_2 = [];
                        zip.forEach(function (path, file) { return files_2.push(file); });
                        _i = 0, files_1 = files_2;
                        _f.label = 5;
                    case 5:
                        if (!(_i < files_1.length)) return [3 /*break*/, 8];
                        file = files_1[_i];
                        _b = (_a = phar).addFile;
                        _c = File_1.default.bind;
                        _d = [void 0, file.name];
                        _e = Utils_1.fromUint8Array;
                        return [4 /*yield*/, file.async('uint8array')];
                    case 6:
                        _b.apply(_a, [new (_c.apply(File_1.default, _d.concat([_e.apply(void 0, [_f.sent()]), {
                                    compressionType: compressionType,
                                    timestamp: file.date.getDate(),
                                }])))()]);
                        _f.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _f.sent();
                        throw Error("JSZip decompression error: " + error_2);
                    case 10: return [2 /*return*/, phar];
                }
            });
        });
    }
    exports_1("toPhar", toPhar);
    return {
        setters: [
            function (Archive_1_1) {
                Archive_1 = Archive_1_1;
            },
            function (File_1_1) {
                File_1 = File_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (JSZip_1) {
                JSZip = JSZip_1;
            },
            function (Const_1_1) {
                Const_1 = Const_1_1;
            }
        ],
        execute: function () {
        }
    };
});
