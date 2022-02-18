const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')

const exp = express()

const db = require('./connection/db')
const upload = require('./middleware/multer')

exp.set('view engine', 'hbs')

exp.use('/public', express.static(__dirname + '/public'))
exp.use('/upload-images', express.static(__dirname + '/upload-images'))
exp.use(express.urlencoded({ extended: false }))

exp.use(flash())

exp.use(
  session({
      cookie: {
          maxAge: 1000 * 60 * 60 * 2,
          secure: false,
          httpOnly: true
      },
      store: new session.MemoryStore(),
      saveUninitialized: true,
      resave: false,
      secret: "secretValue"
  })
)

// const blogs = [
//     {
//         name: "Dumbways App 2021",
//         startdate : "10 Feb 2022",
//         enddate : "13 Apr 2022",
//         duration: "3 Bulan",
//         description: "Some quick example text to build on the Dumbways Mobile App 2021 and make up the bulk of the card's content. ",
//         technologies: {node: true, react: true, next: true, typescript : true}
//     }
// ]


exp.get('/', (req, res) => {
    res.redirect('/home')
})

exp.get('/home', (req, res) => {

  let select

  if(req.session.isLogin){
    select = `SELECT tb_projects.id , name_project, description , startdate, enddate, technologies , image, name AS author
                FROM tb_projects
                INNER JOIN tb_users
                ON tb_users.id = tb_projects.project_id
                WHERE project_id = ${req.session.user.id}
                ORDER BY id DESC`

  } else{
    select = `SELECT tb_projects.id , name_project, description , startdate, enddate, technologies , image, name AS author
                FROM tb_projects
                INNER JOIN tb_users
                ON tb_users.id = tb_projects.project_id
                ORDER BY id DESC`
  }
   

  db.connect((err, client, done) => {
    if (err) throw err

    client.query(select, (err, result) => {
        done()

        if (err) throw err
        let data = result.rows

        console.log(data)
        data = data.map((blog) => {
            return {
                ...blog,
                duration : daterange(blog.enddate, blog.startdate),
                node : blog.technologies[0] == 'node',
                react : blog.technologies[1] == 'react',
                next : blog.technologies[2] == 'next',
                typescript : blog.technologies[3] == 'typescript',
                isLogin: req.session.isLogin
            }
        })

        res.render('index', {blogs : data , isLogin: req.session.isLogin, user: req.session.user})
    })
})
})


exp.post('/home', upload.single('image') ,(req, res) => {
    let {name,description,startdate,enddate,node,react,next,typescript} = req.body

    blog = {
      image : req.file.filename,
      project_id: req.session.user.id
    }

    db.connect((err, client, done) => {
      if (err) throw err

      let insert = `INSERT INTO tb_projects (name_project, description, enddate, startdate, technologies, image ,project_id) VALUES ('${name}', '${description}' , '${enddate}' , '${startdate}' , '{${node},${react},${next},${typescript}}', '${blog.image}', '${blog.project_id}' )`
      client.query(insert, (err, result) => {
          done()

          if (err) throw err
          result = result.rows

          res.redirect('/home')
      })
  })  

})


exp.get('/detail/:id', (req, res) => {
  let {id} = req.params

  db.connect((err, client, done) => {
      if (err) throw err

      let select = `SELECT * FROM tb_projects WHERE id = ${id}`
      client.query(select, (err, result) => {
          done()

          if (err) throw err
          result = result.rows[0]
          
          res.render('detail', { blog: result , duration: daterange(result.enddate, result.startdate) , 
            start : getFullTime(result.startdate), end : getFullTime(result.enddate) ,
            node: result.technologies[0] == 'node' ,
            react: result.technologies[1] == 'react' ,
            next: result.technologies[2] == 'next' , 
            typescript: result.technologies[3] == 'typescript'})
      })
  })
})

exp.get('/update/:id', (req, res) => {

  let {id} = req.params

  db.connect((err, client, done) => {
    if (err) throw err

    let select = `SELECT * FROM tb_projects WHERE id = ${id}`
    client.query(select, (err, result) => {
        done()

        if (err) throw err
        result = result.rows[0]
        console.log(result)

        res.render('update', {blog: result, start: convertdate(result.startdate), end: convertdate(result.enddate)})
    })
})
})


