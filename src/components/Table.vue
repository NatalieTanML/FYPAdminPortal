<template>
  <div>
    <b-container fluid>
      <div class="card shadow mb-4">
        <!-- User Interface controls -->
        <div class="card-header py-3">
          <b-row>
            <b-col class="col-12 col-md-4">
              <b-input-group class="input-group">
                <b-form-input
                  type="text"
                  class="form-control border-0"
                  v-model="filter"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append class="input-group-append">
                  <b-button variant="primary">
                    <i class="fas fa-search fa-sm"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col>
              <b-button
                v-on:click="onHeaderButtonClick"
                variant="primary"
                class="float-right"
                v-if="headerButton"
              >{{headerButton}}</b-button>
            </b-col>
          </b-row>
        </div>

        <!-- Main table element -->
        <div class="card-body">
          <b-table
            show-empty
            stacked="md"
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @filtered="onFiltered"
            hover
          >
            <!-- <template slot="name" slot-scope="row">
        {{ row.value }} {{ row.value }}
            </template>-->

            <template slot="actions" slot-scope="row">
              <b-button
                type="button"
                v-on:click="onActionButtonClick"
                lg="4"
                class="w-75"
                variant="primary"
                size="sm"
              >{{row.value}}</b-button>
            </template>

            <template slot="row-details" slot-scope="row">
              <b-card>
                <ul>
                  <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                </ul>
              </b-card>
            </template>
          </b-table>

          <b-row>
            <b-col md="6" class>
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { eventBus } from "@/eventBus";

export default {
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: null,
      sortDesc: false,
      sortDirection: "asc",
      filter: null
    };
  },
  props: {
    fields: Array,
    items: Array,
    headerButton: String,
    headerButtonClick: String,
    actionButtonClick: String
  },
  mounted() {
    this.totalRows = this.items.length;
  },

  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onHeaderButtonClick() {
      eventBus.$emit(this.headerButtonClick);
    },
    onActionButtonClick() {
      eventBus.$emit(this.actionButtonClick);
    }
  }
};
</script>

<style>
</style>
