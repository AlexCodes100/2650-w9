class Node {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
  }
  
  class LinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
  
    addNode(value) {
      const newNode = new Node(value);
      if (this.tail) {
        this.tail.next = newNode;
        this.tail = newNode;
      } else {
        this.head = newNode;
        this.tail = newNode;
      }
      this.length += 1;
      return newNode;
    }
  
    getHead() {
      return this.head;
    }
  
    getLength() {
      return this.length;
    }
  }
  
  // Create and populate the linked list
  const linkedList = new LinkedList();
  linkedList.addNode(1);
  linkedList.addNode(2);
  linkedList.addNode(3);
  
  export default linkedList;
  