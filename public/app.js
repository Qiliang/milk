Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.exporter', 'extjs/src/ux');

window.all_roles = [
    {id: '1-1', name: '货品信息(浏览)'},
    {id: '1-2', name: '货品信息(编辑)'},
    {id: '2-1', name: '学校信息(浏览)'},
    {id: '2-2', name: '学校信息(编辑)'},
    {id: '3-1', name: '库存(浏览)'},
    {id: '3-2', name: '库存(编辑)'},
    {id: '4-1', name: '入库信息(浏览)'},
    {id: '4-2', name: '入库信息(编辑)'},
    {id: '5-1', name: '出库信息(浏览)'},
    {id: '5-2', name: '出库信息(编辑)'},
    {id: '6-1', name: '库存余额(浏览)'},
    {id: '6-2', name: '库存余额(编辑)'},
    {id: '999', name: '用户管理'}
];
window.capability = function (id) {
    var roles = Ext.util.Cookies.get('roles').split(',');
    for (var i = 0; i < roles.length; i++) {
        if (roles[i] === id)
            return true;
    }
    return false;
}

Ext.application({
    name: 'invoicing',
    appFolder: 'app',
    requires: ['Ext.ux.exporter.Exporter'],
    views: window.ext_views,
    models: window.ext_models,
    stores: window.ext_stores,
    controllers: ['Main'],


    launch: function () {
        Ext.Ajax.addListener('beforerequest', function (conn, options, eOpts) {
            if (options.jsonData && options.jsonData.modifier === '') {
                options.jsonData.modifier = Ext.util.Cookies.get('name');
            } else if (Ext.isArray(options.jsonData)) {
                options.jsonData.forEach(function (item) {
                    if (item.modifier === '')
                        item.modifier = Ext.util.Cookies.get('name');
                });
            }
        });

        Ext.onReady(function () {
            if (!Ext.util.Cookies.get('name')) {
                var login = Ext.create('Ext.window.Window', {title: '登录', closable: false, modal: true, items: [
                    {xtype: 'login'}
                ]});
                login.on('close', function () {
                    Ext.create('invoicing.view.Viewport');
                });

                login.show();
            } else {
                Ext.create('invoicing.view.Viewport');
            }

        });
    }
})
;