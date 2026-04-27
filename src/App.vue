<template>
  <div class="app-container">
    <!-- 顶部标题区 -->
    <header class="header">
      <div class="header-title">
        <span class="header-icon">🥗</span>
        <h1>美食热量测评</h1>
      </div>
      <p class="header-subtitle">健康饮食，从了解每一餐开始</p>
    </header>

    <!-- 健康小贴士轮播 -->
    <div class="tips-carousel card">
      <div class="carousel-wrapper">
        <button class="carousel-btn carousel-prev" @click="prevTip">
          <span>‹</span>
        </button>
        <div class="tip-item" :style="{ transform: `translateX(-${currentTipIndex * 100}%)` }">
          <div v-for="tip in healthTips" :key="tip.id" class="tip-slide">
            <span class="tip-icon">{{ tip.icon }}</span>
            <div class="tip-content">
              <strong class="tip-title">{{ tip.title }}</strong>
              <p class="tip-text">{{ tip.content }}</p>
            </div>
          </div>
        </div>
        <button class="carousel-btn carousel-next" @click="nextTip">
          <span>›</span>
        </button>
      </div>
      <div class="tip-dots">
        <span v-for="(tip, index) in healthTips" :key="tip.id" 
              class="tip-dot" :class="{ active: index === currentTipIndex }"
              @click="goToTip(index)"></span>
      </div>
    </div>

    <!-- 搜索模块 -->
    <div class="search-section card">
      <div class="search-box">
        <input 
          type="text" 
          class="input search-input" 
          v-model="searchKeyword" 
          placeholder="搜索食物名称，如：鸡胸肉、苹果..."
          @keyup.enter="performSearch"
        >
        <button class="btn btn-primary search-btn" @click="performSearch">
          🔍 搜索
        </button>
      </div>
      
      <!-- 搜索历史 -->
      <div v-if="searchHistory.length > 0" class="search-history">
        <div class="history-header">
          <span>搜索历史</span>
          <button class="clear-btn" @click="clearSearchHistory">清空</button>
        </div>
        <div class="history-tags">
          <span v-for="(term, index) in searchHistory" :key="index" 
                class="tag tag-primary history-tag"
                @click="searchFromHistory(term)">
            {{ term }}
          </span>
        </div>
      </div>
    </div>

    <!-- 食物分类导航 -->
    <div class="category-section card">
      <div class="category-list">
        <button 
          v-for="cat in foodCategories" 
          :key="cat.id"
          class="category-item"
          :class="{ active: activeCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="category-icon">{{ cat.icon }}</span>
          <span class="category-name">{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- 热门食物推荐 -->
    <div v-if="!searchKeyword && activeCategory === null" class="hot-foods card">
      <h3 class="card-title">
        <span>🔥</span> 热门食物推荐
      </h3>
      <div class="food-grid">
        <div v-for="food in hotFoods" :key="food.id" 
             class="food-item"
             @click="showFoodDetail(food)">
          <div class="food-cal">{{ food.calories }} <span class="cal-unit">kcal</span></div>
          <div class="food-name">{{ food.name }}</div>
          <div class="food-unit">每{{ food.unit }}</div>
        </div>
      </div>
    </div>

    <!-- 搜索/分类结果 -->
    <div v-if="filteredFoods.length > 0" class="food-results card">
      <h3 class="card-title">
        <span>📋</span> 
        {{ searchKeyword ? '搜索结果' : activeCategoryName }}
        <span class="result-count">({{ filteredFoods.length }}种)</span>
      </h3>
      <div class="food-list">
        <div v-for="food in filteredFoods" :key="food.id" 
             class="food-list-item"
             @click="showFoodDetail(food)">
          <div class="food-list-info">
            <div class="food-list-name">{{ food.name }}</div>
            <div class="food-list-nutrition">
              <span>热量 {{ food.calories }}kcal</span>
              <span>脂肪 {{ food.fat }}g</span>
              <span>蛋白质 {{ food.protein }}g</span>
              <span>碳水 {{ food.carbs }}g</span>
            </div>
          </div>
          <div class="food-list-cal">
            <div class="cal-value">{{ food.calories }}</div>
            <div class="cal-label">kcal/{{ food.unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 食物详情弹窗 -->
    <div v-if="selectedFood" class="modal-overlay" @click="closeFoodDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedFood.name }}</h3>
          <button class="modal-close" @click="closeFoodDetail">×</button>
        </div>
        
        <div class="food-detail-cal">
          <div class="cal-big">{{ selectedFood.calories }}</div>
          <div class="cal-label">kcal/{{ selectedFood.unit }}</div>
        </div>

        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-value">{{ selectedFood.fat }}g</div>
            <div class="nutrition-label">脂肪</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ selectedFood.protein }}g</div>
            <div class="nutrition-label">蛋白质</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ selectedFood.carbs }}g</div>
            <div class="nutrition-label">碳水化合物</div>
          </div>
        </div>

        <div class="add-to-meal">
          <h4>添加到餐食记录</h4>
          <div class="weight-input">
            <label>食用重量：</label>
            <input type="number" class="input" v-model.number="mealWeight" min="1">
            <span class="weight-unit">g</span>
          </div>
          <div class="calculated-cal">
            预计热量：<strong>{{ calculatedCalories }}</strong> kcal
          </div>
          <div class="meal-buttons">
            <button v-for="meal in mealTypes" :key="meal.id" 
                    class="btn meal-btn"
                    :class="`btn-${meal.color}`"
                    @click="addFoodToMeal(meal.id)">
              {{ meal.icon }} {{ meal.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义食物录入 -->
    <div class="custom-food card">
      <h3 class="card-title">
        <span>✏️</span> 自定义食物录入
      </h3>
      <div class="custom-form">
        <div class="form-row">
          <div class="form-group">
            <label>食物名称</label>
            <input type="text" class="input" v-model="customFood.name" placeholder="如：自制沙拉">
          </div>
          <div class="form-group">
            <label>重量 (g)</label>
            <input type="number" class="input" v-model.number="customFood.weight" placeholder="100">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>热量 (kcal/100g)</label>
            <input type="number" class="input" v-model.number="customFood.calories" placeholder="100">
          </div>
          <div class="form-group">
            <label>脂肪 (g/100g)</label>
            <input type="number" class="input" v-model.number="customFood.fat" placeholder="5">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>蛋白质 (g/100g)</label>
            <input type="number" class="input" v-model.number="customFood.protein" placeholder="10">
          </div>
          <div class="form-group">
            <label>碳水 (g/100g)</label>
            <input type="number" class="input" v-model.number="customFood.carbs" placeholder="20">
          </div>
        </div>
        <div class="custom-result" v-if="customFood.calories > 0 && customFood.weight > 0">
          <div class="result-item">
            <span>总热量：</span>
            <strong class="total-cal-value">{{ customTotalCalories }} kcal</strong>
          </div>
          <div class="result-detail" v-if="customFood.name">
            <span>{{ customFood.name }} × {{ customFood.weight }}g = {{ customTotalCalories }} kcal</span>
          </div>
        </div>
        <div class="custom-hint" v-else-if="customFood.name || customFood.weight > 0 || customFood.calories > 0">
          <span>💡 请输入食物名称、重量和每100g热量，系统将自动计算总热量</span>
        </div>
        <button class="btn btn-primary custom-add-btn" @click="addCustomFood">
          ➕ 添加自定义食物
        </button>
      </div>
    </div>

    <!-- 三餐热量记录 -->
    <div class="meal-records card">
      <h3 class="card-title">
        <span>🍽️</span> 今日饮食记录
      </h3>
      
      <div class="meals-container">
        <div v-for="meal in mealTypes" :key="meal.id" class="meal-section">
          <div class="meal-header">
            <span class="meal-icon">{{ meal.icon }}</span>
            <span class="meal-title">{{ meal.name }}</span>
            <span class="meal-total">{{ getMealCalories(meal.id) }} kcal</span>
          </div>
          
          <div v-if="todayRecords[meal.id]?.length > 0" class="meal-items">
            <div v-for="item in todayRecords[meal.id]" :key="item.id" class="meal-item">
              <div class="meal-item-info">
                <div class="meal-item-name">{{ item.name }}</div>
                <div class="meal-item-weight">{{ item.weight }}g</div>
              </div>
              <div class="meal-item-cal">{{ item.totalCalories }} kcal</div>
              <button class="meal-item-remove" @click="removeMealItem(meal.id, item.id)">×</button>
            </div>
          </div>
          <div v-else class="meal-empty">
            暂无记录
          </div>
        </div>
      </div>
    </div>

    <!-- 热量统计 -->
    <div class="calories-summary card">
      <h3 class="card-title">
        <span>📊</span> 今日热量汇总
      </h3>
      
      <div class="summary-cal">
        <div class="summary-total">
          <div class="total-value">{{ totalCalories }}</div>
          <div class="total-label">已摄入 (kcal)</div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-recommended">
          <div class="recommended-value">{{ recommendedCalories }}</div>
          <div class="recommended-label">推荐摄入 (kcal)</div>
        </div>
      </div>

      <div class="summary-bar">
        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: barPercentage + '%' }"
               :class="{ over: totalCalories > recommendedCalories }"></div>
        </div>
        <div class="bar-labels">
          <span>0</span>
          <span>{{ recommendedCalories }}</span>
        </div>
      </div>

      <div class="summary-status" :class="calorieStatus">
        <span class="status-icon">{{ statusIcon }}</span>
        <span class="status-text">{{ statusText }}</span>
      </div>

      <!-- 用户设置 -->
      <div class="user-settings">
        <h4>个人信息设置</h4>
        <div class="settings-grid">
          <div class="setting-item">
            <label>性别</label>
            <select class="input" v-model="userProfile.gender">
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div class="setting-item">
            <label>年龄</label>
            <input type="number" class="input" v-model.number="userProfile.age" min="1" max="120">
          </div>
          <div class="setting-item">
            <label>体重 (kg)</label>
            <input type="number" class="input" v-model.number="userProfile.weight" min="20" max="200">
          </div>
          <div class="setting-item">
            <label>活动量</label>
            <select class="input" v-model="userProfile.activityLevel">
              <option value="sedentary">久坐</option>
              <option value="light">轻度</option>
              <option value="moderate">中度</option>
              <option value="active">重度</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 运动消耗换算 -->
    <div class="exercise-convert card">
      <h3 class="card-title">
        <span>⚡</span> 运动消耗换算
      </h3>
      
      <div class="exercise-select">
        <label>选择运动：</label>
        <select class="input" v-model="selectedExercise">
          <option v-for="ex in exercises" :key="ex.id" :value="ex.id">
            {{ ex.icon }} {{ ex.name }}
          </option>
        </select>
      </div>

      <div class="exercise-time">
        <label>运动时长：</label>
        <div class="time-buttons">
          <button v-for="time in timeOptions" :key="time.value"
                  class="time-btn"
                  :class="{ active: exerciseTime === time.value }"
                  @click="exerciseTime = time.value">
            {{ time.label }}
          </button>
        </div>
      </div>

      <div class="exercise-result">
        <div class="exercise-icon">{{ currentExercise.icon }}</div>
        <div class="exercise-info">
          <div class="exercise-name">{{ currentExercise.name }}</div>
          <div class="exercise-time-text">{{ exerciseTime }} 分钟</div>
        </div>
        <div class="exercise-calories">
          <div class="exercise-cal-value">{{ exerciseCaloriesBurned }}</div>
          <div class="exercise-cal-label">消耗卡路里 (kcal)</div>
        </div>
      </div>

      <div class="exercise-desc">{{ currentExercise.description }}</div>

      <!-- 对比显示 -->
      <div class="exercise-compare">
        <h4>需要运动多久才能消耗？</h4>
        <div class="compare-input">
          <input type="number" class="input" v-model.number="compareCalories" placeholder="输入卡路里">
          <span class="compare-unit">kcal</span>
        </div>
        <div class="compare-results" v-if="compareCalories > 0">
          <div v-for="ex in exercises" :key="ex.id" class="compare-item">
            <span class="compare-icon">{{ ex.icon }}</span>
            <span class="compare-name">{{ ex.name }}</span>
            <span class="compare-time">{{ Math.ceil(compareCalories / ex.caloriesPerMinute) }} 分钟</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 低卡食谱推荐 -->
    <div class="recipes-card card">
      <h3 class="card-title">
        <span>🍳</span> 低卡减脂食谱推荐
      </h3>
      
      <div class="recipes-grid">
        <div v-for="recipe in recipes" :key="recipe.id" 
             class="recipe-item"
             @click="showRecipeDetail(recipe)">
          <div class="recipe-image" :style="{ backgroundImage: `url(${recipe.image})` }"></div>
          <div class="recipe-info">
            <div class="recipe-name">{{ recipe.name }}</div>
            <div class="recipe-desc">{{ recipe.description }}</div>
            <div class="recipe-cal">
              <span class="tag tag-secondary">{{ recipe.calories }} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 食谱详情弹窗 -->
    <div v-if="selectedRecipe" class="modal-overlay" @click="closeRecipeDetail">
      <div class="modal-content recipe-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedRecipe.name }}</h3>
          <button class="modal-close" @click="closeRecipeDetail">×</button>
        </div>
        
        <div class="recipe-detail-image" :style="{ backgroundImage: `url(${selectedRecipe.image})` }"></div>
        
        <div class="recipe-detail-info">
          <div class="recipe-cal-badge">
            <span class="tag tag-secondary">{{ selectedRecipe.calories }} kcal</span>
          </div>
          <p class="recipe-detail-desc">{{ selectedRecipe.description }}</p>
          
          <div class="recipe-section">
            <h4>食材</h4>
            <p>{{ selectedRecipe.ingredients }}</p>
          </div>
          
          <div class="recipe-section">
            <h4>小贴士</h4>
            <p>{{ selectedRecipe.tips }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据操作按钮 -->
    <div class="data-actions card">
      <h3 class="card-title">
        <span>⚙️</span> 数据管理
      </h3>
      <div class="action-buttons">
        <button class="btn btn-danger" @click="confirmClearToday">
          🗑️ 清空今日记录
        </button>
        <button class="btn btn-danger" @click="confirmClearAll">
          🔄 重置所有数据
        </button>
      </div>
    </div>

    <!-- 底部寄语 -->
    <footer class="footer">
      <div class="footer-icon">💚</div>
      <p class="footer-text">健康饮食，规律作息</p>
      <p class="footer-text">每一天都充满活力！</p>
      <p class="footer-copyright">© 2024 美食热量测评</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { foodCategories, foods } from './data/foods'
import { exercises, exerciseTimeOptions } from './data/exercises'
import { lowCalRecipes } from './data/recipes'
import { healthTips } from './data/tips'
import { 
  mealStorage, 
  searchHistoryStorage, 
  customFoodStorage, 
  userProfileStorage 
} from './utils/storage'

// 搜索相关
const searchKeyword = ref('')
const searchHistory = ref([])
const activeCategory = ref(null)

// 食物相关
const selectedFood = ref(null)
const mealWeight = ref(100)

// 自定义食物
const customFood = ref({
  name: '',
  weight: 100,
  calories: 0,
  fat: 0,
  protein: 0,
  carbs: 0
})

// 餐食记录
const todayRecords = ref({
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: []
})

// 用户资料
const userProfile = ref(userProfileStorage.get())

// 运动换算
const selectedExercise = ref('walking')
const exerciseTime = ref(30)
const compareCalories = ref(0)

// 食谱
const selectedRecipe = ref(null)
const recipes = computed(() => lowCalRecipes)

// 小贴士轮播
const currentTipIndex = ref(0)
let tipTimer = null

// 餐食类型定义
const mealTypes = [
  { id: 'breakfast', name: '早餐', icon: '🌅', color: 'primary' },
  { id: 'lunch', name: '午餐', icon: '☀️', color: 'primary' },
  { id: 'dinner', name: '晚餐', icon: '🌙', color: 'primary' },
  { id: 'snack', name: '加餐', icon: '🍰', color: 'secondary' }
]

// 计算属性
const activeCategoryName = computed(() => {
  if (!activeCategory.value) return ''
  const cat = foodCategories.find(c => c.id === activeCategory.value)
  return cat ? cat.name + '类' : ''
})

const hotFoods = computed(() => {
  return foods.filter(f => f.isHot).slice(0, 8)
})

const filteredFoods = computed(() => {
  let result = [...foods]
  
  // 添加自定义食物
  const customFoods = customFoodStorage.get()
  result = [...result, ...customFoods]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(f => 
      f.name.toLowerCase().includes(keyword)
    )
  }
  
  if (activeCategory.value) {
    result = result.filter(f => f.category === activeCategory.value)
  }
  
  return result
})

const calculatedCalories = computed(() => {
  if (!selectedFood.value || !mealWeight.value) return 0
  return Math.round(selectedFood.value.calories * mealWeight.value / 100)
})

const customTotalCalories = computed(() => {
  if (!customFood.value.calories || !customFood.value.weight) return 0
  return Math.round(customFood.value.calories * customFood.value.weight / 100)
})

const totalCalories = computed(() => {
  return mealStorage.calculateTotalCalories()
})

const recommendedCalories = computed(() => {
  return userProfileStorage.calculateRecommendedCalories()
})

const barPercentage = computed(() => {
  const pct = (totalCalories.value / recommendedCalories.value) * 100
  return Math.min(pct, 150)
})

const calorieStatus = computed(() => {
  const diff = totalCalories.value - recommendedCalories.value
  if (diff < -300) return 'low'
  if (diff > 300) return 'high'
  return 'normal'
})

const statusIcon = computed(() => {
  switch (calorieStatus.value) {
    case 'low': return '⚠️'
    case 'high': return '🔴'
    default: return '✅'
  }
})

const statusText = computed(() => {
  const diff = totalCalories.value - recommendedCalories.value
  if (diff < -300) return `摄入偏低，建议增加 ${Math.abs(diff)} kcal`
  if (diff > 300) return `摄入超标，建议减少 ${diff} kcal`
  return '热量摄入适中，继续保持！'
})

const currentExercise = computed(() => {
  return exercises.find(ex => ex.id === selectedExercise.value) || exercises[0]
})

const timeOptions = computed(() => exerciseTimeOptions)

const exerciseCaloriesBurned = computed(() => {
  return Math.round(currentExercise.value.caloriesPerMinute * exerciseTime.value)
})

// 方法
function performSearch() {
  if (searchKeyword.value.trim()) {
    searchHistory.value = searchHistoryStorage.add(searchKeyword.value.trim())
    activeCategory.value = null
  }
}

function searchFromHistory(term) {
  searchKeyword.value = term
  performSearch()
}

function clearSearchHistory() {
  searchHistory.value = searchHistoryStorage.clear()
}

function selectCategory(categoryId) {
  activeCategory.value = activeCategory.value === categoryId ? null : categoryId
  searchKeyword.value = ''
}

function showFoodDetail(food) {
  selectedFood.value = food
  mealWeight.value = 100
}

function closeFoodDetail() {
  selectedFood.value = null
}

function addFoodToMeal(mealType) {
  if (!selectedFood.value || !calculatedCalories.value) return
  
  const mealItem = {
    name: selectedFood.value.name,
    weight: mealWeight.value,
    caloriesPer100g: selectedFood.value.calories,
    totalCalories: calculatedCalories.value,
    fat: selectedFood.value.fat,
    protein: selectedFood.value.protein,
    carbs: selectedFood.value.carbs
  }
  
  todayRecords.value = mealStorage.addMealItem(mealType, mealItem)
  closeFoodDetail()
}

function addCustomFood() {
  if (!customFood.value.name || !customFood.value.weight || !customFood.value.calories) {
    alert('请填写食物名称、重量和热量')
    return
  }
  
  customFoodStorage.add({
    name: customFood.value.name,
    weight: customFood.value.weight,
    calories: customFood.value.calories,
    fat: customFood.value.fat || 0,
    protein: customFood.value.protein || 0,
    carbs: customFood.value.carbs || 0,
    unit: '100g',
    category: 'custom'
  })
  
  // 重置表单
  customFood.value = {
    name: '',
    weight: 100,
    calories: 0,
    fat: 0,
    protein: 0,
    carbs: 0
  }
  
  alert('自定义食物添加成功！')
}

function getMealCalories(mealType) {
  if (!todayRecords.value[mealType]) return 0
  return todayRecords.value[mealType].reduce((sum, item) => sum + (item.totalCalories || 0), 0)
}

function removeMealItem(mealType, itemId) {
  todayRecords.value = mealStorage.removeMealItem(mealType, itemId)
}

function showRecipeDetail(recipe) {
  selectedRecipe.value = recipe
}

function closeRecipeDetail() {
  selectedRecipe.value = null
}

function confirmClearToday() {
  if (confirm('确定要清空今日所有饮食记录吗？')) {
    mealStorage.clearTodayRecords()
    todayRecords.value = mealStorage.getTodayRecords()
  }
}

function confirmClearAll() {
  if (confirm('确定要重置所有数据吗？这将清除所有记录、历史和设置！')) {
    mealStorage.clearTodayRecords()
    searchHistoryStorage.clear()
    todayRecords.value = mealStorage.getTodayRecords()
    searchHistory.value = []
  }
}

// 轮播图切换方法
function prevTip() {
  currentTipIndex.value = (currentTipIndex.value - 1 + healthTips.length) % healthTips.length
}

function nextTip() {
  currentTipIndex.value = (currentTipIndex.value + 1) % healthTips.length
}

function goToTip(index) {
  currentTipIndex.value = index
}

// 监听用户资料变化
watch(userProfile, (newProfile) => {
  userProfileStorage.set(newProfile)
}, { deep: true })

// 生命周期
onMounted(() => {
  // 加载数据
  searchHistory.value = searchHistoryStorage.get()
  todayRecords.value = mealStorage.getTodayRecords()
  
  // 小贴士轮播
  tipTimer = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % healthTips.length
  }, 5000)
})

