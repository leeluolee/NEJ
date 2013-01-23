var f = function(){
    module("chainable");
    
    var _  = NEJ.P,
        _e = _('nej.e'),
        _$ = _e._$,
        _$$ = _e._$$;

        
    test('one Node chainable',function(){

       var _className = _e._$("#chainable")._$addClassName("haha")._$addClassName("haha2")._$attr("class");
       equal(_className, "haha haha2", "_className 经过链式操作被正确添加");
       var _className = _e._$("#chainable")._$delClassName("haha")._$attr("class");
       ok(_className === "haha2", "_className被正确移除");
    })


    test('NodeList chainable', function(){
        expect(2)

        // 正常千万别这么写
        var _res = _e._$$("#chainable li:nth-child(2n+1)")._$style({
                "display":"block",
                "height":"20px",
                "background":"#ccc",
                "cursor":"pointer"
            })._$addClassName("hello")._$addEvent("click",function(){
                alert(this.nodeName)
            })._$hasClassName("hello")

        deepEqual(_res[0], true, "返回true")
        equal(_e._$$("#chainable li:nth-child(2n+1)")._$len(), _res.length, "数量与节点数量一致")
    })


    test(" _$._$implement can affect _$$", function(){
        _$._$implement({
            "hello":function(){
                return "hello";
            }
        })
        ok(typeof _$$.fn["hello"] === "function", "$$拥有了hello")
        var _len = _$$("#chainable ul > li")._$len()
        equal(_$$("#chainable ul > li").hello().join(""),new Array(_len+1).join("hello"), "并且返回结果如逾期")

        _$$._$implement({
            "filter":function(_selector){
                var _len = this._$len()
                for(var _i = 0; _i < _len ; _i++){

                }
            }
        })
    })
}
module('依赖模块');
test('define',function(){
    expect(0)
    define('{pro}util/chainable.js',['{lib}util/query/chainable.js'],f);
});

  