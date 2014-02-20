Ext.define('invoicing.view.InPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.inpanel',

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
                    header: '单价',
                    dataIndex: 'price',
                    sortable: false,
                    flex: 1,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true

                    }
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
                    xtype: 'checkbox',
                    anchor: '100%',
                    fieldLabel: '退货',
                    name: 'reject',
                    listeners: {
                        change: function (cmp, rec, index) {
                            if (cmp.value)
                                cmp.nextSibling('combo').enable();
                            else
                                cmp.nextSibling('combo').disable();
                        }
                    }
                },
                {
                    fieldLabel: '学校名称',
                    name: 'shop_name',
                    xtype: 'combo',
                    disabled: true,
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
                    fieldLabel: '入库时间',
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
        var reject = this.down('toolbar').down('checkbox[name=reject]').value;
        var shop_name = this.down('toolbar').down('combo[name=shop_name]').value;
        var recs = [];
        var comment = '';
        me.getStore().each(function (rec) {
                if (!rec.get('count'))return;
                if (reject) comment = '退货:' + shop_name;
                recs.push({
                    'good_id': rec.get('id'),
                    'count': rec.get('count'),
                    'remainder': rec.get('remainder'),
                    'price': rec.get('price'),
                    'comment': comment,
                    'create_at': create_at
                })
            }
        )
        ;
        me.source.add(recs);
        me.up('window').close();
    }
})