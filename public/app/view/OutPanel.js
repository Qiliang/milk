Ext.define('invoicing.view.OutPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.outpanel',

    autoScroll: true,
    bodyPadding: 5,
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        this.store = Ext.create('Ext.data.Store', {
            model: 'invoicing.model.Good',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: '/goods'
            }
        });
        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        Ext.apply(this, {
            plugins: [this.cellEditing],
            columns: [
                {
                    header: '编号',
                    dataIndex: 'id',
                    flex: 1
                },
                {
                    header: '名称',
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    header: '规格',
                    dataIndex: 'spec',
                    flex: 1
                },
                {
                    header: '单位',
                    dataIndex: 'unit',
                    flex: 1
                },
                {
                    header: '数量',
                    flex: 1,
                    dataIndex: 'count',
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true,
                        minValue: 1,
                        maxValue: 100000
                    }
                }
            ],
            tbar: [
                {
                    fieldLabel: '送货人',
                    name: 'proxy_name',
                    xtype: 'combo',
                    allowBlank: false,
                    typeAhead: true,
                    triggerAction: 'all',
                    displayField: 'name',
                    valueField: 'name',
                    forceSelection: true,
                    store: Ext.create('invoicing.store.Proxies')
                },
                {
                    fieldLabel: '学校名称',
                    name: 'shop_name',
                    xtype: 'combo',
                    allowBlank: false,
                    typeAhead: true,
                    triggerAction: 'all',
                    displayField: 'name',
                    valueField: 'name',
                    forceSelection: true,
                    store: Ext.create('invoicing.store.Shop')
                },
                {
                    xtype: 'datefield',
                    allowBlank: false,
                    anchor: '100%',
                    value: new Date(),
                    fieldLabel: '出库日期',
                    name: 'create_at',
                    format: 'Y-m-d'
                }
            ],
            fbar: [
                {
                    text: '保存',
                    scope: this,
                    handler: this.onSave
                }
            ]
        });

        this.callParent();
    },

    onSave: function () {
        var me = this;
        var create_at = this.down('toolbar').down('datefield[name=create_at]').value;
        var shop_name = this.down('toolbar').down('combo[name=shop_name]').value;
        var proxy_name = this.down('toolbar').down('combo[name=proxy_name]').value;
        if (!create_at || !shop_name || !proxy_name) {
            Ext.Msg.show({
                title: '提示',
                msg: '请选择送货人、日期和学校',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        var recs = [];
        me.getStore().each(function (rec) {
            if (!rec.get('count'))return;
            recs.push({
                'good_id': rec.get('id'),
                'count': rec.get('count'),
                'shop_name': shop_name,
                'proxy': proxy_name,
                'create_at': create_at
            });
        });
        me.source.add(recs);
        me.up('window').close();
    }
})