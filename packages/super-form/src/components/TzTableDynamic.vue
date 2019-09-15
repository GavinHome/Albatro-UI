<template>
    <div class="tz-table-dynamic">
        <div class="k-toolbar k-grid-toolbar k-grid-top" style="border-width: 1px">
            <div class="pull-left">
                <search-bar :isSearchAll="false" :mode="'custom'" :schemaModelFields="schemaModelFields" v-model="customDataSource"
                            ref="searchBar" />
            </div>

            <div class="pull-right">
                <slot v-bind:dataSource="dataSource">
                </slot>
            </div>
        </div>

        <el-table :row-class-name="rowClass" v-loading="loading" :data="dataSource" style="width: 100%" :highlight-current-row="true" :border="true"
                  :stripe="true" tooltip-effect="dark">
            <el-table-column v-for="col in dynamicColumns.filter(x => x.field)" :key="col.field" :prop="col.field" :fixed="col.fixed"
                             :label="col.title" :width="col.width" :min-width="150" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <div v-if="col.type == 'html'" v-html="scope.row[col.field]"/>
                    <div v-else slot-scope="scope">
                        <el-input v-if="(col.editable && scope.row['RowEditable'] === undefined) || (col.editable && scope.row['RowEditable'])" v-model="scope.row[col.field]" size="medium" />
                        <span v-else>{{toFormat(col.format, scope.row[col.field])}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-for="col in dynamicColumns.filter(x => x.command)" :key="col.name" :label="col.title"
                             :width="col.width" >
                <template slot-scope="scope">
                    <el-button v-for="comd in col.command" :key="comd.name" size="mini" @click="comd.click(scope.row)"
                               v-if="comd.visible(scope.row)" :class="comd.className" :icon="comd.iconClass" style="margin-right: 5px !important;"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tz-pagination text-right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" @prev-click="prevClick"
                           @next-click="nextClick" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import {
    Form,
    FormItem,
    Input,
    Row,
    Col,
    Collapse,
    CollapseItem,
    InputNumber,
    Pagination,
    Tooltip,
    Loading,
    Message
} from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import { GridColumnSchema, FieldTypeEnum, GridModelSchemaType } from "../extension/GridSchema";
import { CustomDataSource } from "../extension/TzCustomSearch";
import "../extension/DateExtensions";
import { encodeQueryData, IUrlParameterSchema } from "../extension/TzCommonFunc";
//import { TzConst, TzMessageConst } from "../TzCommonConst"
import { TzFetch } from "../extension/TzFetch";
//import SearchBar from "./SearchBar";
import "../extension/StringExtensions";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(InputNumber);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Loading);

@Component({
    props: ["fetchUrl", "columns", "pageSize", "value", "querys"],
    components: {
        SearchBar: require("./SearchBar.vue.html")
    }
})
export default class TzTableDynamic extends Vue {
    @Prop() fetchUrl!: string;
    @Prop() columns!: GridColumnSchema[];
    @Prop() value!: any[];
    @Prop() pageSize!: number;
    //@Prop() qparams!: IUrlParameterSchema;
    @Prop() querys!: IUrlParameterSchema;

    maxNumber: number = TzConst.MaxNumber
    currentPage: number = 1;
    schemaModelFields: any = {};

    customDataSource: CustomDataSource = {
        fetchUrl: this.remoteUrl,
        local: this.value != null,
        model: this.value,
        request: {
            page: 1,
            pageSize: this.pageSize ? this.pageSize : 10,
            sort: [
                // {
                //   field: "Name",
                //   dir: "asc"
                // }
            ]
        },
        total: 0,
        dataSource: [],
        loading: false,
        filter: function (filter: any) {
            if (filter) {
                this.request.filter = filter;
            }

            if (this.local) {
                if (this.model) {
                    this.total = this.model.length;

                    //todo: filter
                    let data = this.model.filter((value, i) => {
                        let flag = false;
                        if (filter && filter.filters) {
                            let filters = filter.filters as any[];
                            if (filters.length > 0) {
                                filters.forEach((v, i) => {
                                    if ((value[v.field] as string).indexOf(v.value) > -1) {
                                        flag = true;
                                    }
                                });
                            } else {
                                flag = true;
                            }
                        } else {
                            flag = true;
                        }

                        if (flag) {
                            return value;
                        } else {
                            return null;
                        }
                    });

                    //todo: sort
                    if (this.request.sort && this.request.sort.length > 0) {
                        data = data.sort(
                            (x, y) =>
                                (x[this.request.sort[0].field] > y[this.request.sort[0].field]
                                    ? 1
                                    : -1) * (this.request.sort[0].dir === "asc" ? 1 : -1)
                        );
                    }

                    let skip = (this.request.page - 1) * this.request.pageSize;
                    let end = skip + this.request.pageSize;
                    end = data.length > end ? end : data.length;
                    this.dataSource = data.slice(skip, end);

                    this.onDataBinding(this.dataSource);
                }
            } else {
                this.loading = true;
                TzFetch.Post(this.fetchUrl, this.request, false)
                    .then((data: any) => {
                        if (data) {
                            this.dataSource = data.Data;
                            this.total = data.Total;
                            this.onDataBinding(this.dataSource);
                        } else {
                            this.dataSource = [];
                            this.total = 0;
                        }

                        this.loading = false;
                    }).catch(e => {
                        Message.error(TzMessageConst.DATA_FAIL_MESSAGE)
                        this.loading = false;
                    });
            }
        },
        onDataBinding(data: any) {
            var page = this.request.page;
            var pageSize = this.request.pageSize;
            data.forEach((ele, i) => {
                ele.RowNumber = (page - 1) * pageSize + i + 1;
                for (var key in ele){
                    if(ele[key] === 'True'){
                        ele[key] = true;
                    }else if(ele[key] === 'False'){
                        ele[key] = false;
                    }
                }
            });
        }
    };

