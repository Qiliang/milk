/**
 * @class Ext.ux.Exporter
 * @author Ed Spencer (http://edspencer.net), with modifications from iwiznia.
 * Class providing a common way of downloading data in .xls or .csv format
 */
Ext.define("Ext.ux.exporter.Exporter", {
    uses: [
        "Ext.ux.exporter.Base64",
        "Ext.ux.exporter.csvFormatter.CsvFormatter",
        "Ext.ux.exporter.excelFormatter.ExcelFormatter"
    ],

    statics: {
        exportAny: function (component, formatter, title) {
            var func = "export";
            if (!component.is) {
                func = func + "Store";
            } else if (component.is("gridpanel")) {
                func = func + "Grid";
            } else if (component.is("treepanel")) {
                func = func + "Tree";
            } else {
                func = func + "Store";
                component = component.getStore();
            }

            return this[func](component, formatter, title);
        },

        exportGrid: function (grid, formatter, title, group) {
            formatter = this.getFormatterByName(formatter);
            var columns = Ext.Array.filter(grid.columns, function (col) {
                return !col.hidden && (!col.xtype || col.xtype != "actioncolumn");
            });
            var config = {
                title: grid.title ? grid.title : title,
                columns: columns,
                group: group
            };
            return formatter.format(grid.store, config);
        },

        exportStore: function (store, formatter, title) {
            formatter = this.getFormatterByName(formatter);
            var config = {
                title: title,
                columns: store.fields ? store.fields.items : store.model.prototype.fields.items
            }
            return formatter.format(store, config);
        },

        exportTree: function (tree, formatter, title) {
            formatter = this.getFormatterByName(formatter);
            var store = tree.store;
            var config = {
                title: tree.title ? tree.title : title
            }
            return formatter.format(store, config);
        },

        getFormatterByName: function (formatter) {
            formatter = formatter ? formatter : "excel";
            formatter = !Ext.isString(formatter) ? formatter : Ext.create("Ext.ux.exporter." + formatter + "Formatter." + Ext.String.capitalize(formatter) + "Formatter");
            return formatter;
        }
    }
});