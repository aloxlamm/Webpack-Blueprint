// PHOENIX OS
// DOMAIN OBJECT
//---------------------------------------------------------------------------------------------------------

import * as http from './HttpConnector.js';
import * as sortData from './SortData.js';

export default class DomainObject {

    constructor(config) {
        if (config.devInterceptor) {
            console.log('-> DEV INTERCEPTOR');
            console.log(config.devInterceptor);
            if (config.devInterceptor.index) {
                this._replaceIndex = config.devInterceptor.index;
            }
        }

        this._entity = config.entity;
        this._viewType = config.viewType;
        this._domainId = config.domainId;

        this._pathParams = undefined;
        if (config.pathParams) {
            this._pathParams = config.pathParams;
        }

        this._rows = 25;
        if (config.rows) {
            this._rows = config.rows;
        }
        this._start = 0;
        if (config.start) {
            this._start = config.start;
        }
        this._sort = 'transactionid_string desc';
        if (config._sort) {
            this._sort = config.sort;
        }
        this._filter = [];
        if (config.filter) {
            this._filter = config.filter;
        }
        this._query;
        if (config.query) {
            this._query = config.query;
        }

        // dummy api
        if (config.dummyApi) {
            this.is_dummy = true;
            this._dummyApi = config.dummyApi;
        }

        this._reachedEnd = false;

        this._decoration;
        this._index;
        this._createNew = false;
        if (config.createNew) {
            this._createNew = true;
        }

        this._facetQuery;

        // data
        this._parent;
        this._childrend;
        this._data = {};
    }

    getFilterParamms(params) {
        let query = '';
        let queries = [];
        if (!params) {
            params = {};
        }

        // rows
        if (params.rows) {
            this._rows = params.rows;
        }
        queries.push(['rows', this._rows]);

        // start
        queries.push(['start', this._start]);

        // filter
        if (params.filter) {
            this._filter = params.filter;
        }
        for (let i in this._filter) {
            queries.push(['filter', this._filter[i]]);
        }

        // query
        if (params.query) {
            this._query = params.query;
        }
        if (this._query) {
            queries.push(['query', this._query]);
        }

        for (let i = 0; i < queries.length; i++) {
            const q = queries[i];
            query += q[0] + '=' + q[1];
            if (i < queries.length - 1) {
                query += '&';
            }
        }
        return query;
    }

    async getDecoration() {
        let decoration;
        decoration = await http.getJson('decorate/' + this._entity + '/view?viewType=' + this._viewType);
        this._decoration = decoration;
        return decoration;
    }

    async createEmpty(uri) {
        let decoration;
        const test = await this.getDecoration();
        if (uri) {
            decoration = await http.getJson(uri, true);


        } else {
            decoration = await this.getDecoration();
        }

        decoration.items = [decoration.items];
        if (decoration) {
            for (let i in decoration.items[0]) {
                const item = decoration.items[0][i];
                item.value = '';
            }
        }
        this._data = decoration;
        this.checkEnd();
        return decoration;
    }




    async get_fullUndecorated(params) {
        let uri = this._entity;
        if (this._pathParams) {
            this._entity += '/' + this._pathParams.join('/');
        }
        if (this._domainId) {
            uri += '/' + this._domainId;
        }

        uri += '?' + this.getFilterParamms(params);
        this.lastUri = uri;
        let data = await http.getJson(uri);
        this._data = data;
        this.checkEnd();
        return data;
    }

    async get_decorated(params) {
        let uri = 'decorate/' + this._entity;
        if (this._pathParams) {
            uri += '/' + this._pathParams.join('/');
        }
        if (this._domainId) {
            uri += '/' + this._domainId;
        }
        uri += '?viewType=' + this._viewType;
        if (!this._domainId) {
            uri += '&' + this.getFilterParamms(params);
        }

        let data = await http.getJson(uri);

        // @ michele rausputzen...
        if (!data.items) {
            this._data = {
                items: data
            }
        }else {
            this._data = data;
        }


        this.checkEnd();

        return this._data;
    }