onUnmounted(() => {
  if (tipTimer) {
    clearInterval(tipTimer)
  }
})
</script>

<style scoped>
.app-container {
  max-width: 100%;
  padding-bottom: 80px;
}

/* 头部样式 */
.header {
  text-align: center;
  padding: 16px 0;
  margin-bottom: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.header-icon {
  font-size: 2rem;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.header-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 小贴士轮播 */
.tips-carousel {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  position: relative;
  overflow: hidden;
  padding: 12px;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  min-height: 80px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary-dark);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.carousel-btn:hover {
  background: var(--primary-color);
  color: white;
}

.carousel-prev {
  left: 0;
}

.carousel-next {
  right: 0;
}

.carousel-btn span {
  line-height: 1;
  margin-top: -2px;
}

.tip-item {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}

.tip-slide {
  min-width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
}

.tip-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  min-width: 0;
}

.tip-title {
  display: block;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 0.9375rem;
}

.tip-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tip-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding-top: 4px;
}

.tip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(22, 101, 52, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.tip-dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--primary-color);
}

.tip-dot:hover {
  background: var(--primary-light);
}

/* 搜索模块 */
.search-box {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
}

.search-btn {
  white-space: nowrap;
}

.search-history {
  margin-top: 12px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.8125rem;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
}

