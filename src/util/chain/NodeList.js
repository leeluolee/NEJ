/*
 * ------------------------------------------
 * _$$NodeList， * @version  0.1
 * @author hzzhenghaibo
 * ------------------------------------------
 */
var f = function() {
    // import
    var _  = NEJ.P,
        _e = _("nej.e"),
        _v = _("nej.v"),
        _u = _("nej.u"),

        // local vals
        _slice = [].slice,
        _doc = document,
        _de = "documentElement",
        _docElem = _doc[_de],
        _testNode = _doc.createElement('div'),

        // assert 
        _textHandle = _testNode.textContent == null? 'innerText' : 'textContent' ,

        // function
        _autoSet = function(_fn) {
            return function(_key, _value) {
                if (_u._$isObject(_key)){
                    var _args = _slice.call(arguments, 1)
                    for(var _i in _key){
                        _fn.apply(this, [_i, _key[_i]].concat(_args));
                    }
                }else{
                    _fn.apply(this, arguments);
                }
                return this;
            };
        },
        _splitSet = function(_fn){
            return function(_name){
                if(_u._$isArray(_name)){
                    var _args = _slice.call(arguments, 1),
                        _len = _name.length;
                    for(var _i = 0 ; _i< _len ;_i++){
                        _fn.apply(this, [_name[_i]].concat(_args));
                    }
                }else{
                    _fn.apply(this, arguments);
                }
                return this
            }
        },
        _splitGet = function(){
            return function(_name){
                if(_u._$isArray(_name)){
                    var _len = _name.length, 
                        _i = 0,
                        _ret = {};
                    for(; _i< _len ;_i++){
                        _ret[_name] = _fn.call(this, _name[_i]);
                    }
                    return _ret;
                }else{
                    return _fn.apply(this, arguments);
                }
            }

        },
        _extend = function(_name, _value, _options) {
            _options = _options || {};
            if (this[_name] == null || _options.override) this[_name] = _value;
            return this
        },
        _bubbleUp = function(_sl, _node, _container) {
            while (_node && _node !== _container) {
                if (nes.matches(_node, _sl)){
                    return _node;
                }
                _node = _node.parentNode;
            }
        },
        /**
         * 根据返回类型决定返回this，还是别的什么
         * @param  {Mix} _result     
         * @param  {String} _methodName 当前方法名
         * @return {Mix}
         */
        _ischainableRet = function(_result, _methodName, _node){
            return (_result === _node || _result === "undefined" || _result === this ||
                    _result === _e || _result === _v);// 这两个是为了兼容nej
        },
        _isAcceptedNode= function(_node){
            if(!_node) return false
            var _type = _node.nodeType;
            return _type === 1 || _type === 9 || _node.window === _node;
        };
    // name space  _("nej.$")    
    var $ = nej.$ = function(_selector, _context){
        return new _$$NodeList(_selector, _context);
    };
    /**
     * _nodelist的包装类
     * @param {String|Node} _node
     */
    var _$$NodeList = function(_selector, _context){
        this.length = 0;
        this._signs = {};//标示是否有了当前节点
        this._context = _context || _doc;
        if(!_selector) return 
        if(typeof _selector === "string"){
            this._$add(_e._$all(_selector, _context));
        }else if(_selector instanceof _$$NodeList || _isAcceptedNode(_selector) ||
            _selector.length){ // _$$NodeList 或者 是单节点、或者是类数组(如childNodes)
            this._$add(_selector);
        }
    }

    // 扩展接口
    $._$extend = _autoSet(_extend)._$bind($)


    $._$extend({
        _$signal: "_uid",//会绑定在节点上的唯一标示
        _$instances:{},// 缓存对象
        _$implement: _autoSet(function(_name, _fn, _options){
            _options = _options || {};
            _extend.call(_$$NodeList.prototype, _name, _options.static? this._transport(_fn): _fn);
        }),
        _transport: function(_fn){
            return function(){
                var _args = _slice.call(arguments)
                if(!this.length) throw Error("内部节点集为空")
                _args.unshift(this[0]);
                var _ret = _fn.apply(this,_args);
                // 当返回_e、_v、this、_node、undefined(无返回值)都视为链式
                if(!_ischainableRet.call(this, _ret)) return _ret;
                this._$forEach(function(_node, _index){
                    if(_index === 0) return;
                    _args[0] = _node;
                    _fn.apply(this ,_args);
                });
                return this
            }
        },
        _merge: function(_list1, _list2 , _filter){
            var _i = _list1.length || 0,
                _j = 0;
            for( ;_list2[_j] !== undefined;){
                var _tmp = _list2[_j++];
                if(!_filter || _filter.call(_list1, _tmp)){
                    _list1[_i++] = _tmp;
                }
            }
            _list1.length = _i;
            return _list1;
        },
        _toArray: function(_list){
            return $._merge([], _list);
        },
        // ** fork form jQuery **
        _contains: _docElem.contains ? function( _a, _b ) {
            return _a === _b || (_a.nodeType == 9? _a[_de]: _a).contains(_b)
        }: _docElem.compareDocumentPosition ?
        function( _a, _b ) {
            // more info : https://gist.github.com/4601579
            return _b && !!( _a.compareDocumentPosition( _b ) & 16 );
        }: function( _a, _b ) {
            // fallback
            while ( (_b = _b.parentNode) ) {
                if ( _b === _a ) return true;
            }
            return false;
        },
        _delegateHandlers : {},// for delegate
        _cleanSelector : nes._cleanSelector,
        _$uniqueSort : nes._uniqueSort,
        _$matches : nes.matches,
        _$uid : nes._getUid
    })

    // proto function 扩展
    // ================================
    var _rclickEvents = /^(?:click|dblclick|contextmenu|DOMMouseScroll|mouse(?:\w+))$/,
        _definitions ={
        // for insert
        "insertor":{
            "up":function(_node, _node2){
                _node.insertBefore(_node2, _node.firstChild);
            },
            "bottom": function(_node, _node2){
                _node.append(_node2);
            },
            "before":function(_node, _node2){
                var _parent = _node2.parentNode;
                if(_parent) _parent.insertBefore(_node, _node2);
            },
            "after":function(_node, _node2){// _node3
                var _parent = _node2.parentNode;
                if(_parent) _parent.insertBefore(_node, _node2.nextSibling);
            }
        },
        formProps :{
            input: 'checked', 
            option: 'selected', 
            textarea: 'value'
        },
        fixture:{
            // dest src attribute fixed
            // TODO: jQuery and mootools
            "clone": function(src, dest){

            }
        }
    },
    // for traverse
    _traverse = function(_direct){
        var _$matches = $._$matches;

        return function(_selector, _all){
            var _ret = $([]);
            if(typeof _selector === "boolean"){
                _all = _selector;
                _selector = null;
            }
            this._$forEach(function(_node){
                var _tmp = _node[_direct];
                while (_tmp) {
                  if(_tmp.nodeType ===1 && (!_selector || _$matches(_tmp, _selector))){
                    _ret._$add(_tmp);
                    if(!_all) break;
                  }
                  _tmp = _tmp[_direct];
                }
            })

            return _ret;
        }
    };


    $._$implement({
        // 1. 工具类
        // ===========
        _$forEach: function(_fn){
            _u._$forEach(this, _fn)
            return this
        },
        _$filter: function(_fn){
            var _ret = [],
                _isSelctor = typeof _fn === "string"
            this._$forEach(function(_node, _index){
                var _test = _isSelctor ? $._$matches(_node, _fn):_fn.call(this, _node, _index);
                if(_test) _ret.push(_node)
            });
            return $(_ret);
        },
        // 当全部返回节点时 包装成对象
        _$map:function(_fn){
            var _ret = [],
                _isNotAllNode = false;
            this._$forEach(function(_node, _index){
                var _res = _fn.call(this, _node, _index);
                if(!_isAcceptedNode(_res)) _isNotAllNode = true
                _ret.push(_res)
            });
            return _isNotAllNode ? _ret : $([])._$add(_ret)
        },
        _$sort:function(){
            var _array = this._$get();
            $._$uniqueSort(_array)
            return $(_array);
        },
        _$add:function(_node){
            if(!_node) return;
            if(typeof _node.length !== "number") _node = [_node];
            $._merge(this, _node, function(_nodum){
                if(!_isAcceptedNode(_nodum)) return false;
                var _uid = $._$uid(_nodum) 
                if(this._signs[_uid]){
                    return false 
                }else{
                    this._signs[_uid] = 1
                    return true
                }
            });
            return this;
        },
        _$get:function(_index, wrap){
            if(typeof _index !== "number") return $._toArray(this);
            return wrap ? $(this[_index]) : this[_index];
        },
        _$matches: function(_selector){
            return $._$matches(this[0],_selector)
        },
        // enhance nej.e._$style、nej.e._$setStyle、nej.e._$getStyle
        // _$style: _autoSet(function(_key,_value){
        //     if(!_key) throw Error("缺少css属性名")
        //     this._$forEach()
        // }),

        // fix attr
        // _$attr: function(){

        // },

        /**
         * 2. 遍历、获取
         * ======================
         */
        _$parent: _traverse("parentNode"),
        _$prev: _traverse("previousSibling"),
        _$next: _traverse("nextSibling"),
        _$children: function(_selector, _all){
            var _ret = $([]);
            if(typeof _selector === "boolean"){
                _all = _selector;
                _selector = null;
            }
            this._$forEach(function(_node){
                if(_all)
                var _backed = _all? _e._$all(_selector || "*", _node)
                    : _selector? $(_node.childNodes)._$filter(_selector)
                    : $(_node.childNodes);
                _ret._$add(_backed);
            });
            return _ret
        },
        _$siblings: function(_selector){ // sibling 默认就是取所有
            return this._$prev(_selector, true)._$add(this._$next(_selector, true))
        },
        // 3. 操作
        // =========================

        // 把jQuery的8个API整成了2个
        _$insert: function(_selector, _direct){
            _direct = _direct && _direct.toLowercase() || "bottom";
            var _context = $(_selector)

            this._$forEach(function(_node){

            });

        },
        // e....  means insert To
        _$insert2: function(_selector, _direct){
            var _context = $("_selector")
            if(!_context[0]) return
            _context._$insert2(this, _direct)
            return this
        },
        // Warning: 还有bottom2 bottom 等便利方法8个注册在内
        _$clone: function(_withContent){
            var _base = this[0]
            if(!_base) throw Error("clone节点不存在")
            _withContent = !!_withContent
            var _clone = _base.cloneNode(_withContent);
            _clone.removeAttribute('id'); //避免重复id
            // http://w3help.org/zh-cn/causes/BT9030  IE支持clearAttribute 与 merge
            // FIX: lt-ie9
            if (_clone.clearAttributes){
                _clone.clearAttributes();
                _clone.mergeAttributes(_base);
                _clone.removeAttribute('_uid');
                if (_clone.options){
                    var no = _clone.options, eo = element.options;
                    for (var j = no.length; j--;) no[j].selected = eo[j].selected;
                }
            }
            // if()
                // /FIX
            var prop = _definitions.formProps[element.tagName.toLowerCase()];
            if (prop && element[prop]) node[prop] = element[prop];
            return $(clone);
        },
        // 4. 属性
        // ===============================
        _$text: function(_content){
            if(_content === undefined){
                return this[0][_textHandle];
            }
            this._$forEach(function(_node){
                _node[_textHandle] = _content
            })
        },
        _$html: function(_content){
            if(_content === undefined){
                return this[0].innerHTML;
            }
            this._$forEach(function(_node){
                _node.innerHTML = _content;
            })
            return this;
        },
        _$val:function(_content){
            if(_content === undefined){
                return this[0].value;
            }
            this._$forEach(function(_node){
                _node.value = _content;
            })
            return this;
        },

        // 事件相关
        // ==============
        // 私有方法  注册事件代理
        _delegate:function(_event, _selector, _handler){
            _selector = $._cleanSelector(_selector);
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node),
                    _handlers = $._delegateHandlers[_uid] || ($._delegateHandlers[_uid] = {}),
                    _events = _handlers[_event] || (_handlers[_event] = {}),
                    _selectors = _events[_selector] || (_events[_selector] = []);

                var _realCb = function(_e) {//正式回调
                    var _trigger;
                    if (_trigger = _bubbleUp(_selector, _e.target || _e.srcElement , _node)) {
                        _handler.apply(_trigger, arguments);
                    }
                };
                // 保存引用 以可以正确off
                _realCb._raw = _handler;
                _selectors.push(_realCb);
                // 假如不存在对应的容器，则先创建
                _v._$addEvent(_node, _event, _realCb);
                // Fix: 我们保存原始_handler为了 nej的 delEvent可以正确解绑
                // 省去再存储一份handler列表的开销
            })
        },
        // 私有方法 解绑事件代理
        _undelegate:function(_event, _selector, _handler){
            _selector = $._cleanSelector(_selector);
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node);
                var _handlers, _events, _selectors;
                if (!(_handlers = $._delegateHandlers[_uid]) || 
                    !(_events = _handlers[_event]) || !(_selectors = _events[_selector])){
                    return 
                }
                for(var _len = _selectors.length;_len--;){
                    var _fn = _selectors[_len];
                    //如果没有传入_handler或者 函数匹配了
                    if(!_handler || _fn._raw === _handler){
                        _v._$delEvent(_node, _event, _fn)
                        _selectors.splice(_len,1)
                    }
                }
                // 如果被删光了
                if(!_selectors.length) delete _events[_selector];
            })
            return this
        },
        _$on:_autoSet( _splitSet( function(_event, _selector, _handler){
            if(_event === undefined) throw Error("缺少事件名参数");
            if(typeof _selector === "function"){
                _handler = _selector;
                _selector = null;
            };
            var _index = _event.indexOf(" ");
            if(~_index){//有空格分隔 如"click div.m-model"
                _selector = _event.slice(_index + 1);
                _event = _event.slice(0, _index);
            }
            if(!_handler) throw Error("缺少回调函数")

            if(_selector){ // on ("click", "li.clas1", handler)或 on("click", "li.class1")
                return this._delegate(_event,_selector, _handler)
            }
            // on("click", handler)
            return this._$forEach(function(_node){
                _v._$addEvent(_node, _event, _handler);
            });
        })),
        _$off:_autoSet( _splitSet( function(_event, _selector, _handler){
            if(typeof _selector === "function"){
                _handler = _selector;
                _selector = null;
            }
            var _index;
            if(_event && ~(_index = _event.indexOf(" "))){//有空格分隔 如"click hello"
                _selector = _event.slice(_index + 1);
                _event = _event.slice(0, _index);
            }
            if(_selector){ // off("click", ".class")   off("click", ".class", handler)
                return this._undelegate(_event, _selector, _handler)
            }
            return this._$forEach(function(_node){
                var _uid = $._$uid(_node),
                    _handlers = $._delegateHandlers[_uid],
                    _events;
                if(!_event){ // off()
                    if(_handlers){
                        delete $._delegateHandlers[_uid] // 删除所有
                    }
                    _v._$clearEvent(_node, _event);
                }else{ 
                    if(_handlers) _events = _handlers[_event];
                    if(!_handler){ // off("click")
                        if(_events){
                            delete _handlers[_event]
                        }
                        _v._$clearEvent(_node, _event)
                    }else{ // off("click", handler)
                        // 这里不对delegate做清理是因为 这样不会对delegate发生影响
                        _v._$delEvent(_node, _event, _handler)
                    }
                }
            });
        })),
        _$trigger:_splitSet( function(_event, _options){
            if(typeof _event !== 'string') throw Error("事件类型参数错误")
            this._$forEach(function(_node){
                _v._$dispatchEvent(_node, _event, _options)
            })
            return this
        }),

        // http://stackoverflow.com/questions/6599071/array-like-objects-in-javascript
        // 让这个对象看起来像数组
        splice: function(){ throw Error("don't use the NodeList#splice")}
    });

    // 无奈 添加 _$before // _$before2   _$bottom _$bottom2等方法    
    _u._$forIn(_definitions.insertor, function(_value, _key){
        $._$implement("_$" + _key, function(){
           var _args = _slice.call(arguments);
           _args.push(_key)
           this._$insert.append(this, _args)
        })
        $._$implement("_$" + _key+"2", function(){
           var _args = _slice.call(arguments);
           _args.push(_key)
           this._$insert2.apply(this, _args)
        })

    })

    // 添加类似 _$click的事件
    // ================================
    // TODO: 检查是否有遗漏的方法
    var _beAttached = ("click dbclick blur change focus focusin focusout keydown keypress"+ 
        "keyup mousedown mouseover mouseup mousemove mouseout scroll select submit").split(" ");

    _u._$forEach(_beAttached, function(_eventName){
        $._$implement("_$"+_eventName, function(){
            var _type = typeof arguments[0];
            var _args = _slice.call(arguments);
            _args.unshift(_eventName);
            // click("li", handler)   或者  click(handler)
            if((_type == "function") || (_type === "string" && typeof arguments[1] === "function")){
                this._$on.apply(this, _args);
            }else{
                this._$trigger.apply(this, _args);
            }
        })
    })
}
define('{lib}util/chain/NodeList.js', [
    '{lib}util/query/query.js',
    '{lib}base/element.js',
    '{lib}base/util.js'
    ], f);