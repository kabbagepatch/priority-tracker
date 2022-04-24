<template>
  <div class="habits-container">
    <h1>Track Your Habits</h1>
    <div class="habit-list">
      <ul>
        <li>
          <div class="habit-name habit-name-header">
            Name
          </div>
          <div class="dates">
            <div class="date" v-for="date in datesHeaders" :key="date">
              {{ date }}
            </div>
            <div :style="{ width: '50px' }" />
          </div>
        </li>
        <li v-for="habitId in Object.keys(habitsData)" :key="habitId">
          <div class="habit-name">
            {{ habitsData[habitId].name }}
          </div>
          <div class="dates">
            <div class="date" v-for="date in dates" :key="date" :class="habitsData[habitId].marks.includes(date) ? 'green' : ''">
              <button :class="habitsData[habitId].marks.includes(date) ? 'mark-button marked-button' : 'mark-button'" @click="toggleHabit(habitId, date)">
                ✓
              </button>
            </div>
            <button class="delete" @click="removeHabit(habitId)">
              <v-icon name="trash" />
            </button>
          </div>
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
      <div class="submit-button"><button type="submit">Add</button></div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'

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
    dates: () => {
      const curDate = new Date();
      return  eachDayOfInterval({
        start: subDays(curDate, curDate.getDay()),
        end: addDays(curDate, 6 - curDate.getDay()),
      }).map(d => format(d, 'yyyy-MM-dd'));
    },
    datesHeaders: () => {
      const curDate = new Date();
      return  eachDayOfInterval({
        start: subDays(curDate, curDate.getDay()),
        end: addDays(curDate, 6 - curDate.getDay()),
      }).map(d => format(d, 'MM/dd'));
    },
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
.habits-container {
  width: 100%;
}
.habit-name {
  min-width: 100px;
  width: 10%;
  display: block;
}
.green {
  color: rgb(0, 180, 0);
}
button.delete {
  color: hsl(0, 76%, 50%);
  margin-right: 5px;
  background: transparent;
  transition: background ease 0.5s;
}
button.delete:hover {
  color: hsl(0, 75%, 60%);
  background: hsl(0, 0%, 90%);
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
  align-items: center;
}
li:first-child {
  font-weight: bold;
  margin-bottom: 15px;
}
.dates {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mark-button {
  border: 1px solid #33333333;
  background: transparent;
  color: #333333;
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
@media only screen and (max-width: 900px) {
  .habit-name-header {
    display: none;
  }
  li {
    flex-direction: column;
    align-items: flex-start;
  }
  .habit-name {
    margin-bottom: 10px;
  }
  .mark-button {
    font-size: 14px;
    width: 30px;
    height: 30px;
  }
  .date {
    font-size: 14px;
  }
}
.marked-button {
  color: rgb(0, 180, 0);
  border: 2px solid rgb(0, 180, 0);
}
.habit-form {
  display: flex;
  flex-direction: column;
}
.habit-form label {
  margin: 10px 0 5px 0;
  font-size: 15px;
}
.habit-form input, .habit-form select, .habit-form textarea {
  padding: 5px 10px;
}
.habit-form input, .habit-form select, .habit-form textarea, .habit-form fieldset {
  font-size: 14px;
  border-radius: 10px;
  border: 0.5px solid hsl(0, 0%, 20%, 0.4)
}
.submit-button {
  margin-top: 20px;
}
</style>