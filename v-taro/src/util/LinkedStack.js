class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedStack {
  constructor(max) {
    this.head = null;
    this.length = 0;
    this.max = max;
  }
  // 设置最大长度
  setMax(max) {
    if (max <= 0)
      return;
    if (max < this.length) {
      let now = this.head;
      for (let i = 0; i < max - 1; i++)
        now = now.next;
      now.next = null;
      this.length = max;
    }
    this.max = max;
  }
  // 压入
  push(value) {
    if (this.length >= this.max)
      return;
    let newNode = new Node(value);
    if (this.length === 0) {
      this.head = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }
  // 弹出
  pop() {
    if (this.length === 0) {
      return null;
    } else {
      let res = this.head.value;
      this.head = this.head.next;
      this.length--;
      return res;
    }
  }
  // 强制压入并挤掉栈尾的
  send(value) {
    if (this.length === this.max) {
      let newNode = new Node(value);
      let now = this.head;
      for (let i = 0; i < this.length - 2; i++)
        now = now.next;
      now.next = null;
      newNode.next = this.head;
      this.head = newNode;
    } else {
      this.push(value);
    }
  }
}
module.exports = LinkedStack;