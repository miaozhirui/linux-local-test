var skins;
(function (skins) {
    var simple;
    (function (simple) {
        var VSliderThumbSkin = (function (_super) {
            __extends(VSliderThumbSkin, _super);
            function VSliderThumbSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.__4_i()];
                this.states = [
                    new egret.gui.State("up", []),
                    new egret.gui.State("down", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            var d = __define,c=VSliderThumbSkin;p=c.prototype;
            p.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["percentHeight", "source", "percentWidth"], [100, "vslider_thumb_png", 100]);
                return t;
            };
            return VSliderThumbSkin;
        })(egret.gui.Skin);
        simple.VSliderThumbSkin = VSliderThumbSkin;
        egret.registerClass(VSliderThumbSkin,"skins.simple.VSliderThumbSkin");
    })(simple = skins.simple || (skins.simple = {}));
})(skins || (skins = {}));
//# sourceMappingURL=VSliderThumbSkin.g.js.map