Ext.Loader.setConfig({enabled: true, disableCaching: false});
Ext.Loader.setPath('Ext.ux.exporter', 'extjs/src/ux');

window.all_roles = [
    {id: '0001', name: '管理员'},
    {id: '0002', name: '查看全部'},
    {id: '0003', name: '仓库用户'},
    {id: '0004', name: '仓库管理'},
    {id: '0005', name: '财务管理'}
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