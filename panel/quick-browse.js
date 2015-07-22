Editor.registerPanel( 'quick-browse.panel', {
    is: 'quick-browse',

    listeners: {
        'keydown': '_onKeyDown',
    },

    properties: {
        metaType: {
            type: String,
            value: '',
        },

        filterText: {
            type: String,
            value: '',
            notify: true,
        },

        assetsList: {
            type: Array,
            value: function () {
                return [];
            }
        },

        selected: {
            type: String,
            value: '',
        },

        selectedItem: {
            type: Object,
            value: null,
        }
    },

    ready: function () {
        Editor.assetdb.queryAssets('assets://**/*', this.metaType, function(list) {
            this.assetsList = list;
            this.assetsList.map(function(assets) {
                var thumbnail = '';
                if (assets.type === 'texture') {
                    thumbnail = 'uuid://' + assets.uuid + '?thumbnail';
                }
                else {
                    var metaCtor = Editor.metas[assets.type];
                    thumbnail = metaCtor['meta-icon'];
                }
                assets.thumb = thumbnail;
            });
        }.bind(this));
    },

    applyFilter: function (assetsList,filterText) {
        var filterAssets = [];
        var filter = new RegExp(filterText.toLowerCase());
        for (var item in assetsList) {
            if (filter.exec((assetsList[item].name + assetsList[item].extname).toLowerCase())){
                filterAssets.push(assetsList[item]);
            }
        }
        return filterAssets;
    },

    _onKeyDown: function (event) {
        // press enter
        if (event.which === 13) {
            event.stopPropagation();
            event.preventDefault();
            this.confirm();
        }
        // press up
        else if (event.which === 38) {
            event.stopPropagation();
            event.preventDefault();
            this._selected('up');
        }
        // press down
        else if (event.which === 40) {
            event.stopPropagation();
            event.preventDefault();

            this._selected('down');
        }
    },

    _selected: function (argv) {
        if (typeof(argv) === 'object') {
            if (this.selectedItem) {
                this.selectedItem.removeAttribute('selected');
            }

            this.selectedItem = argv;
        }
        else {
            if (!this.selectedItem) {
                this.selectedItem = this.$.items.children[0];
            }
            else {
                this.selectedItem.removeAttribute('selected');
                var previous = this.selectedItem.previousElementSibling;
                var next = this.selectedItem.nextElementSibling;
                if (argv === 'up') {
                    if (previous && previous.tagName === 'LI') {
                        this.selectedItem = previous;
                        if ( this.selectedItem.offsetTop <= this.$.view.scrollTop + 40 ) {
                            this.$.view.scrollTop = this.selectedItem.offsetTop - 40;
                        }
                    }
                }
                else if (argv === 'down') {
                    if (next && next.tagName === 'LI') {
                        this.selectedItem = next;
                        var contentHeight = this.$.view.getBoundingClientRect().height;
                        if ( this.selectedItem.offsetTop + 20 >= this.$.view.scrollTop + contentHeight ) {
                            this.$.view.scrollTop = this.selectedItem.offsetTop + 20 - contentHeight;
                        }
                    }
                }
            }
        }
        this.selected = this.selectedItem.getAttribute('uuid');
        this.selectedItem.setAttribute('selected','');
    },

    _onItemClick: function (event) {
        event.stopPropagation();

        this._selected(event.srcElement);
    },

    confirm: function () {
        // TODO: 获取 this.selectedItem
        Editor.log("uuid:" + this.selected);
    },

    _onDblClick: function (event) {
        event.stopPropagation();
        this.confirm();
    },
});