.history-tag:hover {
  background: var(--primary-color);
  color: white;
}

/* 分类导航 - 魔方网格布局 */
.category-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 10px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.5) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-item:hover::before {
  opacity: 1;
}

.category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.3);
}

.category-item:active {
  transform: translateY(0);
}

.category-item.active {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  border-color: var(--primary-dark);
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4);
}

.category-item.active .category-icon {
  transform: scale(1.1);
}

.category-item.active .category-name {
  color: white;
  font-weight: 600;
}

.category-icon {
  font-size: 1.75rem;
  transition: transform 0.3s ease;
}

.category-name {
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* 热门食物 */
.food-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.food-item {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.food-item:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow);
}

.food-cal {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 4px;
}

.cal-unit {
  font-size: 0.625rem;
  font-weight: 400;
}

.food-name {
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 2px;
}

.food-unit {
  font-size: 0.625rem;
  color: var(--text-light);
}

/* 食物列表 */
.result-count {
  font-size: 0.75rem;
  color: var(--text-light);
  font-weight: 400;
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.food-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--background-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.food-list-item:hover {
  background: #dcfce7;
}

.food-list-info {
  flex: 1;
}

.food-list-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.food-list-nutrition {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.food-list-cal {
  text-align: right;
  padding-left: 12px;
}

.cal-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.cal-label {
  font-size: 0.625rem;
  color: var(--text-light);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.modal-content {
  width: 100%;
  max-height: 90vh;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 20px;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 1.125rem;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--background-color);
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.food-detail-cal {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 16px;
  margin-bottom: 16px;
}

.cal-big {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.nutrition-item {
  text-align: center;
  padding: 12px;
  background: var(--background-color);
  border-radius: 12px;
}

.nutrition-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nutrition-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.add-to-meal h4 {
  font-size: 0.9375rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.weight-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.weight-input label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.weight-input input {
  width: 100px;
}

.weight-unit {
  color: var(--text-light);
  font-size: 0.875rem;
}

.calculated-cal {
  padding: 12px;
  background: var(--background-color);
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.calculated-cal strong {
  color: var(--primary-dark);
  font-size: 1rem;
}

.meal-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.meal-btn {
  padding: 10px 6px;
  font-size: 0.75rem;
}

/* 自定义食物 */
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.custom-result {
  padding: 16px;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 12px;
  border: 2px solid var(--primary-color);
}

.result-item {
  font-size: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-cal-value {
  color: var(--primary-dark);
  font-size: 1.5rem;
  font-weight: 700;
}

.result-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(22, 101, 52, 0.2);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.custom-hint {
  padding: 12px;
  background: var(--background-color);
  border-radius: 12px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.custom-add-btn {
  margin-top: 8px;
}

/* 餐食记录 */
.meals-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-section {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.meal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--background-color);
}

.meal-icon {
  font-size: 1.25rem;
}

.meal-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.meal-total {
  margin-left: auto;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.meal-items {
  padding: 8px;
}

.meal-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: var(--background-color);
  border-radius: 8px;
  margin-bottom: 8px;
}

.meal-item:last-child {
  margin-bottom: 0;
}

.meal-item-info {
  flex: 1;
}

.meal-item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.meal-item-weight {
  font-size: 0.75rem;
  color: var(--text-light);
}

.meal-item-cal {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-dark);
  padding: 0 12px;
}

.meal-item-remove {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.875rem;
  cursor: pointer;
}

.meal-empty {
  padding: 16px;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--text-light);
}

/* 热量汇总 */
.summary-cal {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
}

.summary-total, .summary-recommended {
  text-align: center;
}

.total-value, .recommended-value {
  font-size: 1.75rem;
  font-weight: 700;
}

.total-value {
  color: var(--primary-dark);
}

.recommended-value {
  color: var(--text-secondary);
}

.total-label, .recommended-label {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 4px;
}

.summary-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

.summary-bar {
  margin: 16px 0;
}

.bar-bg {
  height: 12px;
  background: var(--background-color);
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-light) 0%, var(--primary-color) 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.bar-fill.over {
  background: linear-gradient(90deg, #fecaca 0%, #f87171 100%);
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--text-light);
}

.summary-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.summary-status.normal {
  background: #dcfce7;
  color: var(--primary-dark);
}

.summary-status.low {
  background: #fef3c7;
  color: #92400e;
}

.summary-status.high {
  background: #fee2e2;
  color: #991b1b;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.user-settings h4 {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-item label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* 运动换算 */
.exercise-select, .exercise-time {
  margin-bottom: 16px;
}

.exercise-select label, .exercise-time label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.time-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.time-btn:hover {
  border-color: var(--primary-color);
}

.time-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.exercise-result {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 16px;
  margin-bottom: 12px;
}

.exercise-icon {
  font-size: 2rem;
  margin-right: 16px;
}

.exercise-info {
  flex: 1;
}

.exercise-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.exercise-time-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

.exercise-calories {
  text-align: right;
}

.exercise-cal-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.exercise-cal-label {
  font-size: 0.75rem;
  color: var(--text-light);
}

.exercise-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  padding: 12px;
  background: var(--background-color);
  border-radius: 12px;
  margin-bottom: 20px;
}

.exercise-compare h4 {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.compare-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.compare-input input {
  flex: 1;
}

.compare-unit {
  color: var(--text-light);
  font-size: 0.875rem;
}

.compare-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compare-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: var(--background-color);
  border-radius: 12px;
}

.compare-icon {
  font-size: 1.25rem;
  margin-right: 12px;
}

.compare-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.compare-time {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-dark);
}

/* 食谱推荐 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.recipe-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.recipe-item:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow);
}

.recipe-image {
  height: 120px;
  background-size: cover;
  background-position: center;
}

.recipe-info {
  padding: 12px;
}

.recipe-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.recipe-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
}

/* 食谱详情弹窗 */
.recipe-modal {
  max-height: 85vh;
}

.recipe-detail-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  margin-bottom: 16px;
}

.recipe-detail-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipe-cal-badge {
  align-self: flex-start;
}

.recipe-detail-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.recipe-section h4 {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.recipe-section p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  padding: 12px;
  background: var(--background-color);
  border-radius: 12px;
}

/* 数据操作 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 底部 */
.footer {
  text-align: center;
  padding: 24px 0;
  margin-top: 16px;
}

.footer-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.footer-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.footer-copyright {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 12px;
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .food-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .meal-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 320px) {
  .food-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* 刘海屏适配 */
@supports (padding-top: env(safe-area-inset-top)) {
  .modal-overlay {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
