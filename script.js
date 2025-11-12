const bodyElm = document.body
const navBtn = document.getElementById("nav-btn")
const navBtnImg = navBtn.children[0]
const navMenu = document.getElementById("nav-menu")
const navOptions = Array.from(navMenu.children[0].children)
const darkBg = document.getElementById("dark-bg")

const navClose = () => {
  darkBg.dataset.animation = "fade-in-reverse"
  bodyElm.dataset.overflow = "visible"
  navBtn.setAttribute("aria-expanded", "false")
  navMenu.dataset.animation = "fade-in-reverse"
  navMenu.dataset.state = "loading"
  navBtnImg.src = "./images/icon-hamburger.svg"
}

navBtn.addEventListener("click",() => {
  if(navBtn.getAttribute("aria-expanded") === "false" ) {
    darkBg.dataset.animation = "fade-in"
    darkBg.dataset.state = "active"
    bodyElm.dataset.overflow = "hidden"
    navBtn.setAttribute("aria-expanded","true")
    navMenu.dataset.animation = "fade-in"
    navMenu.dataset.state = "expanded"
    navBtnImg.src = "./images/icon-close.svg"
  }
  else {
    navClose()
  }
})

if(window.matchMedia("(max-width:40.01rem)").matches) {
  navOptions.forEach((li) => {
    li.addEventListener("click", navClose)
  })
}

navMenu.addEventListener("animationend",() => {
  navMenu.dataset.animation = "none"
  darkBg.dataset.animation = "none"
  
  if(navMenu.dataset.state === "loading") {
    darkBg.dataset.state = "hidden"
    navMenu.dataset.state = "collapsed"
  }
})

const mainImg = document.getElementById("main-img")
const prevImg = document.getElementById("prev-img")
const nextImg = document.getElementById("next-img")
const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")
const heroSection = document.getElementById("hero-section")
const imgTitle = document.getElementById("image-title")
const imgDescription = document.getElementById("image-description")

const img_no = (no,path) => {
  if (path.length <= no) {
    return 0
  }
  if (0 > no) {
    return path.length - 1
  }
  else {
    return no
  }
}

const populateDOM = async () => {
  try {
    const getJson = await fetch("./text.json")
    const data = await getJson.json()
    
    let desktopImgsSrc = []
    let mobileImgsSrc = []
    let titles = []
    let descriptions = []
    
    for (let i = 0; i < Object.keys(data).length; i++) {
      desktopImgsSrc.push(data[i].image.desktop)
      mobileImgsSrc.push(data[i].image.mobile)
      titles.push(data[i].title)
      descriptions.push(data[i].description)
    }
    
    let mainImgNo = 0
    let nextImgNo = 1
    let prevImgNo = desktopImgsSrc.length - 1
    
    const nextSlide = () => {
      nextImg.children[1].dataset.animation = "slide-next"
      mainImg.children[1].dataset.animation = "slide-next"
      
      mainImgNo = img_no(++mainImgNo, desktopImgsSrc)
      nextImgNo = img_no(++nextImgNo, desktopImgsSrc)
      prevImgNo = img_no(++prevImgNo, desktopImgsSrc)
      
      heroSection.dataset.animation = "fade-in-reverse"
      
      nextBtn.disabled = true
    }
    
    nextBtn.addEventListener("click", nextSlide)
    nextBtn.addEventListener("ArrowRight", nextSlide)
    
    const previousSlide = () => {
      prevImg.children[1].dataset.animation = "slide-prev"
      mainImg.children[1].dataset.animation = "slide-prev"
      
      mainImgNo = img_no(--mainImgNo, desktopImgsSrc)
      nextImgNo = img_no(--nextImgNo, desktopImgsSrc)
      prevImgNo = img_no(--prevImgNo, desktopImgsSrc)
      
      heroSection.dataset.animation = "fade-in-reverse"
      
      prevBtn.disabled = true
    }
    
    prevBtn.addEventListener("click", previousSlide)
    prevBtn.addEventListener("ArrowLeft", previousSlide)
    
    heroSection.addEventListener("animationend", () => {
      imgTitle.innerText = titles[mainImgNo]
      imgDescription.innerText = descriptions[mainImgNo]
      heroSection.dataset.animation = "fade-in"
    })
    
    mainImg.addEventListener("animationend",() => {
      
      mainImg.children[0].srcset = desktopImgsSrc[mainImgNo]
      mainImg.children[1].src = mobileImgsSrc[mainImgNo]
      mainImg.alt = `image ${mainImgNo + 1}`
      
      nextImg.children[0].srcset = desktopImgsSrc[nextImgNo]
      nextImg.children[1].src = mobileImgsSrc[nextImgNo]
      
      prevImg.children[0].srcset = desktopImgsSrc[prevImgNo]
      prevImg.children[1].src = mobileImgsSrc[prevImgNo]
      
      mainImg.children[1].dataset.animation = "none"
      nextImg.children[1].dataset.animation = "none"
      prevImg.children[1].dataset.animation = "none"
      heroSection.dataset.animation = "none"
      
      nextBtn.disabled = false
      prevBtn.disabled = false
    })
  }
  catch(error) {
    console.error(error)
  }
}

populateDOM()