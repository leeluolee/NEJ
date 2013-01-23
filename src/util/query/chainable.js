/*
 * ------------------------------------------
 * 利用NEJ原有API包装成链式调用风格API，
 * @version  0.1
 * @author hzzhenghaibo
 * ------------------------------------------
 */
var f = function() {
    // namespace
    var _ = NEJ.P,
        _e = _("nej.e"),
        _v = _("nej.v"),
        _u = _("nej.u");

    // local vars
    var _slice = [].slice,
        _doc = document,
        _de = "documentElement",
        _docElem = _doc[_de],
        // 节点集去重排序
        _unique = nes.uniqueSort;


    // 简单扩展
    var _extend = function(_o1, _o2, _override) {
      for (var _i in _o2) {
        if (_o1[_i] == null || _override) _o1[_i] = _o2[_i];
      }
    };
    /**
     * 扩展原型
     * @param  {} _name    [description]
     * @param  {[type]} _method  [description]
     * @param  {[type]} _options [description]
     * @return {[type]}
     */
    var _implement = function(_name, _method, _options){
        var _self = this;
        if(_u._$isObject(_name)){
            _u._$forIn(_name, function(_m, _n){
                _implement.call(_self, _n, _m, _options)
            });
        }else{
            var _hooks = this._hooks,
                _self = this;
            this.fn[_name] = _method;
            if(!_options.noHook && _hooks && _hooks.length){
                _u._$forEach(_hooks, function(_hook){
                    _hook(_name, _method, _options)
                });
            }
        }
    }

    /**
     * 在对Node做扩展时，自动给NodeList做相应扩展
     * @param  {String} _name    扩展方法名
     * @param  {Function} _method  扩展方法
     * @param  {Object} _options 可能会有用的选项, 比如阻止hook
     * @return {Void}
     */
    var _linkList = function(_name, _method, _options){
        _$$.fn[_name] = function(){
            var _nodeList = this._nodeList, 
                _ret = [],
                _len, _get;

            if(_nodeList && (_len = _nodeList.length)){
                for(var _i = 0; _i < _len; _i++){
                    var _node = _NodeList._getTmpNode(_nodeList[_i]);
                    var _res = _method.apply(_node, arguments);
                    if(_res !== _node && _res !== undefined){
                        _ret[_i] = _res;
                    }
                }
            }
            return _ret.length? _ret : this;
        }
    }

  
    /**
     * _contains
     * 判断_a节点中是否包含_b的子节点
     */    
    var _contains = _docElem.contains ? function( _a, _b ) {
        return _a === _b || (a.nodeType == 9? a[_de]: a).contains(b)
    }: _docElem.compareDocumentPosition ?
    function( _a, _b ) {
        return _b && !!( _a.compareDocumentPosition( _b ) & 16 );
    }: function( _a, _b ) {
        while ( (_b = _b.parentNode) ) {
            if ( _b === _a ) return true;
        }
        return false;
    };
    /**
     * _Node的包装类
     * @param {[type]} _selector [description]
     * @param {[type]} _context  [description]
     */
    var _Node = function(_selector, _context){
        if(_selector._type === "Node"){ //已经被包装
            this._node = _selector._node
        }else if(_selector.nodeType){
            this._node = _selector
        // 如果只是一个选择器
        }else if(typeof _selector === "string"){
            this._node = _e._$one(_selector, _context)
        }
        if(this._node) this._type = "Node"
    }


    /**
     * _nodelist的包装类
     * @param {String|Node} _node
     */
    var _NodeList = function(_selector, _context){
        if(_selector._type === "NodeList"){ //已经被包装
            this._nodeList = _selector._nodeList;
        }else if(typeof _selector === "string"){
            this._nodeList = _e._$all(_selector, _context);
        }
        if(!this._nodeList) this._nodeList =[];
        this._type = "NodeList";
        this.length = this._nodeList.length;
    };
    _NodeList._getTmpNode = function(_node){
        var _ret =  _NodeList._tmpNode || (_NodeList._tmpNode = _$(_doc.createElement("div")));
        _ret._node = _node;
        return _ret;
    };



    /**
     * 暴露API, 类似于jQuery的$, 但这里只是做nej的
     * 原有API做同名封装,并且只提供dom相关的接口,使用时请参考nej的文档
     * @api {nej.e._$}
     * @param  {} _node [description]
     * @return {[type]}
     */
    var _$ = _e._$ = function(_selector, _context){
        var _res = new _Node(_selector, _context);//
        return _res._node ? _res : null;
    }
    /**
     * _Node 扩展的钩子
     * @return {[type]}
     */
    _$._hooks = [_linkList];
    _$.fn = _Node.prototype;
    _$._$implement = _implement._$bind2(_$);

    _$._$implement({
        _$get:function(){
            return this._node
        }
    },{onHook:true})

    /**
     * @param  {[type]} _node [description]
     * @return {[type]}
     */
    var _$$ = _e._$$ = function(_selector, _context){
       return new _NodeList(_selector, _context);
    }
    _$$._$implement= _implement._$bind(_$$);
    _$$.fn = _NodeList.prototype;

    /**
     * TODO: 方法扩展
     */
    _$$._$implement({
        _$len:function(){
            return this._nodeList.length
        },
        _$get:function(_index){
            return typeof index !== "number" ?
                _slice.call(this._nodeList) : this._nodeList[_index]
        }
        // TODO ............................
    })


    /**
     * TransPort NEJ Methods
     * =================================================
     * 移植，由于没有更好的方法判断是否是可以与node 
     * 这里采用人肉列出方法名的方式, 并将这些方法移入_$()中
     */

    /**
     * 可以扩展的接口列表
     * @type {Object}
     */
    var _acceptList = {
        "e" : [//class相关
            "addClassName", "delClassName", "hasClassName", "replaceClassName", "toggle",// class相关
            //css相关
            "setStyle", "getStyle","css3d", "style", "offset", "getScrollViewPort", 
            // 动画 特效 UI
            "fixed", "effect", "fade", "focus", "highlight", "hover", "page", "placeholder", "tab", "wrapInline",
            // 属性相关
            "attr", "dataset",
            // 节点
            "remove", "removeByEC",
            // // 杂项
            "dom2xml","bindClearAction","bindCopyAction", "counter"],
            // event相关
        "v" : ["addEvent", "clearEvent", "delEvent", "dispatchEvent"],
            // util
        "u" : ["dom2object"]
    }

    /**
     * 打印API移植列表
     * @return {String}
     */
    _$.toString = _$$.toString =  (function(){
        var _str = "支持列表:";
        _u._$forIn(_acceptList,function(_list, _name){
            _str += [""].concat(_list).join("\nnej."+_name+"._$");
        });
        return function(){
            return _str
        }
    })();

    /**
     * 根据返回类型决定返回this，还是别的什么
     * @param  {Mix} _result     
     * @param  {String} _methodName 当前方法名
     * @return {Mix}
     */
    var _getNextAction = function(_result, _methodName, _instance){
        return (_result === _e || _result === _v)? this: _result
    }
    /**
     * 从宿主中转移一个函数, 这里采用后置判断, 要使用就要至少保证调用时 
     * 宿主中存在这个函数
     * @param  {Object} _host 如nej.e
     * @param  {String} _name 方法名
     * @return {Function}
     */
    var _exportInstanceMethod = function(_hostMethod, _name, _host){
        return function(){
            var _args = _slice.call(arguments),
                _node = this._node;

            _args.unshift(_node);
            //直接抛错    
            if(!_node) throw Error("节点包装类中已经没有节点");
            if(typeof _host[_name] !== "function") throw Error(_name + "方法不存在,或没有引入依赖")

            var _result = _hostMethod.apply(_host, _args);
            return _getNextAction.call(this, _result, _name)
        }
    }

    /**
     * 移植nej接口
     * @param  {[type]} proto [description]
     * @return {[type]}
     */
    !function _transport(_acceptList){
        _u._$forIn(_acceptList,function(_list, _name){

            var _host = _("nej."+_name);
            _u._$forEach(_list, function(_raw){

                var _methodName = "_$" + _raw,
                    _instanceMethod = _exportInstanceMethod(_host[_methodName], _methodName, _host);

                _$._$implement(_methodName, _instanceMethod);
            });
        });
    }(_acceptList);
}
define('{lib}util/query/chainable.js', [
    '{lib}util/query/query.js',
    '{lib}base/element.js',
    '{lib}base/util.js'
    ], f);