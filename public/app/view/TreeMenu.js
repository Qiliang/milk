Ext.define('invoicing.view.TreeMenu', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treemenu',
    rootVisible: false,


    tools: [
        {
            type: 'gear',
            tooltip: '重新登录',
            handler: function (event, toolEl, panelHeader) {
                Ext.util.Cookies.clear('name');
                window.location.reload();
            }
        }
    ],
    initComponent: function () {

        var items = [];
        if (window.capability('1-1'))
            items.push({id: 'goods', text: "货品信息", leaf: true });
        if (window.capability('2-1'))
            items.push({id: 'shop', text: "学校信息", leaf: true });
        if (window.capability('2-1'))
            items.push({ id: 'proxy', text: "送货人信息", leaf: true });
        if (window.capability('2-1'))
            items.push({id: 'proxyin', text: "送货人入账", leaf: true });
        if (window.capability('3-1'))
            items.push({ id: 'stock', text: "库存", leaf: true });
        if (window.capability('4-1'))
            items.push({id: 'in', text: "入库登记", leaf: true });
        if (window.capability('5-1'))
            items.push({id: 'out', text: "出库登记", leaf: true });
//        if (window.capability('6-1'))
//            items.push({id: 'surplus', text: "库存余额表", leaf: true });
        if (window.capability('6-1'))
            items.push({id: 'proxyreport', text: "送货人报表", leaf: true });
        if (window.capability('999'))
            items.push({id: 'users', text: "用户管理", leaf: true });

        this.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: items
            }
        });

        this.callParent(arguments);
    }


})
;