    sortDecoratedData(data) {
        const keys = Object.keys(data[0]);
        for (let i in keys) {
            const key = keys[i];
            const value = data[0][key];
        }
    }

    async get_undecorated(params) {
        let uri = this._entity;
        if (this._pathParams) {
            uri += '/' + this._pathParams.join('/');
        }
        if (this._domainId) {
            uri += '/' + this._domainId;
        }

        uri += '?' + this.getFilterParamms(params);
        this._lastUri = uri;
        let data = await http.getJson(uri);
        this._data = data
        this.checkEnd();
        return data;
    }

    async get_next() {
        let uri;
        if (this._facetQuery) {
            uri = this._facetQuery;
        } else {
            uri = this._entity;
            if (this._pathParams) {
                uri += '/' + this._pathParams.join('/');
            }
            this._start += this._rows;
            uri += '?viewType=' + this._viewType;
            uri += '&' + this.getFilterParamms({ loadNext: true });
        }
        const data = await http.getJson(uri);

        for (let i in data.items) {
            this._data.items.push(data.items[i]);
        }
        this._lastUri = uri;
        this.checkEnd();
        return data;
    }

    async get_facet(facetQuery) {
        this._facetQuery = facetQuery;
        const data = await http.getJson(facetQuery);
        this._data = data;
        this.checkEnd();
        this._lastUri = facetQuery;
        return data;
    }

    async get_empty_decorated() {
        let uri = 'decorate/' + this._entity + '/view?viewType=' + this._viewType;
        let data;
        // INTERCEPTOR
        if (this._replaceIndex) {
            data = await http.getJson(this._replaceIndex, true);
            this._replacedIndexData = data;
        }

        data = await http.getJson(uri);
        this._data = data;
        this._data.items = [data.items];
        for (let i in this._data.items) {
            this._data.items[i]['value'] = '';
        }
        return data;
    }

    async get_autocomplete(query) {
        http.abort();
        this._data = await http.getJson(query.replace('/', ''));
        return this._data;
    }

    async get_fullTextSearch(value) {
        let uri = this._entity;
        if (this._pathParams) {
            uri += '/' + this._pathParams.join('/');
        }
        uri += '?viewType=' + this._viewType;
        const textQuery = encodeURI('fulltextsearch:*' + value + '*');
        uri += '&' + this.getFilterParamms({ query: textQuery });
        const data = await http.getJson(uri);
        this._data = data;
        this.checkEnd();
        this._lastUri = uri;
        return data;
    }

    async get_reload() {
        let data = await http.getJson(this._lastUri);
        if (data.length < this._rows) {
            this._reachedEnd = true;
        }
        this._data = data
        this.checkEnd();
        return this._data;
    }

    async post_undecorated(addValues) {
        const data = this.getUndecoratedData();
        if (addValues) {
            for (let i in addValues) {
                data[0][addValues[i]['name']] = addValues[i]['value'];
            }
        }



        const response = await http.post(this._entity, JSON.stringify(data));
        return response.json();
    }

    async create(data) {
        const uri = this._entity;
        const response = await http.post(uri, JSON.stringify(data));
        return response.json();
    }

    async update(data) {
        const uri = this._entity
        await http.put(uri, JSON.stringify(data));
    }

    checkEnd() {
        if (this._data && $.isArray(this._data.items)) {
            if (this._data.items.length === this._data.matches) {
                this._reachedEnd = true;
            } else {
                this._reachedEnd = false;
            }
        }
    }

    undecorate() {
        const data = {};
        const keys = Object.keys(this._data.items[0]);
        for (let i in keys) {
            const key = keys[i];
            if (key !== 'domainId') {
                data[key] = this._data.items[0][key].value;
            } else {
                data['domainId'] = this._data.items[0][key];
            }

        }
        return data;
    }

