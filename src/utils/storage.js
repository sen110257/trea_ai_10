const STORAGE_KEYS = {
  MEAL_RECORDS: 'calorie_meal_records',
  SEARCH_HISTORY: 'calorie_search_history',
  CUSTOM_FOODS: 'calorie_custom_foods',
  USER_PROFILE: 'calorie_user_profile'
}

export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('Storage get error:', e)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  }
}

export const mealStorage = {
  getTodayRecords() {
    const today = new Date().toDateString()
    const allRecords = storage.get(STORAGE_KEYS.MEAL_RECORDS) || {}
    return allRecords[today] || { breakfast: [], lunch: [], dinner: [], snack: [] }
  },

  saveTodayRecords(records) {
    const today = new Date().toDateString()
    const allRecords = storage.get(STORAGE_KEYS.MEAL_RECORDS) || {}
    allRecords[today] = records
    storage.set(STORAGE_KEYS.MEAL_RECORDS, allRecords)
  },

  addMealItem(mealType, item) {
    const records = this.getTodayRecords()
    if (records[mealType]) {
      records[mealType].push({
        ...item,
        id: Date.now()
      })
      this.saveTodayRecords(records)
    }
    return records
  },

  removeMealItem(mealType, itemId) {
    const records = this.getTodayRecords()
    if (records[mealType]) {
      records[mealType] = records[mealType].filter(item => item.id !== itemId)
      this.saveTodayRecords(records)
    }
    return records
  },

  clearTodayRecords() {
    const today = new Date().toDateString()
    const allRecords = storage.get(STORAGE_KEYS.MEAL_RECORDS) || {}
    allRecords[today] = { breakfast: [], lunch: [], dinner: [], snack: [] }
    storage.set(STORAGE_KEYS.MEAL_RECORDS, allRecords)
  },

  calculateTotalCalories() {
    const records = this.getTodayRecords()
    let total = 0
    Object.values(records).forEach(meals => {
      meals.forEach(meal => {
        total += meal.totalCalories || 0
      })
    })
    return total
  }
}

export const searchHistoryStorage = {
  get() {
    return storage.get(STORAGE_KEYS.SEARCH_HISTORY) || []
  },

  add(term) {
    if (!term || term.trim() === '') return
    let history = this.get()
    history = history.filter(item => item !== term)
    history.unshift(term)
    if (history.length > 20) {
      history = history.slice(0, 20)
    }
    storage.set(STORAGE_KEYS.SEARCH_HISTORY, history)
    return history
  },

  clear() {
    storage.remove(STORAGE_KEYS.SEARCH_HISTORY)
    return []
  }
}

export const customFoodStorage = {
  get() {
    return storage.get(STORAGE_KEYS.CUSTOM_FOODS) || []
  },

  add(food) {
    const foods = this.get()
    foods.push({
      ...food,
      id: Date.now(),
      isCustom: true
    })
    storage.set(STORAGE_KEYS.CUSTOM_FOODS, foods)
    return foods
  },

  remove(id) {
    const foods = this.get().filter(f => f.id !== id)
    storage.set(STORAGE_KEYS.CUSTOM_FOODS, foods)
    return foods
  }
}

export const userProfileStorage = {
  get() {
    return storage.get(STORAGE_KEYS.USER_PROFILE) || {
      gender: 'male',
      age: 25,
      weight: 65,
      height: 170,
      activityLevel: 'moderate'
    }
  },

  set(profile) {
    storage.set(STORAGE_KEYS.USER_PROFILE, profile)
  },

  calculateRecommendedCalories() {
    const profile = this.get()
    let bmr
    
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age)
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }
    
    return Math.round(bmr * (activityMultipliers[profile.activityLevel] || 1.55))
  }
}
