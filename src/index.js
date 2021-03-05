class Animal {
  constructor(name) {
      this.name = name;
  }
  getName() {
      return this.name;
  }
}

const dog = new Animal('dog');
import './index.less';
// import '../public/index.html'
if(module && module.hot) {
  module.hot.accept()
}

//需要将 localhost:3000 转发到 localhost:4000（服务端） 端口
// fetch("/api/user")
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err));