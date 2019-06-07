// Enum Editor (used for objects and arrays with enumerated values)
JSONEditor.defaults.editors['sortable_list'] = JSONEditor.AbstractEditor.extend({


    initItems: function() {
        this.items = 'items' in this.options.schema && Array.isArray(this.options.schema.items) ? this.options.schema.items : [];
        this.items_index = {};
        for (var i = 0; i < this.items.length; i++) {
            this.items_index[this.items[i]] = $('<li class="list-group-item">' + this.items[i] + '</li>');
        }
    },

    resetItems: function() {
        for (var i = 0; i < this.items.length; i++) {
            this.lists.src.el.append(this.items_index[this.items[i]]);
        }
    },

    setValue: function(value) {
        if (!Array.isArray(value)) value = [value];
        var serialized = JSON.stringify(value);
        if (serialized === this.serialized) return;
        this.serialized = serialized;
        this.value = value;

        this.resetItems();
        for (var i = 0; i < this.value.length; i++) {
            var item = this.items_index[this.value[i]];
            if (item) {
                this.lists.dst.el.append(item);
            }
        }
        this.onChange();
    },

    refreshValue: function () {
        this._super();
        var value = [];
        this.lists.dst.el.find('li').each(function () {
            value.push(this.innerHTML);
        });
        var serialized = JSON.stringify(value);
        if (serialized === this.serialized) return;
        this.serialized = serialized;
        this.value = value;
        this.onChange(true);
    },


    build: function() {
        this.id = this.path.replace(/\./g, '-');

        var container = this.container;
        this.title = this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
        this.container.appendChild(this.title);

        // Display area
        this.display_area = this.theme.getIndentedPanel();
        this.container.appendChild(this.display_area);

        if (this.options.hide_display) this.display_area.style.display = 'none';

        this.lists = {
            src: {
                id: 'sortable-list-src-' + this.id
            },
            dst: {
                id: 'sortable-list-dst-' + this.id
            }
        };
        var el = $('\
            <div class="row">\
                <div class="col-xs-6">\
                    Available items\
                    <ul class="list-group sortable-list" id="' + this.lists.src.id + '"></ul>\
                </div>\
                <div class="col-xs-6">\
                    Selected items\
                    <ul class="list-group sortable-list" id="' + this.lists.dst.id + '"></ul>\
                </div>\
            </div>\
        ');
        var lists = el.find('ul');
        this.lists.src.el = $(lists[0]);
        this.lists.dst.el = $(lists[1]);

        this.initItems();
        this.resetItems();

        $(this.display_area).append(el);

        var self = this;
        this.lists.src.el
            .sortable({
                connectWith: '#' + this.lists.dst.id,
                receive: function(e, ui) {
                    self.refreshValue();
                }
            })
            .disableSelection();

        this.lists.dst.el
            .sortable({
                connectWith: '#' + this.lists.src.id,
                receive: function(e, ui) {
                    self.refreshValue();
                },
                stop: function (e, ui) {
                    self.refreshValue();
                }
            })
            .disableSelection();
    },

    enable: function() {
        this.lists.src.el.sortable('enable');
        this.lists.dst.el.sortable('enable');
        this._super();
    },

    disable: function() {
        this.lists.src.el.sortable('disable');
        this.lists.dst.el.sortable('disable');
        this._super();
    },

    destroy: function() {
        this.lists.src.el.sortable('destroy');
        this.lists.dst.el.sortable('destroy');
        this._super();
    }
});