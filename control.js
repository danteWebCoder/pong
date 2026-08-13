const gameBox = document.querySelector("#gameBox")
const ball = document.querySelector("#ball")
const barLeft = document.querySelector("#barLeft")
const barRight = document.querySelector("#barRight")

let tempo = 200
let gameBoxSize = null
let ballSize = parseFloat(getComputedStyle(ball).getPropertyValue("width"))
let activedBar = "left" /* or right */

const getGameBoxSize = () => gameBoxSize = [gameBox.clientWidth, gameBox.clientHeight]

const getBallPos = () => { return [ball.offsetLeft, ball.offsetTop] }

const setBallToLeft = () => {
    ball.style.left = "60px"
    ball.style.top = `calc(50% - ${ballSize / 2}px)`
}

const setBallToRight = () => {
    ball.style.left = `calc(100% - (${ballSize}px + 60px))`
    ball.style.top = `calc(50% - ${ballSize / 2}px)`
}

const activeShoot = () => {
    document.addEventListener("keypress", (e) => {
        e.code = "space" && console.log("activar movimiento de ball ")
    })
}

const toggleSizeBar = () => {

}

const init = async () => {
    getGameBoxSize()
/*     setBallToLeft()
 */
/*     activeShoot()
 */}

init()