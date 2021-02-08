<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col>
          <v-form lazy-validation>
            <v-container fluid class="pa-1">
              <v-row justify="space-around">
                <v-col cols="12" md="2">
                  <v-select
                    clearable
                    v-model="search.industry"
                    label="業種"
                    :items="industries"
                    :menu-props="{ top: true, offsetY: true }"
                    multiple
                    @change="filterByConditions"
                  >
                  </v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    clearable
                    label="クライアント名"
                    name="title"
                    maxlength="64"
                    v-model="search.clientName"
                    @click:clear="filterByConditions"
                    @keydown.enter="filterByConditions"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    clearable
                    label="商材名"
                    name="title"
                    maxlength="64"
                    v-model="search.commodity"
                    @click:clear="filterByConditions"
                    @keydown.enter="filterByConditions"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    clearable
                    label="全文検索（入力後Enterを押下してください）"
                    name="title"
                    maxlength="64"
                    v-model="search.text"
                    @click:clear="filterByConditions"
                    @keydown.enter="filterByConditions"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <v-data-table
              :headers="headers"
              :items="items"
              :options.sync="options"
              :loading="loading"
              :footer-props="{
                'items-per-page-options': [10, 20, 50, 100, 200, 300, 400, 500],
                showFirstLastPage: true,
              }"
              class="elevation-10"
              locale="ja-jp"
              loading-text="読込中"
              no-data-text="データがありません。"
            >
              <template v-slot:item.レコード番号.value="{ item }">
                <a
                  :href="`https://salescomms.cybozu.com/k/${appId}/show#record=${item.レコード番号.value}`"
                  target="_blank"
                >
                  {{ item.レコード番号.value }}
                </a>
              </template>
            </v-data-table>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import kintoneUtility from "kintone-utility/docs/kintoneUtility";
import config from "../config";
export default {
  name: "App",
  data: () => ({
    appId: kintone.app.getId(),
    loading: true,
    search: {
      text: "",
      industry: "",
      clientName: "",
      commodity: "",
    },
    headers: [
      {
        text: "レコード番号",
        align: "left",
        sortable: true,
        value: "レコード番号.value",
        width: "10px",
      },
      {
        text: "業種",
        align: "left",
        sortable: true,
        value: "業種.value",
        width: "150px",
      },
      {
        text: "クライアント名",
        align: "left",
        sortable: true,
        value: "クライアント名.value",
        width: "150px",
      },
      {
        text: "商材名",
        align: "left",
        sortable: true,
        value: "商材名.value",
        width: "150px",
      },
    ],
    items: [],
    allItems: [],
    options: {
      page: 1,
      itemsPerPage: 20,
      sortBy: ["レコード番号.value"],
      sortDesc: [true],
    },
    industries: [],
  }),
  methods: {
    async fetchRecords() {
      const { records } = await kintoneUtility.rest.getAllRecordsByQuery({
        app: this.appId,
        query: kintone.app.getQueryCondition(),
      });
      this.items = records;
      this.allItems = records;
      console.log("records", records);
      this.loading = false;
    },
    async filterByConditions() {
      this.loading = true;
      setTimeout(() => {
        this.items = this.allItems.filter((item) => {
          let isMatched = true;
          const jsonValue = JSON.stringify(item).toLowerCase();
          if (this.search.text) {
            isMatched = isMatched && 0 <= jsonValue.indexOf(this.search.text);
          }
          if (0 < this.search.industry.length) {
            isMatched =
              isMatched && this.search.industry.includes(item["業種"].value);
          }
          if (this.search.clientName) {
            isMatched =
              isMatched &&
              0 <= item["クライアント名"].value.indexOf(this.search.clientName);
          }
          if (this.search.commodity) {
            isMatched =
              isMatched &&
              0 <= item["商材名"].value.indexOf(this.search.commodity);
          }
          return isMatched;
        });
        this.loading = false;
      }, 500);
    },
    async buildSearchItems() {
      this.industries = config.INDUSTRY;
    },
  },
  created: function () {
    this.buildSearchItems();
    this.fetchRecords();
  },
};
</script>

<style scoped>
.v-data-table {
  white-space: nowrap;
}
</style>
