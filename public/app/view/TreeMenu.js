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
        if (window.capability('0001')) {
            items.push({id: 'goods', text: "货品信息", leaf: true });
            items.push({id: 'shop', text: "学校信息", leaf: true });
            items.push({ id: 'proxy', text: "送货人信息", leaf: true });
            items.push({id: 'proxyin', text: "送货人入账", leaf: true });
            items.push({ id: 'stock', text: "库存", leaf: true });
            items.push({id: 'in', text: "入库登记", leaf: true });
            items.push({id: 'out', text: "出库登记", leaf: true });
            items.push({id: 'proxyreport', text: "送货人报表", leaf: true });
            items.push({id: 'users', text: "用户管理", leaf: true });
        } else {
            items.push({ id: 'stock', text: "库存", leaf: true });
            items.push({id: 'in', text: "入库登记", leaf: true });
            items.push({id: 'out', text: "出库登记", leaf: true });
        }


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