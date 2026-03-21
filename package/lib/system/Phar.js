System.register(["./Binary", "./BinaryBuffer", "./Utils", "./phar/Const", "./phar/Archive", "./phar/File", "./ZipConverter"], function (exports_1, context_1) {
    "use strict";
    var Binary_1, BinaryBuffer_1, Utils, Const_1, Archive_1, File_1, ZipConverter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Binary_1_1) {
                Binary_1 = Binary_1_1;
            },
            function (BinaryBuffer_1_1) {
                BinaryBuffer_1 = BinaryBuffer_1_1;
            },
            function (Utils_1) {
                Utils = Utils_1;
            },
            function (Const_1_1) {
                Const_1 = Const_1_1;
            },
            function (Archive_1_1) {
                Archive_1 = Archive_1_1;
            },
            function (File_1_1) {
                File_1 = File_1_1;
            },
            function (ZipConverter_1) {
                ZipConverter = ZipConverter_1;
            }
        ],
        execute: function () {
            exports_1("Binary", Binary_1.default);
            exports_1("BinaryBuffer", BinaryBuffer_1.default);
            exports_1("Utils", Utils);
            exports_1("Const", Const_1.default);
            exports_1("Signature", Const_1.Signature);
            exports_1("Compression", Const_1.Compression);
            exports_1("Archive", Archive_1.default);
            exports_1("File", File_1.default);
            exports_1("ZipConverter", ZipConverter);
        }
    };
});
