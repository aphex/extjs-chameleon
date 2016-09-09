Ext.define('Chameleon.view.main.Main', {
    extend: 'Ext.Panel',
    xtype: 'app-main',

    requires: [
        'Chameleon.view.main.MainController'
    ],

    controller: 'main',
    layout: 'fit',

    title: 'Chameleon',

    items: [
        {
            xtype: 'carousel',
            reference: 'image-carousel',
            defaults: {
                xtype: 'image',
                style: 'transform: scale(.9);'
            },
            listeners: {
                activeitemchange: 'onCarouselActiveItemChange'
            }
        },
        {
            xtype: 'button',
            ui: 'fab',
            right: 16,
            bottom: 16,
            iconCls: 'md-icon-add'
        }
    ]
});