    generateIndex() {
        this._index = {};
        let data;
        // INTERCEPTOR
        if (!this._replaceIndex) {
            data = this._data.items[0];
        } else {
            data = this._replacedIndexData.items;
        }
        const keys = Object.keys(data);
        let index = [];
        let fixedColCount = 1;
        for (let i in keys) {
            const key = keys[i];
            const value = data[key];
            var indexObj = {};

            indexObj['key'] = key;
            indexObj['index'] = parseInt(i);
            indexObj['visible'] = true;

            if (value.htmlView) {
                let label = value.htmlView.labelOfKey;

                if (!label) {
                    label = key;
                }
                indexObj['label'] = label;

                let is_fixed = false;
                if (i === '0') {
                    is_fixed = true;
                }
                indexObj['fixed'] = is_fixed;

                let sortOrder = 1000;
                if (value.htmlView.sortOrder !== undefined && value.htmlView.sortOrder !== null) {
                    sortOrder = value.htmlView.sortOrder;
                }
                indexObj['sortOrder'] = sortOrder;

                let fieldType;
                if (value.htmlView.fieldType) {
                    fieldType = value.htmlView.fieldType;
                    let subrequest;
                    if (fieldType.indexOf('dropdown_relational') !== -1) {
                        for (let i in value.htmlView.attributes) {
                            if (value.htmlView.attributes[i].key === 'subrequest') {
                                subrequest = value.htmlView.attributes[i].value
                            }
                        }
                        indexObj['subrequest_partial'] = subrequest;
                    }
                }
                indexObj['fieldType'] = fieldType;

                // push obj
                index.push(indexObj);
            }
        }

        const sortedIndex = sortData.sort(index, { sortkey: 'sortOrder', type: 'number' });
        index = [];
        for (let i in sortedIndex) {
            sortedIndex[i].colindex = parseInt(i);
            index.push(sortedIndex[i]);
        }

        this._index = {
            fixedColCount: fixedColCount,
            data: index
        }
        return index;
    }

    getIndex() {
        if (this._index) {
            return this._index;
        } else {
            return this.generateIndex();
        }
    }

    getUndecoratedData() {
        let data = [];
        for (let i in this._data.items) {
            const item = this._data.items[i];
            let this_obj = {};
            const keys = Object.keys(item);
            for (let ii in keys) {
                const key = keys[ii];
                if (key !== 'value') {
                    let value = item[key].value;
                    if (!value) {
                        value = '';
                    }


                    if (key === 'activ') {
                        if (value === '' || value === 'true') {
                            value = true;
                        } else {
                            value = false;
                        }
                    }

                    // int test michele--> 
                    if (key === 'currency' || key === 'creditLimit' || key === 'ordered' || key === 'delivered' || key === 'transactionVolume') {
                        value = 0;
                    }


                    this_obj[key] = value;
                }
            }
            data.push(this_obj);
        }
        return data;
    }

    async updateField(fieldName, value, domainId) {
        if (!domainId) {
            domainId = this._domainId;
        }
        value.toString();
        const uri = this._entity + '/' + fieldName + '/' + domainId;
        const res = await http.put(uri, value.toString());
        return res;
    }

    // TEST - DUMMY REQUESTS...
    // -------------------------------------------------------------------------

    async get_dummyDecoration(uri) {
        const decoration = await http.getJson(uri, true);
        this._decoration = decoration;
        return decoration;
    }

    async get_dummyDecorated(uri) {
        const data = await http.getJson(uri, true);
        this._data = data;
        return data;
    }

    async get_dummyUndecorated(uri) {
        const data = await http.getJson(uri, true);
        this._data = data;
        return data;
    }

    async get_dummyEmpty(uri) {
        let data;
        if (uri) {
            data = await http.getJson(uri, true);
        } else {
            data = await http.getJson(this._dummyApi + '_sceme.json', true);
        }
        const decoration = {
            items: [data]
        }
        if (decoration) {
            for (let i in decoration.items[0]) {
                const item = decoration.items[0][i];
                item.value = '';
            }
        }
        this._data = decoration;
        return this._data;
    }

    async loadDummyIndex(uri) {
        const data = await http.getJson(uri, true);
        this._replaceIndex = data;
    }
}