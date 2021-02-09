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
                    v-model="search.category"
                    label="カテゴリーから探す"
                    :items="categories"
                    multiple
                    @change="filterByConditions"
                  >
                  </v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <v-select
                    clearable
                    v-model="search.broadCategory"
                    label="大分類キーワード"
                    :items="broadCategories"
                    multiple
                    @change="filterByConditions"
                  >
                  </v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    clearable
                    label="中分類キーワード"
                    name="title"
                    maxlength="64"
                    v-model="search.mediumCategory"
                    @click:clear="filterByConditions"
                    @keydown.enter="filterByConditions"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    clearable
                    label="小分類キーワード"
                    name="title"
                    maxlength="64"
                    v-model="search.subCategory"
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
              <template v-slot:[`item.レコード番号.value`]="{ item }">
                <a
                  :href="`https://salescomms.cybozu.com/k/${appId}/show#record=${item.レコード番号.value}`"
                  target="_blank"
                >
                  {{ item.レコード番号.value }}
                </a>
              </template>
              <template v-slot:[`item.参考リンク_1.value`]="{ item }">
                <a :href="item.参考リンク_1.value" target="_blank">
                  {{ item.参考リンク_1.value.slice(0, 20) }}
                </a>
              </template>
              <template v-slot:[`item.参考リンク_2.value`]="{ item }">
                <a :href="item.参考リンク_2.value" target="_blank">
                  {{ item.参考リンク_2.value.slice(0, 20) }}
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
      category: "",
      broadCategory: "",
      mediumCategory: "",
      subCategory: "",
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
        text: "カテゴリーから探す",
        align: "left",
        sortable: true,
        value: "カテゴリーから探す.value",
        width: "150px",
      },
      {
        text: "大分類キーワード",
        align: "left",
        sortable: true,
        value: "大分類キーワード.value",
        width: "150px",
      },
      {
        text: "中分類キーワード",
        align: "left",
        sortable: true,
        value: "中分類キーワード.value",
        width: "150px",
      },
      {
        text: "小分類キーワード",
        align: "left",
        sortable: true,
        value: "小分類キーワード.value",
        width: "150px",
      },
      {
        text: "タイトル",
        align: "left",
        sortable: true,
        value: "タイトル.value",
        width: "150px",
      },
      {
        text: "本文",
        align: "left",
        sortable: true,
        value: "本文.value",
        width: "150px",
      },
      {
        text: "参考リンク①",
        align: "left",
        sortable: true,
        value: "参考リンク_1.value",
        width: "150px",
      },
      {
        text: "参考リンク②",
        align: "left",
        sortable: true,
        value: "参考リンク_2.value",
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
    categories: [],
    broadCategories: [],
  }),
  methods: {
    async fetchRecords() {
      let { records } = await kintoneUtility.rest.getAllRecordsByQuery({
        app: this.appId,
        query: kintone.app.getQueryCondition(),
      });

      records = await Promise.all(
        records.map((item) => {
          item["タイトル"].value = item["タイトル"].value.slice(0, 15);
          const mainText = item["本文"].value
            .replace("<div>", "")
            .replace(/<div>/g, "\n")
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
          item["本文"].value = mainText.slice(0, 15);
          return item;
        })
      );

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
          if (0 < this.search.category.length) {
            isMatched =
              isMatched &&
              this.search.category.includes(item["カテゴリーから探す"].value);
          }
          if (0 < this.search.broadCategory.length) {
            isMatched =
              isMatched &&
              this.search.broadCategory.includes(
                item["大分類キーワード"].value
              );
          }
          if (this.search.mediumCategory) {
            isMatched =
              isMatched &&
              0 <=
                item["中分類キーワード"].value.indexOf(
                  this.search.mediumCategory
                );
          }
          if (this.search.subCategory) {
            isMatched =
              isMatched &&
              0 <=
                item["小分類キーワード"].value.indexOf(this.search.subCategory);
          }
          return isMatched;
        });
        this.loading = false;
      }, 500);
    },
    async buildSearchItems() {
      const fields = await kintone.api(
        kintone.api.url("/k/v1/app/form/fields", true),
        "GET",
        { app: this.appId }
      );
      console.log(fields);
      this.categories = Object.keys(
        fields.properties["カテゴリーから探す"].options
      );
      this.broadCategories = Object.keys(
        fields.properties["大分類キーワード"].options
      );
    },
  },
  created: function () {
    this.buildSearchItems();
    this.fetchRecords();
    window.getElementById;
  },
};
</script>


<style scoped>
.v-data-table {
  white-space: nowrap;
}
</style>
