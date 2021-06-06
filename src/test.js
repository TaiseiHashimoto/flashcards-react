var myObject = {
  value: 1,
  show: function() {
    console.log(this.value); // 注１

    show2 = () => {
      console.log(this.value);
    }
    // function show() {
    //   console.log(this.value); // 注２
    // }
    show2();
  }
};
myObject.value = 10;
myObject.show();
