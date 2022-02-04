let blogs = []

let indexMonths = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
]


function addBlog(event){

    event.preventDefault()

    let title = document.getElementById('input-blog-title').value
    let content = document.getElementById('input-blog-content').value
    let image = document.getElementById('input-blog-image')

    image = URL.createObjectURL(image.files[0])

    let blog = {
        author :"Jemmy",
        title,
        content,
        image,
        postAt : new Date()
    }

     blogs.push(blog)

    renderBlog()

}

function renderBlog(){
    let lengthData = blogs.length

    let blogContainer = document.getElementById('contents')
    blogContainer.innerHTML = firstBlogContent()

    for(let i = 0; i < lengthData; i++){

             console.table(blogs[i])

            blogContainer.innerHTML += `
            <div class="blog-list-item">
            <div class="blog-image">
              <img src="${blogs[i].image}" alt="" />
            </div>
            <div class="blog-content">
              <div class="btn-group">
                <button class="btn-edit">Edit Post</button>
                <button class="btn-post">Post Blog</button>
              </div>
              <h1>
                <a href="blog-detail.html" target="_blank"
                  >${blogs[i].title}</a
                >
              </h1>
              <div class="detail-blog-content">
              ${postedTime(blogs[i].postAt)} | ${blogs[i].author}
              </div>
              <p>
              ${blogs[i].content}
              </p>
              <div style="text-align:right;">
              <span style="font-size:16px; color:grey;">${distanceTime(blogs[i].postAt)}</span>
              </div>
            </div>
          </div>
            `

    }

}

setInterval(function(){
  renderBlog()
}, 1000)

function postedTime (time){
    let date = time.getDate()
    let month = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minute = time.getMinutes()

    console.log(date)
    console.log(indexMonths)
    console.log(year)
    console.log(hours)
    console.log(minute)

    return `${date} ${indexMonths[month]} ${year} ${hours}: ${minute} WIB`

}

function distanceTime(time){
    const distance = new Date() - new Date(time)

    const milisecond = 1000
    const secondInMinute = 60
    const minuteInHour = 60
    const secondInHour = secondInMinute * minuteInHour
    const hoursInDay = 23

    let dayDistance = distance / (milisecond * secondInHour * hoursInDay) 

    if (dayDistance >= 1){
      return Math.floor(dayDistance) + ' day ago'
    } else {
        let hourDistance = Math.floor(distance / (milisecond * secondInHour))

        if (hourDistance > 0) {
            return hourDistance + ' hour ago'
        } else {
          const minuteDistance =  distance / (milisecond * secondInMinute)
  
          if (minuteDistance > 0 ) {
            return Math.floor(minuteDistance)  + ' minute ago'
          }
        }

    }
}

function firstBlogContent(){
    return `
    <div class="blog-list-item">
      <div class="blog-image">
        <img src="assets/blog-img.png" alt="" />
      </div>
      <div class="blog-content">
        <div class="btn-group">
          <button class="btn-edit">Edit Post</button>
          <button class="btn-post">Post Blog</button>
        </div>
        <h1>
          <a href="blog-detail.html" target="_blank"
            >Pasar Coding di Indonesia Dinilai Masih Menjanjikan</a
          >
        </h1>
        <div class="detail-blog-content">
          12 Jul 2021 22:30 WIB | Ichsan Emrald Alamsyah
        </div>
        <p>
          Ketimpangan sumber daya manusia (SDM) di sektor digital masih
          menjadi isu yang belum terpecahkan. Berdasarkan penelitian
          ManpowerGroup, ketimpangan SDM global, termasuk Indonesia,
          meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum,
          dolor sit amet consectetur adipisicing elit. Quam, molestiae
          numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
          eligendi debitis?
        </p>
        <div style="text-align:right;">
        <span style="font-size:16px; color:grey;">1 Hours Ago</span>
        </div>
      </div>
    </div>
    
    `
    
}