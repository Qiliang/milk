Ext.define('invoicing.controller.Main', {
    extend: 'Ext.app.Controller',

    stores: window.ext_stores,
    refs: [
        {
            ref: 'treemenu',
            selector: 'treemenu'
        },
        {
            ref: 'contentPanel',
            selector: '#contentPanel'
        }
    ],

    init: function () {
        this.control({
            'treemenu': {
                selectionchange: this.onItemclick
            }
        });
    },

    onItemclick: function (selModel, records) {
        var me = this;
        var record = records[0],
            text = record.get('text'),
            xtype = record.get('id'),
            options;

        var contentPanel = this.getContentPanel();
        contentPanel.removeAll(true);
        contentPanel.add({title: text, xtype: xtype, options: options});

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
});