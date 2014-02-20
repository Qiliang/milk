Ext.define('invoicing.controller.TreeMenu', {
        extend: 'Ext.app.Controller',

        views: ['TreeMenu', 'Goods', 'Surplus','Users'],

        init: function () {
            this.control({
                'treemenu': {
                    itemclick: this.onItemclick
                }
            });
        },

        onItemclick: function (widget, record, item, index, e, eOpts) {
            var me = this;
            var tabpanel = widget.up('viewport').down('tabpanel');
            var cmp;
            if (item.textContent == '货品信息') {
                cmp = this.getPanel(tabpanel, '货品信息', 'goods');
            } else if (item.textContent == '学校信息') {
                cmp = this.getPanel(tabpanel, '学校信息', 'shop');
            } else if (item.textContent == '送货人信息') {
                cmp = this.getPanel(tabpanel, '送货人信息', 'proxy');
            } else if (item.textContent == '送货人入账') {
                cmp = this.getPanel(tabpanel, '送货人入账', 'proxyin');
            } else if (item.textContent == '入库登记') {
                cmp = this.getPanel(tabpanel, '入库登记', 'in');
            } else if (item.textContent == '出库登记') {
                cmp = this.getPanel(tabpanel, '出库登记', 'out');
            } else if (item.textContent == '库存') {
                cmp = this.getPanel(tabpanel, '库存', 'stock');
            } else if (item.textContent == '库存余额表') {
                Ext.create('invoicing.store.Shop').load({
                    callback: function (records) {
                        cmp = me.getPanel(tabpanel, '库存余额表', 'surplus', records);
                    }
                });
            } else if (item.textContent == '用户管理') {
                cmp = this.getPanel(tabpanel, '用户管理', 'users');
            }
        },

        getPanel: function (tabpanel, title, xtype, options) {
            var cmp = tabpanel.items.filterBy(function (item, key) {
                return item.title == title;
            }).first();
            if (!cmp)
                cmp = tabpanel.add({title: title, closable: true, xtype: xtype, options: options});
            tabpanel.setActiveTab(cmp);
            return cmp;
        }
    }
);