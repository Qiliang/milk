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

        this.root = {
            expanded: true,
            children: [
                {text: '基本配置', children: [
                    {id: 'goods', text: "货品信息", leaf: true },
                    {id: 'shop', text: "学校信息", leaf: true },
                    {id: 'proxy', text: "送货人信息", leaf: true },
                    {id: 'users', text: "用户管理", leaf: true }
                ]},

                {text: '分仓', children: [
                    {id: 'depot', text: "分仓信息", leaf: true },
                    {id: 'depotin', text: "分仓入库", leaf: true },
                    {id: 'depotout', text: "分仓出库", leaf: true },
                    {id: 'depotreport', text: "分仓报表", leaf: true }
                ]},

                {id: 'proxyin', text: "送货人入账", leaf: true },
                { id: 'stock', text: "库存", leaf: true },
                {id: 'in', text: "总仓入库", leaf: true },
                {id: 'out', text: "总仓出库", leaf: true },
                {id: 'proxyreport', text: "送货人报表", leaf: true}
            ]
        }

//        if (!window.capability('0001') && !window.capability('0002')) {
//            this.root.children.splice(0, 1);
//        }
//        if (!window.capability('0001') && !window.capability('0002')) {
//            this.root.children.splice(0, 1);
//        }


        this.callParent(arguments);
    }


})
;