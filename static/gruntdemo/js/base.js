/// <reference path="http://static2.51fanli.net/common/libs/jquery/jquery.min.js" />

(function (exports) {

    Function.prototype.method = function (name, fn) {
        if (typeof this.prototype[name] == "undefined") this.prototype[name] = fn;
    };

    !String.prototype.trim && String.method("trim", function () {
        // " hello world! ".trim() -> "hello world!"
        return this.replace(/^\s+|\s+$/g, '');
    });

    !Function.prototype.bind && Function.method("bind", function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    });

    String.method("format", function () {
        //"welcome to {0}, {1}!".format("Fanli", "dude") -> welcome to Fanli, dude!
        for (var s = this, i = 0; i < arguments.length; ++i) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        }
        return s;
    });

    String.method("setCookie", function (value, expiryDays, domain, path, secure) {
        // "cookiename".setCookie('1', 365, ".fanli.com", '/');
        var builder = [this, "=", escape(value)];

        if (expiryDays) {
            var date = new Date();
            date.setTime(date.getTime() + (expiryDays * 86400000));
            builder.push(";expires=");
            builder.push(date.toUTCString());
        }
        if (domain) {
            builder.push(";domain=");
            builder.push(domain);
        }
        if (path) {
            builder.push(";path=");
            builder.push(path);
        }
        if (secure) {
            builder.push(";secure");
        }

        document.cookie = builder.join("");
    });

    String.method("getCookie", function () {
        // "cookiename".getCookie();
        var re = new RegExp('\\b' + this + '\\s*=\\s*([^;]*)', 'i');
        var match = re.exec(document.cookie);
        return (match && match.length > 1 ? unescape(match[1]) : '');
    });

    String.method("delCookie", function (domain, path) {
        // "cookiename".delCookie(".fanli.com", '/');
        document.cookie = this + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (domain ? "; domain=" + domain : "") +
            (path ? "; path=" + path : "");
    });

    function StringBuilder() {
        // var sb = new StringBuilder();
        // sb.append("hello").append(" ").append("world!").toString();
        // output "hello world!"
        this.strings = new Array();
    }

    StringBuilder.prototype.append = function (str) {
        this.strings.push(str); return this;
    };

    StringBuilder.prototype.toString = function () {
        return this.strings.join("");
    };

    var GeneralRegs = {
        // 支付宝账号-只能是邮箱和手机
        alipay: /^(([a-zA-Z0-9])+([a-zA-Z0-9_\.\-])*\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4}))|(0{0,1}1[34578]{1}[0-9]{9})$/ig,
        // 银行账号-仅包含英文字母、数字及中划线
        bankaccount: /^([a-zA-Z0-9]|-)+$/ig,
        // 空
        blank: /^\s*$/,
        // 移动电话
        cellphone: /^0{0,1}1[34578]{1}[0-9]{9}$/ig,
        // 邮箱
        email: /^([a-zA-Z0-9])+([a-zA-Z0-9_\.\-])*\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/ig,
        // 大陆身份证-弱判断，只需位数和形式满足
        icard: /^(\d{18}|\d{15}|\d{17}x)$/ig,
        // 香港身份证
        ihkcard: /^[a-z0-9]{1}\d{6,7}[a-z0-9]{1}$/ig,
        // 台湾身份证
        itwcard: /^[a-z]{1}\d{8,}$/ig,
        // 用户名-仅包含汉字英文字母及空格
        uname: /^[\u4e00-\u9fa5a-zA-Z\s]+$/ig,
        // url
        url: /^http(s)?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ig,
        // 验证码
        vercode: /^\d{6}$/
    };

    ///////////////////////////////////////////////////////////////////////////////
    //  注册命名空间
    //  FLNS.register("Fanli");
    //  Fanli.add("publicFunctionOne", function(){})
    //       .add("publicProperty", "my email is lei.zhang@51fanli.com")
    ///////////////////////////////////////////////////////////////////////////////
    var FLNS = {
        "register": function () {
            var a = arguments, o = null, i, j, d, rt;
            for (i = 0; i < a.length; ++i) {
                d = a[i].split(".");
                rt = d[0];
                eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {add: function (k, v) { if (!this[k]) { this[k] = v;} return this;} };} o = ' + rt + ';');
                for (j = 1; j < d.length; ++j) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                    o.add = function (k, v) {
                        if (!this[k]) { this[k] = v; } return this;
                    };
                }
            }

            return o;
        }
    };

    ///////////////////////////////////////////////////////////////////////////////
    //  输入验证
    //  isNumber :  数字
    //  isEmail  :  邮箱
    //  isName   :  名字只能是汉字，字母，数字及下划线组成
    //  isUrl    :  有效的url格式，以http/https开头
    //  isPhone  :  有效的手机号码
    ///////////////////////////////////////////////////////////////////////////////
    var InputValidation = {
        "isNumber": function (intArg) {
            return Object.prototype.toString.call(intArg) === "[object Number]";
        },
        "isEmail": function (emailStr) {
            GeneralRegs.email.lastIndex = 0;
            return GeneralRegs.email.test(emailStr);
        },
        "isName": function (nameStr) {
            GeneralRegs.uname.lastIndex = 0;
            return GeneralRegs.uname.test(nameStr);
        },
        "isUrl": function (urlStr) {
            GeneralRegs.url.lastIndex = 0;
            return GeneralRegs.url.test(urlStr);
        },
        "isPhone": function (phoneArg) {
            GeneralRegs.cellphone.lastIndex = 0;
            return GeneralRegs.cellphone.test(phoneArg);
        }
    };

    ///////////////////////////////////////////////////////////////////////////////
    //  常用验证
    //  isIe    :  IE浏览器
    //  isIe6   :  IE6浏览器
    ///////////////////////////////////////////////////////////////////////////////
    var GeneralValidation = {
        "isIe": function () {
            return /*@cc_on !@*/false;
        },
        "isIe6": function () {
            return !-[1, ] && !window.XMLHttpRequest;
        }
    };

    var GrenralEscape = {
        "escapeRegExp": function (text) {
            return text.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        },

        "escapeHTML": function (value) {
            return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    };

    //expose namespace
    exports.StringBuilder = StringBuilder;
    exports.InputValidation = InputValidation;
    exports.GeneralValidation = GeneralValidation;
    exports.GeneralRegs = GeneralRegs;
    exports.GrenralEscape = GrenralEscape;
    exports.FLNS = FLNS;

}(this));