let express = require('express');

let app = express();

app.get('/user', (req, res) => {
    res.json({name: '周星星'});
});

app.listen(4000);

///执行代码(run code)，现在我们可以在浏览器中访问到此接口: http://localhost:4000/api/user
