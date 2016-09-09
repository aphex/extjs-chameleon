Ext.define('Chameleon.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'Chameleon.store.Image',
        'Ext.theme.Material'
    ],

    init: function() {
        var me = this, colors, hex;

        if (!me._image) {
            me._image = new Image();
        }

        if (!me._imageStore) {
            me._imageStore = Ext.create('Chameleon.store.Image');
            me._imageStore.on('load', me.onImagesLoaded, me);
        }

        if (!me._materialColors) {
            me._materialColors = [];
            colors = Ext.theme.Material.getColors();

            Ext.Object.each(colors, function(color) {
                hex = colors[color]['500'];
                me._materialColors.push({
                    name: color,
                    hex: hex,
                    rgb: me.hexToRGB(hex)
                });
            });
        }

        me._imageStore.load();
    },

    onImagesLoaded: function() {
        var carousel = this.lookup('image-carousel'),
            data = this._imageStore.getProxy().getReader().rawData, items = [];

        items = Ext.Array.map(data, function(value) {
            return {
                src: value.url
            }
        });

        carousel.setItems(items);
        carousel.setActiveItem(0);
    },

    onCarouselActiveItemChange: function(carousel, newItem, oldItem) {
        var src;
        if (newItem && newItem.getSrc) {
            src = newItem.getSrc();
            this.updateUIFromImage(src);
        }
    },

    updateUIFromImage: function(src) {
        var me = this,
            meta = Ext.getHead().first('meta[name=theme-color]'),
            vibrant, swatches, baseColor, accentColor, nearestBaseColor, nearestAccentColor;

        me._image.onload = function() {
            vibrant = new Vibrant(me._image);
            swatches = vibrant.swatches();

            baseColor = swatches.Vibrant || swatches.DarkVibrant;
            accentColor = swatches.LightVibrant || swatches.DarkVibrant;

            if (baseColor && accentColor) {
                nearestBaseColor = me.findNearestMaterialColor(baseColor.rgb);
                nearestAccentColor = me.findNearestMaterialColor(accentColor.rgb, ['grey']);

                if (Fashion && Fashion.css) {
                    Ext.getBody().addCls('chameleon');

                    Fashion.css.setVariables({
                        'base-color-name': nearestBaseColor.name,
                        'accent-color-name': nearestAccentColor.name
                    });

                    clearTimeout(this._deferID);
                    this._deferID = Ext.defer(function() {
                        Ext.getBody().removeCls('chameleon');
                    }, 2000);

                    if (meta) {
                        meta.dom.setAttribute('content', nearestBaseColor.hex);
                    }
                }
            }
            src.onload = null;
        }

        me._image.src = src;
    },

    hexToRGB: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    },

    findNearestMaterialColor: function(rgb, exclude) {
        var distance,
            minDistance = Infinity,
            materialRGB,
            name, nearestColor, i;

        exclude = exclude || [];
        for (i = 0; i < this._materialColors.length; ++i) {
            if (exclude.indexOf(name) === -1) {
                materialRGB = this._materialColors[i].rgb;

                distance = Math.sqrt(
                    Math.pow(rgb[0] - materialRGB[0], 2) +
                    Math.pow(rgb[1] - materialRGB[1], 2) +
                    Math.pow(rgb[2] - materialRGB[2], 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestColor = this._materialColors[i];
                }
            }
        }

        return nearestColor;
    }
});
