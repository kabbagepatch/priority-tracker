<template>
  <div class="container">
    <h1>Track Your Habits</h1>
    <div class="habit-list">
      <ul>
        <li>
          <div class="habit-name">
            Name
          </div>
          <div class="date" v-for="date in datesHeaders" :key="date">
            {{ date }}
          </div>
          <div :style="{ width: '85px' }" />
        </li>
        <li v-for="habitId in Object.keys(habitsData)" :key="habitId">
          <div class="habit-name">
            {{ habitsData[habitId].name }}
          </div>
          <div class="date" v-for="date in dates" :key="date" :class="habitsData[habitId].marks.includes(date) ? 'green' : ''">
            <div :class="habitsData[habitId].marks.includes(date) ? 'mark-button marked-button' : 'mark-button'" @click="toggleHabit(habitId, date)">
              ✓
            </div>
          </div>
          <button @click="removeHabit(habitId)">
            Remove
          </button>
        </li>
      </ul>
    </div>
    <br />
    <form class="habit-form" @submit.prevent="addHabit">
      <h2>Add Habit To Track</h2>
      <label for="input">Name</label>
      <input v-model="newHabit.name" />
      <label for="input">Number of Skip days allowed</label>
      <input v-model="newHabit.skipsPerWeekAllowed" type="number" />
      <div><button type="submit">Add</button></div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import subDays from 'date-fns/subDays'

export default {
  name: 'Habits',
  data () {
    return {
      newHabit: {
        name: ''
      }
    }
  },
  computed: {
    ...mapState({
      habitsData: state => state.habits.habitsData,
    }),
    dates: () => eachDayOfInterval({
      start: subDays(new Date(), 7),
      end: new Date()
    }).map(d => format(d, 'yyyy-MM-dd')),
    datesHeaders: () => eachDayOfInterval({
      start: subDays(new Date(), 7),
      end: new Date()
    }).map(d => format(d, 'MM/dd')),
  },
  mounted () {
    this.$store.dispatch('habits/getHabitsData');
  },
  methods: {
    addHabit () {
      this.$store.dispatch('habits/addHabit', this.newHabit)
    },
    removeHabit (habitId) {
      this.$store.dispatch('habits/removeHabit', habitId)
    },
    toggleHabit (habitId, markDate) {
      if (this.habitsData[habitId].marks.includes(markDate))
        this.$store.dispatch('habits/unmarkHabit', { habitId, markDate })
      else
        this.$store.dispatch('habits/markHabit', { habitId, markDate })
    }
  }
};
</script>

<style scoped>
  .container {
    width: 100%;
  }
  .habit-name {
    width: 100px;
  }
  .green {
    color: rgb(0, 180, 0);
  }
  ul {
    list-style-type: none;
    padding-top: 20px;
    padding-left: 0;
  }
  li {
    width: 100%;
    padding: 5px 0;
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
  }
  li:first-child {
    font-weight: bold;
    margin-bottom: 15px;
  }
  .date {
    width: 150px;
    display: flex;
    justify-content: center;
  }
  .mark-button {
    border: 1px solid #33333333;
    border-radius: 50%;
    font-weight: bold;
    padding: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .marked-button {
    border: 2px solid rgb(0, 180, 0);
  }
  .habit-form {
    display: flex;
    flex-direction: column;
  }
  .habit-form * {
    margin: 5px 0;
  }
</style>