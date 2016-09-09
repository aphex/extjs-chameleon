Ext.define('Chameleon.store.Image', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'url', type: 'string'}
    ],
    // Images all from https://www.pexels.com
    data: [
        {
            url: './resources/images/beach.jpg'
        },
        {
            url: './resources/images/berries.jpg'
        },
        {
            url: './resources/images/wall.jpg'
        },
        {
            url: './resources/images/desk.jpg'
        },
        {
            url: './resources/images/flower.jpg'
        },
        {
            url: './resources/images/night-sky.jpg'
        },
        {
            url: './resources/images/sunset.jpg'
        }
    ],
    autoLoad: true
});
