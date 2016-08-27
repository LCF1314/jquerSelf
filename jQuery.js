/**
 * Created by Administrator on 2016/8/25.
 */
(function (window,undefined) {
    var support = {},
        rnative = /\[native code\]/;
    support.indexOf = rnative.test(Array.prototype.indexOf + '');
    /*处理indexof*/
    jQuery.indexOf = function(array,search,startIndex){
        startIndex = startIndex || 0;
        if(support.indexOf){
            return array.indexOf(search,startIndex);
        }
        for(var i = startIndex; i < array.length;i++ ){
            if(array[i] === search){
                return i;
            }
        }
        return -1;
    }
    /*处理push*/
    var push = [].push;
    try{
        push.apply([],document.getElementsByTagName('*'));
    }catch(e){
        push = {
            apply: function (a, b) {
                for(var i = 0; i < b.length;i++){
                    a[a.length++] = b[i];
                }
                return this;
            }
        }
    }

    function jQuery(selector){
        return new jQuery.fn.init(selector);
    }
    jQuery.fn = jQuery.prototype = {
        constructor:jQuery,
        type:jQuery,
        length:0,
        events:{},
        init: function (selector) {
            if(!selector){
                return this;
            }
            /*如果selector是字符串*/
            if(typeof selector === 'string'){
                if(selector.charAt(0) == '<'){
                    push.apply(this,jQuery.parseHtml(selector));
                }else{
                    push.apply(this,jQuery.Select(selector));
                }
                return this;
            }
            /*如果selector是函数*/
            if(typeof selector === 'function'){
                var oldFunc = window.onload;
                if(typeof oldFunc === 'function'){
                    window.onload = function () {
                        oldFunc();
                        selector();
                    }
                }else{
                    window.onload = selector;
                }
            }
            /*如果selector是dom对象*/
            if(selector.nodeType){
                this[0] = selector;
                this.length = 1;
                return this;
            }
            /*JQuery对象*/
            if(selector.nodeType == 'Lcf'){
                push.apply(this,selector);
                return this;
            }
            /*如果selector是doms数组*/
            if(selector.length>=0){
                push.apply(this,selector);
            }else{
                this[0] = selector;
                this.length = 1;
            }
            return this;
        },
        toArray: function () {
            return [].slice.call(this,0);
        },
        get: function (index) {
            if(index == undefined){
                return this.toArray();
            }else{
                if(index >= 0){
                    return this[index];
                }else{
                    return this[this.length + index];
                }
            }
        },
        eq: function (index) {
            var newObj = this.constructor(this.get(index))
            newObj.prev = this;
            return newObj;
        },
        firat: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (callback) {
            jQuery.each(this,callback);
            return this;
        },
        map: function (callback) {
            return jQuery.map(this,callback);
        }
    }
    /*修改init的原型为jQuery的原型*/
    jQuery.fn.init.prototype = jQuery.fn;

    /*混入方法*/
    jQuery.extend = jQuery.fn.extend = function (obj) {
        for(var k in obj){
            this[k] = obj[k];
        }
    }

    /*工具方法*/
    jQuery.extend({
        each: function (arr,callback) {
            if(arr.length>=0){
                for(var i =0;i< arr.length;i++){
                    var res = callback.call(arr[i],i,arr[i]);
                    if(res === false){
                        break;
                    }
                }
            }else{
                for(var k in arr){
                    var res = callback.call(arr[k],k,arr[k]);
                    if(res === false){
                        break;
                    }
                }
            }
            return arr;
        },
        map: function (arr,callback) {
            var res = [];
            if(arr.length>=0){
                for(var i = 0;i<arr.length;i++){
                    var v = callback(arr[i],i);
                    if(v != undefined){
                        res.push(v);
                    }
                }
            }else{
                for(var k in arr){
                    var v = callback(arr[k],k);
                    if(v != undefined){
                        res.push(v);
                    }
                }
            }
            return res;
        }
    })

    /*字符串转化为标签*/
    jQuery.parseHtml = (function () {
        var node = document.createElement('div');
        return function (str) {
            node.innerHTML = str;
            var arr = [];
            push.apply(arr,node.childNodes);
            return arr;
        }
    })();

    /*选择器*/
    var Select = (function () {
        var support = {},
            rnative = /\[native code\]/,
            push = [].push;
        try{
            push.apply([],document.getElementsByTagName('*'));
        }catch(e){
            push = {
                apply: function (a, b) {
                    for(var i = 0; i < b.length;i++){
                        a[a.length++] = b[i];
                    }
                    return this;
                }
            }
        }
        support.qsa = rnative.test(document.querySelectorAll + '');
        support.getElementsByClassName = rnative.test(document.getElementsByClassName);
        var div = document.createElement('div');
        support.getElementsByClassName2 = rnative.test(div.getElementsByClassName);
        support.trim = rnative.test(String.prototype.trim +'');
        support.indexOf = rnative.test(Array.prototype.indexOf + '');

        /*处理trim*/
        function trim(str){
            if(support.trim){
                return str.trim();
            }else{
                return str.replace(/^\s+|\s+$/g,'');
            }
        }
        /*处理indexof*/
        function indexOf(array,search,startIndex){
            startIndex = startIndex || 0;
            if(support.indexOf){
                return array.indexOf(search,startIndex);
            }

            for(var i = startIndex; i < array.length;i++ ){
                if(array[i] === search){
                    return i;
                }
            }
            return -1;
        }
        /*去重*/
        function unqiue(arr){
            var newArr = [];
            for(var i = 0; i< arr.length;i++){
                if(indexOf(newArr,arr[i]) == -1){
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        }
        /*处理calssName选择器*/
        function getClassName(className,node){
            if(node == document && support.getElementsByClassName && node.nodeType == 1 && support.getElementsByClassName2){
                return node.getElementsByClassName(className);
            }else{
                var res = [],
                    list = document.getElementsByTagName('*'),
                    tempClassName;
                for(var i =0 ;i< list.length;i++){
                    tempClassName = list[i].getAttribute('class');

                    if(!tempClassName) continue;
                    if(indexOf(tempClassName.split(','),className) != 1){
                      res.push(list[i]);
                    }
                }
                return res;
            }
        }
        /*选择器*/
        var Select = function (selector,node,results) {
            results = results || [];
            node  = node || document;

            if(support.qsa){
                push.apply(results,document.querySelectorAll(selector));
                return unqiue(results);
            }
            return Select2(selector,node,results);
        }

        /*简单选择器方法*/
        function tag(tagName,node,results){
            results = results || [];
            node = node || document;
            push.apply(results,node.getElementsByTagName(tagName));
            return results;
        }

        function cName(className,node,results){
            results = results || [];
            node = node || document;
            push.apply(results,getClassName(className,node));
            return results;
        }
        function id(idName,node,results){
            results = results || [];
            node = node || document;
            var dom = document.getElementById(idName);
            if(dom){
                push.apply(results,dom);
            }
            return results;
        }

        function Select2(selector,node,results){
            results = results || [];
            node = node || document;
            var list = selector.split(',');

            for(var i = 0;i<list.length;i++){
                Select3(trim(list[i],node,results));
            }
            return unqiue(results);
        }

        function Select3(selector,node,results){
            results = results || [];
            node = node || document;
            var first = selector.charAt(0);

            if(selector.split(' ').length === 1){
                if(selector === '*'){
                    return tag(selector,node,results);
                }else if(first === '#'){
                    return id(selector.slice(1),node,results);
                }else if(first === '.'){
                    return cName(selector.slice(1),node,results);
                }else{
                    return tag(selector,node,results);
                }
            }else if(/^[#\.\w\d_\-]+(\s+[#\.\w\d_\-]+)+$/.test(selector)){
                var tempList = Select4(selector,node,results);
                push.apply(results,tempList);
                return results;
            }else{
                throw new Error('暂不支持该选择器......')
            }

        }


        function Select4(selector,node,results){
            results = results || [];
            node = node || document;

            var list = selector.replace(/\s+/g,' ').split(' ');
            var res1 = [node],
                res2 = [];

            for(var i = 0; i < list.length; i++){
                res2 = res1;
                res1 = [];
                for(var j = 0;j < res2.length;j++){
                    Select3(list[i],res2[j],res1);
                }
            }
            return res1;
        }



        
        return Select;
    })();
    
    jQuery.Select = Select;


    /*处理Dom*/
    jQuery.extend({
        append: function (parent,element) {
            parent.appendChild(element);
        },
        prepend: function (parend,element) {
            parend.insertBefore(element,parend.firstChild);
        }
    })
    jQuery.fn.extend({
        appendTo: function (selector) {
            /*构造原型对象*/
            var newObj = this.constructor(selector);
            var res1,arr = [];
            var o = this.constructor();

            for(var i= 0;i<newObj.length;i++){
                for(var j = 0; j< this.length;j++){

                    res1 = i == newObj.length -1
                        ?this[j]
                        :this[j].cloneNode(true);
                    arr.push(res1);
                    newObj[i].appendChild(res1);
                    jQuery.append(newObj[i],res1);
                }
            }
            push.apply(o,arr);
            o.prev = this;
            return this;
        },
        end: function () {
            return this.prev || this;
        },
        append: function (selector) {
            this.constructor(selector).appendTo(this);
            return this;
        },
        prependTo: function (selector) {
            /*构造原型对象*/
            var newObj = this.constructor(selector);
            var res1,arr = [];
            var o = this.constructor();

            for(var i= 0;i<newObj.length;i++){
                for(var j = 0; j< this.length;j++){

                    res1 = i == newObj.length -1
                        ?this[j]
                        :this[j].cloneNode(true);
                    arr.push(res1);
                    newObj[i].appendChild(res1);
                    jQuery.prepend(newObj[i],res1);
                }
            }
            push.apply(o,arr);
            o.prev = this;
            return this;
        },
        prepend: function (selector) {
            this.constructor(selector).prependTo(this);
            return this;
        }
    });

    /*处理事件*/
    jQuery.fn.extend({
        on: function (type,callback) {
            return this.each(function () {
                this.addEventListener(type,callback);
            });
        },
        off: function (type,callback) {
            return this.each(function () {
                this.removeEventListener(type,callback);
            });
        }
    });

    jQuery.each(("onblur,onfocus,onclick,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout," +
    "onmouseover,onmouseup,onmousewheel,onkeydown,onkeypress,onkeyup").split(','), function (i,v) {
        var event = v.slice(2);
        jQuery.fn[event] = function (callback) {
            return this.on(event,callback);
        }
    });
    /*处理样式*/
    jQuery.extend({
        getStyle: function (dom,name) {
            if(dom.currentStyle){
                return dom.currentStyle[name];
            }else{
                return window.getComputedStyle(dom,null)[name];
            }
        }
    });
    jQuery.fn.extend({
        css: function (name,value) {
            if(typeof name === 'string' && typeof value === 'stirng'){
                this.each(function () {
                    this.style[name] = value;
                });
            }else if(typeof name === 'string' && value === undefined){
                return jQuery.getStyle(this.get(0),name);
            }else if(typeof name === 'object' && value === undefined){
                this.each(function () {
                    for(var k in name){
                        this.style[k] = name[k];
                    }
                });
            }
            return this;
        },
        addClass: function (name) {
            this.each(function () {
                var value = this.className;
                if(!value){
                    this.className = name;
                }else if(jQuery.indexOf(value.split(' '),name)== -1){
                    this.className += ' ' + name;
                }
            });
            return this;
        },
        removeClass: function (name) {
            this.each(function () {
                var value = this.className;
                var arr = value.split(' ');
                var tmp;
                while((tmp = jQuery.indexOf(arr,name)) !=-1){
                    arr.splice(tmp,1);
                }
                this.className = arr.join(' ');
            });
            return this;
        },
        hasClass: function (name) {
            var res = this.map(function (v,i) {
                var arr = v.className.split(' ');
                if(jQuery.indexOf(arr,name) != -1){
                    return true;
                }
            });
            return res.length > 0;
        },
        toggleClass: function (name) {
            var that = this;
            this.each(function () {
                if(that.constructor(this).hasClass(name)){
                    that.constructor(this).removeClass(name);
                }else{
                    that.constructor(this).addClass(name);
                }
            });
            return this;
        }
    });
    /*操作属性*/
    jQuery.fn.extend({
        attr: function (name,value) {
            if(typeof name ==='string' && typeof value ==='string'){
                this.each(function () {
                    this.setAttribute(name,value);
                });
            }else if(typeof name === 'string' && value === undefined){
                return this.get(0).getAttribute(name);
            }else if(typeof name === 'object' && value === undefined){
                this.each(function () {
                    for(var k in name){
                        this.setAttribute(k,name[k]);
                    }
                });
            }
        },
        removeAttr: function (name) {
            this.each(function () {
                this.removeAttribute(name);
            });
        },
        prop: function (name, value) {
            if(typeof name === 'string' && typeof value ==='function'){
                this.each(function (v,i) {
                    this[name] = value.call(this,this,i);
                });
            }else if(typeof name ==='string' && typeof value ==='boolean'){
                this.each(function (){
                    this[name] = value;
                });
            }else if(typeof name === 'string' && value === undefined){
                return this.get(0)[name];
            }else if(typeof name === 'object' && value === undefined){
                this.each(function () {
                    for(var k in name){
                        this[k] = name[k];
                    }
                });
            }
            return this;
        },
        text: function (text) {
            if(typeof text === 'string'){
                this.each(function () {
                    this.innerText = text;
                });
            }else{
                return this.get(0).innerText;
            }
            return this;
        },
        html: function (html) {
            if(typeof html === 'string'){
                this.each(function () {
                    this.innerHTML = html;
                });
            }else{
                return this.get(0).innerHTML;
            }
            return this;
        },
        val: function (value) {
            if(typeof value === 'string'){
                this.each(function () {
                    this.value = value;
                });
            }else{
                return this.get(0).value;
            }
            return this;
        }
    });

    window.jQuery = window.$ = jQuery;


})(window);