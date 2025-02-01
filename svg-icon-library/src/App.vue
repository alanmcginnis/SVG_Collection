<template>
  <div id="app">
    <div class="controls">
      <input v-model="searchQuery" @input="filterIcons" placeholder="Search icons..." class="search-input" />
      <div class="slider-container">
        <vue-slider v-model="iconSize" :min="32" :max="256" :interval="1" @change="syncInput" class="slider" width="200"/>
        <input v-model.number="iconSize" @input="syncSlider" type="number" min="32" max="256" class="size-input" />
      </div>
    </div>
    <div class="icon-grid" ref="iconGrid" :style="{ minHeight: '120vh' }">
      <img v-for="icon in filteredIcons" :key="icon" v-lazy="`http://localhost:3000/icons/${icon}`" :style="{ width: iconSize + 'px', height: iconSize + 'px' }" />
    </div>
    <div v-if="loading" class="loading">Loading more icons...</div>
    <div ref="loader" class="loader"></div> <!-- Loader element -->
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  components: {
    VueSlider
  },
  data() {
    return {
      searchQuery: '',
      iconSize: 64,
      icons: [],
      filteredIcons: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      observer: null
    };
  },
  created() {
    this.loadIcons();
  },
  mounted() {
    this.observer = new IntersectionObserver(
      debounce(this.handleIntersect, 200), // Debounce the observer callback
      {
        root: null,
        rootMargin: '0px',
        threshold: 0
      }
    );
    this.observer.observe(this.$refs.loader);
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    async loadIcons(page = 1, append = false) {
      if (this.loading) return;
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:3000/api/icons?page=${page}&limit=250`); // Increase the limit
        if (append) {
          this.filteredIcons = [...this.filteredIcons, ...response.data.icons];
        } else {
          this.filteredIcons = response.data.icons;
        }
        this.currentPage = response.data.currentPage;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error loading icons:', error);
      } finally {
        this.loading = false;
      }
    },
    async filterIcons() {
      this.currentPage = 1;
      this.totalPages = 1;
      try {
        const response = await axios.get(`http://localhost:3000/api/icons/search?q=${this.searchQuery}&page=1`);
        this.filteredIcons = response.data.icons;
        this.currentPage = response.data.currentPage;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error filtering icons:', error);
      }
    },
    handleIntersect(entries) {
      if (entries[0].isIntersecting && this.currentPage < this.totalPages) {
        this.loadIcons(this.currentPage + 1, true);
      }
    },
    syncInput(value) {
      this.iconSize = value;
    },
    syncSlider(event) {
      this.iconSize = event.target.value;
    }
  }
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
.controls {
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #333;
  padding: 5px;
}
.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}
.slider-container {
  display: flex;
  align-items: center;
}
.vue-slider {
  width: 200px;
  margin-right: 10px;
}
.size-input {
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 60px;
}
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  padding-top: 55px;
  align-content: flex-start;
  gap: 10px;
  justify-content: center;
}
.icon-grid img {
  margin: 5px;
}
.loading {
  text-align: center;
  margin-top: 20px;
}
.loader {
  height: 1px;
}
</style>
