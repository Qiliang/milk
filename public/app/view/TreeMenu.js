Ext.define('invoicing.view.TreeMenu', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treemenu',
    rootVisible: false,


    tools: [
        {
            type: 'refresh',
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
            items.push({ text: "货品信息", leaf: true });
        if (window.capability('2-1'))
            items.push({ text: "学校信息", leaf: true });
        if (window.capability('2-1'))
            items.push({ text: "送货人信息", leaf: true });
        if (window.capability('2-1'))
            items.push({ text: "送货人入账", leaf: true });
        if (window.capability('3-1'))
            items.push({ text: "库存", leaf: true });
        if (window.capability('4-1'))
            items.push({ text: "入库登记", leaf: true });
        if (window.capability('5-1'))
            items.push({ text: "出库登记", leaf: true });
        if (window.capability('6-1'))
            items.push({ text: "库存余额表", leaf: true });
        if (window.capability('6-1'))
            items.push({ text: "送货人报表", leaf: true });
        if (window.capability('999'))
            items.push({ text: "用户管理", leaf: true });

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