exp.post('/update/:id', upload.single('image') , (req,res) =>{
  let {id} = req.params
  let {name,startdate,enddate,description,node,react,next,typescript} = req.body

  blog = {
    image : req.file.filename
  }

  db.connect((err, client, done) => {
    if (err) throw err

    let update = `UPDATE tb_projects SET name_project='${name}', startdate='${startdate}', enddate='${enddate}' ,description='${description}', technologies='{${node},${react},${next},${typescript}}' ,image='${blog.image}' WHERE id = ${id}`
    client.query(update, (err) => {
        done()

        if (err) throw err
        res.redirect('/home')
    })
})

})

exp.get('/delete/:id', (req, res) => {

    let {id} = req.params
    
    db.connect((err, client, done) => {
      if (err) throw err

      let Delete = `DELETE FROM tb_projects WHERE id = ${id}`
      client.query(Delete, (err, result) => {
          done()

          if (err) throw err
          result = result.rows[0]

          res.redirect('/home')
     })
  })
})


exp.get('/register', (req,res) =>{
  res.render('register')
})

exp.post('/register', (req, res) => {
  let { name, email, password } = req.body

  let hashPassword = bcrypt.hashSync(password, 10)

  db.connect((err, client, done) => {
      if (err) throw err

      let insert = `INSERT INTO tb_users(name, email, password) VALUES
                      ('${name}','${email}','${hashPassword}')`

      client.query(insert, (err) => {
          done()
          if (err) throw err
          req.flash('success', 'Account succesfully registered ')
          res.redirect('/login')
      })
  });
})

exp.get('/login', (req,res) =>{
  res.render('login')
})

exp.post('/login', (req, res) => {
  let { email, password } = req.body

  db.connect((err, client, done) => {
      if (err) throw err

      let insert = `SELECT * FROM tb_users WHERE email='${email}'`

      client.query(insert, (err, result) => {
          done()
          if (err) throw err

          if (result.rows.length == 0) {
              return res.redirect('/login')
          }

          let isMatch = bcrypt.compareSync(password, result.rows[0].password)

          if (isMatch) {
              req.session.isLogin = true
              req.session.user = {
                  id: result.rows[0].id,
                  email: result.rows[0].email,
                  name: result.rows[0].name
              }
              req.flash('success', 'You Completely Login To Your Accont')
              res.redirect('/home')
          } else {
              req.flash('failed', 'Account not found!')
              res.redirect('/login')
          }
      })
  })

})

exp.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/home')
})


exp.get('/contact', (req, res) => {
    res.render('contact')
})

exp.get('/add-my-project', (req, res) => {

    res.render('add-my-project')
})

const port = 5500
exp.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


let month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]


function daterange(end,start){
  const distance = new Date(end) - new Date(start)

  const milisecond = 1000
  const secondInMinute = 60
  const minuteInHour = 60
  const secondInHour = secondInMinute * minuteInHour
  const hoursInDay = 23
  const dayInMonth = 30
  const monthInYear = 12

  let yearDistance = distance / (milisecond * secondInHour * hoursInDay * dayInMonth * monthInYear)
    
  if (yearDistance >= 1) {
    return Math.floor(yearDistance) + ' Tahun'
  } else{
    let monthDistance =  distance / (milisecond * secondInHour * hoursInDay *dayInMonth)

  if (monthDistance > 1) {
    return Math.floor(monthDistance) + ' Bulan'
  } else{
    let dayDistance = distance / (milisecond * secondInHour * hoursInDay) 

  if (dayDistance > 1){
    return Math.floor(dayDistance) + ' Hari'
  }
  }
  }
}


function getFullTime(time) {
  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()

  
  return `${date} ${month[monthIndex]} ${year} `
}

function convertdate(time) {
  let date = time.getDate()
  let month = time.getMonth()
  let year = time.getFullYear()

  if(date < 10){
    date = "0" + date;
  }

  if(month < 10){
    month = "0" + month;
  }
  return `${year}-${month}-${date}`
}


