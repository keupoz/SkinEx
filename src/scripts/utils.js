String.prototype.toNormalCase = function () {
  return this[0].toUpperCase() + this.substr(1).toLowerCase().replace(/_/g, ' ');
};
