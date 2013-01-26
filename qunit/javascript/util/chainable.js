var perfTest = function(fn, args, host ){
    var date =  +new Date()
    fn.apply(host, (args||[]))
    console.log(+new Date - date)
}
var f = function() {
        module("chainable");

        var _ = NEJ.P,
            _e = _('nej.e'),
            _u = _("nej.u"),
            _v = _("nej.v"),
            $ = _('nej.$');


        test('NodeList initialize', function() {

            // 正常千万别这么写
            var _res = $("#chainable li:nth-child(2n+1)"),
                _len = nes.all("#chainable li:nth-child(2n+1)").length;

            equal($("#chainable li:nth-child(2n+1)").length, _len, "数量与节点数量一致")

            equal($("").length, 0, "可以传入不合法参数，返回空_NodeList对象");
            equal($(nes.all("#chainable"))[0], $("#chainable")[0], "可以直接传入节点数组");
            equal($(nes.one("#chainable"))[0], nes.one("#chainable"), "可以直接传入单节点")
            var _node = $("#chainable")
            notEqual(_node, $(_node), "重新包装会返回新对象")

            deepEqual($("#chainable li:nth-child(2n+1)")._$get(), nes.all("#chainable li:nth-child(2n+1)"), "_$get返回真实数组")
            deepEqual($("#chainable li:nth-child(2n+1)")._$get(1), nes.all("#chainable li:nth-child(2n+1)")[1], "传入下标，_$get返回数组中的值")
        })

        test('NodeList implement', function() {
            var fn1 = function() {
                    return "fn1"
                }
            var fn2 = function() {
                    return "fn2"
                }
            var fn3 = function() {
                    return "fn3"
                }
            $._$implement("_$test1", fn1)
            deepEqual($()._$test1, fn1)
            $._$implement({
                "fn2": fn2,
                "fn3": fn3
            })
            deepEqual($().fn2, fn2, "也可以传入对象数组")

            // 2. 静态方法的 implement
            // no return static
            var staticFn = function(_node) {
                    _e._$setStyle(_node, "height", "40px");
                    return _e
                }
                // get static
            var staticFn2 = function(_node) {
                    return 20
                }

            $._$implement("sfn1", staticFn, {
                static: true
            })
            $._$implement("sfn2", staticFn2, {
                static: true
            })

            var _list = $("#chainable li")
            equal(_list.sfn1(), _list, "set型方法可链式");
            var _notAll = false
            _u._$forEach(_list, function(_node) {
                if (_e._$getStyle(_node, "height") !== "40px") _notAll = true
            })

            ok(_notAll === false, "所有的节点都被影响了")

            equal(_list.sfn2(), 20, "set型方法不可链式，且有返回值");
        })
        

        module("NEJ 方法merge")

        test("nej方法merge", function(){
             var _list =  [//class相关
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
            "dom2xml","bindClearAction","bindCopyAction", "counter","addEvent", "clearEvent", "delEvent", "dispatchEvent"]
            var _node = $("body"), num= 0;
            _u._$forEach(_list, function(_name){
                if(typeof _node["_$" + _name] === "function"){
                    num++
                }
            })
            equal(num, _list.length, "全部方法merge")
        })

        module("API: base")
        test("_$fiter、_$map、_$forEach", function() {
            deepEqual(nes.all("#chainable li:nth-child(even)"), $("#chainable li")._$filter(":nth-child(even)")._$get(), "fitler 可传入 选择器")
            var _res = $("#chainable li")._$filter(function(_node, _index) {
                return _index % 2 === 0; // 注意下表是从0开始
            })._$get();

            deepEqual(nes.all("#chainable li:nth-child(odd)"), _res, "fitler 可以传入 函数")

            var _res2 = $("#chainable li")._$map(function(_node){
                return _node
            })
            deepEqual(nes.all("#chainable li:nth-child(odd)"), _res, "fitler 可以传入 函数");
        })
        module("API: 遍历")
        test("_$prev、_$next、_$parent、_$children ", function() {
           var _res = $("#chainable li")._$next(":nth-child(odd)", true)._$get();
           deepEqual(_res, nes.all("#chainable li ~ :nth-child(odd)"), "_$next all 成功返回")

           var _res = $("#chainable-footer")._$prev(true)._$get();
           $._$uniqueSort(_res) // 不保证是有序的
           deepEqual(_res, nes.all("#chainable-header, #chainable-body"), "_$prev all 成功返回")
           var _res = $("#chainable-footer")._$prev()._$get();
           deepEqual(_res, nes.all("#chainable-body"), "_$prev single 成功返回")

           var _res = $("#chainable-header")._$next(true)._$get();
           deepEqual(_res, nes.all("#chainable-body, #chainable-footer"), "_$next all 成功返回")
           var _res = $("#chainable-header")._$next()._$get();
           deepEqual(_res, nes.all("#chainable-body"), "_$next single 成功返回")

           var _parent = $('#chainable li')._$parent("ul", true)._$get();
           deepEqual(_parent, nes.all("#chainable ul"), "_$parent all 成功返回")

           var _parent = $('#chainable li')._$parent("ul,div", true)._$sort()._$get();
           deepEqual(_parent, nes.all("#chainable ul, #chainable, #chainable-header"), "_$parent all 成功返回")

           var _parent = $('#chainable li')._$parent("ul, div")._$get();

           // 全部兄弟元素
           var _siblings = $("#chainable li:last-child")._$siblings("li")._$sort()._$get();

           deepEqual(_siblings,nes.all("#chainable li:not(:last-child)"), "siblings会选择所有满足选择器的兄弟节点(但不包括li)");



           var _children = $("#chain2")._$children("ul.u1, ul.u2")._$get()
           deepEqual(_children, nes.all("#chain2 > ul"), "可以取到直接子节点");

           var _children = $("#chain2")._$children("li:first-child")._$get()
           deepEqual(_children, [], "不会查找非直接子节点")

           // 加all 参数 使用全体子节点查找
           var _children = $("#chain2")._$children("li:first-child", true)._$get()
           deepEqual(_children, nes.all("li:first-child", nes.one("#chain2")))
        })
        test("Events: base _$on, $off, $trigger", function() {
            var _locals = {"0":0}
            var _handle1 = function(e){_locals[0]++;}//每次递增1
            var _handleForMultEvents = function(){_locals[1] == (_locals[1]||0)+1;}
            // 可以
            var $node = $("#chainable");
            var $node2 = $("#chain2");
            var _uid = $._$uid($node[0]);

            // step 1 确保 原有调用方式不错
            $node._$on("click", _handle1)
            equal($._delegateHandlers[_uid], undefined, "不使用事件代理，不会保存handler")
            $node._$trigger("click");
            equal(_locals[0],1, "被正确触发")
            $node._$off("click",_handle1);
            $node._$trigger("click")
            equal(_locals[0],1, "不再被触发，因为已经解除绑定")

            var _prev = _locals[0]
            $node._$on(["click","mouseover", "mouseout"], _handle1)
            // $node._$trigger("click")
            $node._$trigger(["click", "mouseover"])
            equal(_locals[0],_prev+2, "可以使用数组绑定多个事件, 并且可以trigger多个事件")
            var _prev = _locals[0];
            $node._$off(["click","mouseover"])
            $node._$trigger(["click","mouseover"])
            equal(_locals[0],_prev, "click, mouseover, 无法触发因为都被解绑了")
            $node._$trigger("mouseout",{hello:1})
            equal(_locals[0],_prev+1, "mouseout仍然存")
            $node._$off()
            $node._$trigger(["mouseout","click","mouseover"])
            equal(_locals[0],_prev+1, "所有事件都被取消")

            var _prev = _locals[0]
        })

        test("Events: delegate enhance", function(){
            expect(0)
            // //@UI: TEST, 点击一次后移除
            // $($node)._$on("click", "li:nth-child(3n)", function(){
            //     alert("触发li:nth-child(3n) click, 再次点击不再触发")
            //     $node._$off("click", "li:nth-child(3n)")
            // });
            // // @ui: 事件
            // $node._$on("mouseover mouseout","li:nth-child(5n)", function(_e){
            //     this._trigger = !this._trigger
            //     if(this._trigger){
            //         $(this)._$style({
            //             "border":"3px dotted #333"
            //         })._$text("可以通过mouseover或者mousedown,li:nth-child(5n)")
            //     }else{
            //         $(this)._$setstyle("border", "none");
            //     }
            // })
            // var _id = 0;
            // var _tmphandle = function(){
            //     $(this)._$text(_id++)
            // }
            // $node._$on("mouseover mouseout","li",_tmphandle)             // 也可以解除单个选择器的绑定绑定
            // $node._$off("mouseover mouseout","li", _tmphandle)

            // // 甚至你可以这样

            // $node._$on({
            //     "mouseout mouseover":function(){
            //         $(this)._$text("多重+数组赋值mouse")
            //     },
            //     "click":function(){
            //         $(this)._$text("多重+数组赋值click")
            //     }
            // })
        })

        test("_$insert、_$insert2、_$bottom...等",function(){

        })

        test("链式操作", function(){
            // 获取 奇数行的代码 设置样式
            var _ret = $("#chainable li:nth-child(odd)")._$style({
                    "background":"#cca",
                    "cursor":"pointer"
                // 给他们绑定hover效果
                })._$hover()
            // 然后抛弃他们 找他们的下一个位置条件满足是4倍数的兄弟节点
            ._$next(":nth-child(2n)")._$style({
                    "background":"#a19",
                    "cursor":"help"
                })
            // 过滤出其中是4倍数的行
            ._$filter(":nth-child(4n)")
                ._$on("click", function(_e){
                    var _target = _e.target || _e.srcElement;
                    $(_target)._$setStyle("background", "#111");
                // hover 样式
                })
            // 找到这些行的第2个 包装 设置边框
            ._$get(1, true)
                ._$setStyle("border", "3px solid #222")
            // 找到父节点div并且有chainable的id并且设置边框
            ._$parent("div#chainable")
                ._$setStyle("border", "9px solid #1ff")
                ._$attr("id");

            equal(_ret,"chainable"," 链式操作成功，并且getter返回值成功")
        })


    }
define('{pro}util/chainable.js', ['{lib}util/chain/chainable.js'], f);