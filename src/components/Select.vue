<template>
  <div
    class="vue-select"
    :class="{ open }"
    @click.stop
    @keyup.esc="hideDropdown">

    <label @click="toggleDropdown">{{ label }}</label>

    <div @click="toggleDropdown" class="vue-select--label">
      <label>{{ currentLabel }}</label>
      <IconButton icon="keyboard_arrow_down" />
    </div>

    <ul class="vue-select--options">
      <li
        v-for="option in options"
        :key="option.value"
        :class="{ selected: isSelected(option), disabled: option.disabled }"

        @click="select(option)">{{ option.label }}</li>
    </ul>
  </div>
</template>

<script>
let last = null;

function hideLast () {
  if (last) last.hideDropdown();
}

document.body.addEventListener('click', hideLast);

export default {
  props: [ 'label', 'options', 'value', 'multiple', 'max' ],

  data () {
    return {
      open: false,
      current: !this.multiple ? this.value : undefined,
      selectedList: this.multiple ? this.value.slice() : undefined
    };
  },

  computed: {
    currentLabel () {
      if (this.multiple) {
        if (this.selectedList.length)
          return this.selectedList.map(el => el.label).join(', ');
        else return 'None selected';
      } else return this.current.label;
    }
  },

  methods: {
    showDropdown () {
      this.open = true;
      hideLast();
      last = this;
    },

    hideDropdown () {
      this.open = false;
      last = null;
    },

    toggleDropdown () {
      if (this.open) this.hideDropdown();
      else this.showDropdown();
    },

    getIndex (option) {
      return this.selectedList.indexOf(option);
    },

    select (option) {
      if (option.disabled) return;

      if (this.multiple) {
        if (this.getIndex(option) !== -1) this.unselect(option);
        else if (this.selectedList.length < this.max) {
          this.selectedList.push(option);

          console.log('selectedList', JSON.parse(JSON.stringify(this.selectedList)));
          this.$emit('select', option);
          this.$emit('change', this.selectedList);
        }
      } else {
        this.current = option;

        this.hideDropdown();
        this.$emit('input', option.value);
        this.$emit('change', option);
      }
    },

    unselect (option) {
      let index = this.getIndex(option);

      if (index == -1) return;

      this.selectedList.splice(index, 1);
      this.$emit('unselect', option);
    },

    isSelected (option) {
      return this.multiple ? this.getIndex(option) !== -1 : this.current == option;
    }
  },

  watch: {
    value (newVal) {
      if (this.multiple) {
        this.selectedList.length = 0;
        newVal.forEach(item => this.selectedList.push(item));
      } else this.current = newVal;
    }
  }
}
</script>