    get dataSource() {
        return this.customDataSource.dataSource;
    }

    get loading() {
        return this.customDataSource.loading;
    }

    get total() {
        return this.customDataSource.total;
    }

    get remoteUrl() {
        if (this.querys) {
            return this.fetchUrl + "?" + encodeQueryData(this.querys);
        } else {
            return this.fetchUrl;
        }
    }

    get dynamicColumns() {
        this.schemaModelFields = {};
        this.columns
            .filter(x => !String.isNullOrEmpty(x.field))
            .forEach((e, i) => {
                if (e.field === TzConst.RowNumber) {
                    e.title = '序号';
                    e.width = e.width === undefined ? '60' : e.width;
                    e.filterable = false;
                    e.sortable = false;
                    e.menu = false;
                    e.type = FieldTypeEnum.Number;
                    e.index = -1;
                }

                let value: GridModelSchemaType = {
                    filterable: e.filterable,
                    sortable: e.sortable,
                    editable: e.editable,
                    nullable: true,
                    type: e.type
                };

                this.schemaModelFields[e.field as string] = value;
            });

        this.$nextTick(() => {
            if (this.value) {
                this.customDataSource.model = this.value;
            }

            this.customDataSource.filter();
        });
        
        return this.columns;
    }

    toFormat(format: string, data: string) {
        if (format === '{0:N}') {
            return String.formatMoney(data, TzConst.DefaultDigit);
        } else if (format === '{0:N3}') {
            return String.formatMoney(data, TzConst.THREE);
        } else if (format === '{0:N4}') {
            return String.formatMoney(data, TzConst.FORE);
        }
        else {
            return data;
        }
    }

    rowClass(data){
        if(!String.isNullOrEmpty(data.row.RowClass)){
            return data.row.RowClass;
        }
    }

    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
    }

    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.customDataSource.request.page = val;
        this.customDataSource.filter();
    }

    prevClick() {
        console.log(`prevClick`)
    }

    nextClick() {
        console.log(`nextClick`)
    }

    onQueryDataRefresh(data: IUrlParameterSchema, isClearSearch: boolean = true) {
        this.customDataSource.fetchUrl =
            this.fetchUrl + "?" + encodeQueryData(data);

        if (isClearSearch) {
            this.customDataSource.filter({});
        } else {
            this.customDataSource.filter();
        }
    }

    clearSearch() {
        (this.$refs.searchBar as SearchBar).clearText();
    }
}

</script>

<style>
    .tz-table-dynamic table tr td,
    .tz-table-dynamic table tr th {
        padding: 5px 0;
    }

    .tz-pagination {
        /* border: 1px solid #dedee0; */
        border-bottom: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        padding: 5px 0;
    }

    .tz-table-dynamic .k-toolbar.k-grid-toolbar.k-grid-top {
        /* border-width: 1px 1px 0px 1px !important; */
        background: none;
        padding: 5px 10px;
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:2560px) {
        .tz-table-dynamic {
            width: 2240px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1920px) and (max-width: 2559px) {
        .tz-table-dynamic {
            width: 1610px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1680px) and (max-width: 1919px) {
        .tz-table-dynamic {
            width: 1375px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1600px) and (max-width: 1679px) {
        .tz-table-dynamic {
            width: 1280px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1440px) and (max-width: 1599px) {
        .tz-table-dynamic {
            width: 1120px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1400px) and (max-width: 1439px) {
        .tz-table-dynamic {
            width: 1080px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1366px) and (max-width: 1399px) {
        .tz-table-dynamic {
            width: 1062px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1360px) and (max-width: 1365px) {
        .tz-table-dynamic {
            width: 1040px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1280px) and (max-width: 1359px) {
        .tz-table-dynamic {
            width: 976px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1200px) and (max-width: 1279px) {
        .tz-table-dynamic {
            width: 860px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1152px) and (max-width: 1199px) {
        .tz-table-dynamic {
            width: 830px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width:1024px) and (max-width: 1151px) {
        .tz-table-dynamic {
            width: 720px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width: 960px) and (max-width: 1023px) {
        .tz-table-dynamic {
            width: 760px;
            overflow: auto
        }
    }

    @media screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (min-width: 800px) and (max-width: 959px) {
        .tz-table-dynamic {
            width: 726px;
            overflow: auto
        }
    }

    @media only screen and (-ms-high-contrast:active),(-ms-high-contrast:none) and (max-width: 799px) {
        .tz-table-dynamic {
            width: 720px;
            overflow: auto
        }
    }
</style>