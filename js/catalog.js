// catalog js
let catalog = document.getElementById("catalog");
let catalogTopHeight = catalog.offsetTop;
// console.log(catalogTopHeight)
let tocElement = document.getElementsByClassName("catalog-content")[0]

// console.log("catalog " + document.title)
// console.log("catalog js " + catalog)

// $(".post-catalog li > .toc-child :has(.toc-child)").each((index, element) => {

// 是否固定目录
function changePos() {
  // console.log("scroll")
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > catalogTopHeight - 20) {
    // console.log("@!!! fixed !!!@")
    catalog.style = "position: fixed; top: 20px; bottom: 20px;"
  } else {
    // console.log("@!!! absolute !!!@")
    catalog.style = "position: absolute; top: calc(290px + 88px + 30px)"
  }
}

// // 是否激活目录
// function isActiveCat() {
//   // 可宽限高度值
//   let offsetHeight = 20

//   // 当前页面滚动位置距页面顶部的高度值
//   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

//   // 页面所有标题列表
//   let headerLinkList = document.getElementsByClassName("headerlink")

//   // 页面所有目录列表
//   let catLinkList = document.getElementsByClassName("toc-link")

//   for(let i = 0; i < catLinkList.length; i++) {
//     console.log(headerLinkList)
//     let currentTopCat = headerLinkList[i].offsetTop - offsetHeight
//     let nextTopCat = i + 1 === headerLinkList.length ?
//         Infinity : headerLinkList[i+1].offsetTop - offsetHeight

//     if (scrollTop >= currentTopCat && scrollTop < nextTopCat) {
//       // 目录跟随滚动
//       catLinkList[i].className = "toc-link active"
//       tocElement.scrollTop = catLinkList[i].offsetTop - 32
//     } else {
//       catLinkList[i].className = "toc-link"
//     }
//   }
// }

// 窗体高度变化时
function handleResize() {
  // console.log("handle")
  let windowHeight = document.documentElement.clientHeight
  tocElement.setAttribute('style', `height: ${windowHeight * 0.5}px`);
}

// console.log("catalog js")

changePos();
// isActiveCat();
handleResize();
document.addEventListener("scroll", changePos, false);
// document.addEventListener("scroll", isActiveCat, false);
window.addEventListener("resize", handleResize, false);
